"use client";
import { Composer, Thread } from "@liveblocks/react-comments";
import { useThreads } from "@/liveblocks.config";

export function Comments() {
  const { threads } = useThreads();

  return (
    <div>
      {threads.map((thread) => (
        <Thread className="thread mt-1" key={thread.id} thread={thread} />
      ))}
      <Composer className="composer mt-2" />
    </div>
  );
}
