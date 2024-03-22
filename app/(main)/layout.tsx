"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

// import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";

import { Navigation } from "./_components/navigation";
import Image from "next/image";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Harmony Logo"
          width={120}
          height={120}
          className="animate-pulse duration-700"
        />
        {/* <Spinner size="lg" /> */}
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
