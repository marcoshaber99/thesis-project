"use client";

import { Composer, Thread } from "@liveblocks/react-comments";
import { useThreads } from "@/liveblocks.config";

export function Comments() {
  const { threads } = useThreads();

  return (
    <div className="p-4 rounded-lg shadow-md">
      {threads.map((thread) => (
        <Thread
          className="thread mt-4  p-4 rounded-md shadow-xl"
          key={thread.id}
          thread={thread}
        />
      ))}
      <Composer className="composer mt-6  p-4 rounded-md shadow-xl" />
    </div>
  );
}
