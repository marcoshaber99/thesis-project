"use client";

import {
  Book,
  ChevronsLeft,
  HomeIcon,
  Lock,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
  Users,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

import { useOrganizationList } from "@clerk/nextjs";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";
import { Navbar } from "./navbar";
import { NewButton } from "./new-button";
import { useUser } from "@clerk/clerk-react";
import { useAction } from "convex/react";
import { useProModal } from "@/hooks/use-pro-modal";
import { useApiMutation } from "@/hooks/use-api-mutation";

export const Navigation = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const router = useRouter();
  const settings = useSettings();

  const { onOpen } = useProModal();
  const { mutate, pending } = useApiMutation(api.documents.create);

  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = (organizationId?: string) => {
    mutate({
      title: "Untitled",
      organizationId: organizationId || undefined,
    })
      .then((documentId) => {
        if (documentId) {
          toast.success("New note created");
          router.push(`/documents/${documentId}`);
        }
      })
      .catch(() => {
        toast.error("Failed to create a new note");
        onOpen();
      });
  };

  const { user } = useUser();
  const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
    userId: user?.id || "",
  });

  const pay = useAction(api.stripe.pay);
  const portal = useAction(api.stripe.portal);
  const [portalPending, setPortalPending] = useState(false);

  const handleUpgrade = async () => {
    if (!user?.id) return;
    setPortalPending(true);
    try {
      const action = isSubscribed ? portal : pay;
      const redirectUrl = await action({
        userId: user.id,
      });
      window.location.href = redirectUrl;
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPortalPending(false);
    }
  };
  const hasOrganizations =
    userMemberships?.data && userMemberships.data.length > 0;

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <NewButton />
          <Item
            onClick={() => handleCreate()}
            label="New page"
            icon={PlusCircle}
          />

          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/documents"
            afterLeaveOrganizationUrl="/documents"
            createOrganizationMode="modal"
            organizationProfileMode="modal"
            appearance={{
              elements: {
                rootBox: {
                  marginLeft: "1px",
                },
                organizationSwitcherTrigger:
                  "w-full px-3 py-2 rounded-md border border-border justify-between bg-secondary text-secondary-foreground mb-3 mt-2 dark:bg-muted dark:text-muted-foreground dark:border-muted",
              },
            }}
          />
        </div>
        {hasOrganizations && (
          <>
            <Item
              label="Organizations"
              icon={HomeIcon}
              className="dark:text-emerald-100/70"
            />
            {userMemberships?.data?.map((mem) => (
              <div key={mem.organization.id} className="ml-1">
                <Item label={mem.organization.name} icon={Users} />
                <DocumentList organizationId={mem.organization.id} />
                <Item
                  onClick={() => handleCreate(mem.organization.id)}
                  icon={Plus}
                  label="Add a page"
                />
              </div>
            ))}
          </>
        )}
        <div className="mt-4">
          <div>
            <Item
              label="Private"
              icon={Lock}
              className="dark:text-orange-100/70"
            />
          </div>
          <DocumentList isPrivate />
          <Item onClick={() => handleCreate()} icon={Plus} label="Add a page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-auto mb-4">
          <Item
            onClick={() => router.push("/docs/introduction")}
            icon={Book}
            label="Documentation"
          />
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params?.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
