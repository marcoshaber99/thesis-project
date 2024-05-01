"use client";

import { Composer, Thread } from "@liveblocks/react-comments";
import { useThreads } from "@/liveblocks.config";

export function Comments() {
  const { threads } = useThreads();

  return (
    <div className="p-4 rounded-lg shadow-md">
      {threads.map((thread) => (
        <Thread
          className="thread mt-3 p-1 rounded-md shadow-lg border-2 border-slate-500/10 dark:border-gray-700/10"
          key={thread.id}
          thread={thread}
        />
      ))}
      <Composer className="composer mt-6  p-4 rounded-md shadow-lg  border border-slate-500/10 dark:border-gray-700/10" />
    </div>
  );
}
