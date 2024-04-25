"use client";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { Room } from "@/components/room";
import Loading from "./loading";
import { ClientSideSuspense } from "@liveblocks/react";
import { Comments } from "@/components/comments";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const [showComments, setShowComments] = useState(true);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  const isOrganizationDocument = !!document.organizationId;

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar
          initialData={document}
          showComments={isOrganizationDocument && showComments}
          toggleComments={isOrganizationDocument ? toggleComments : undefined}
        />{" "}
        <Room roomId={params.documentId} fallback={<Loading />}>
          {isOrganizationDocument ? (
            <div>
              <div className="mb-32">
                <Editor
                  onChange={onChange}
                  initialContent={document.content}
                  editable={true}
                />
              </div>
              <div className="ml-14">
                <div
                  className={classNames(
                    "transition-all duration-500 ease-in-out overflow-hidden",
                    {
                      "max-h-0 opacity-0": !showComments,
                      "max-h-screen opacity-100": showComments,
                    }
                  )}
                >
                  <ClientSideSuspense fallback={<Loading />}>
                    {() => <Comments />}
                  </ClientSideSuspense>
                </div>
              </div>
            </div>
          ) : (
            <Editor
              onChange={onChange}
              initialContent={document.content}
              editable={true}
            />
          )}
        </Room>
      </div>
    </div>
  );
};

export default DocumentIdPage;
