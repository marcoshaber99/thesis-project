"use client";

import { Home, MoreHorizontal, PlusCircleIcon, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrganizationList } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Item } from "./item";
import { OrganizationProfile } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  return (
    <ul className="space-y-1 space-x-4 mt-4">
      <Item label="Teamspaces" icon={Home} />
      {userMemberships.data?.map((membership) => (
        <div
          key={membership.organization.id}
          className="flex items-center justify-between"
        >
          <Item label={membership.organization.name} icon={Users} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground">
                <MoreHorizontal className="h-4 w-4 mr-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Invite members
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
                  <OrganizationProfile
                    appearance={{
                      elements: {
                        rootBox: {
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        organizationSwitcherTrigger: {
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          justifyContent: "space-between",
                          backgroundColor: "white",
                        },
                      },
                    }}
                  />
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </ul>
  );
};
