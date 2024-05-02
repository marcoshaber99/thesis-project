"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";

import { ModeToggle } from "@/components/mode-toggle";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Spinner } from "@/components/spinner";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50  fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />

      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2 ">
        {isLoading && <Spinner />}

        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Harmony</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Harmony</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}

        <ModeToggle />
      </div>
    </div>
  );
};
