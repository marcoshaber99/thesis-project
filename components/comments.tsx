"use client";
import { Composer, Thread } from "@liveblocks/react-comments";
import { useThreads } from "@/liveblocks.config";

export function Comments() {
  const { threads } = useThreads();

  return (
    <div>
      {threads.map((thread) => (
        <Thread className="thread" key={thread.id} thread={thread} />
      ))}
      <Composer className="composer" />
    </div>
  );
}
