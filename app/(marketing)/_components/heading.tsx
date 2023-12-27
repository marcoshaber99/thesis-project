"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Image from "next/image";
import Link from "next/link";

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Welcome To{" "}
        <span className="inline-block text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Harmony
        </span>
      </h1>

      <div className="flex items-center justify-center p-7">
        <Image src="./logo.svg" width="200" height="100" alt="Logo" />
      </div>

      <div className="py-6">
        <h3 className="text-base sm:text-xl md:text-2xl font-medium">
          Experience the power of{" "}
          <span className="bg-green-200 px-1 text-black italic">writing</span>,{" "}
          <span className="bg-blue-200 px-1 text-black italic">planning</span>,
          and{" "}
          <span className="bg-orange-200 px-1 text-black italic">sharing</span>{" "}
          your work, all while being supported by an AI companion
        </h3>
      </div>

      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {isAuthenticated && !isLoading && (
        <Button asChild className="gap-2">
          <Link href="/documents">
            <Image src="/logo-dark.svg" width="28" height="28" alt="Logo" />
            Enter Harmony
          </Link>
        </Button>
      )}

      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button className="gap-2">
            <Image src="/logo-dark.svg" width="28" height="28" alt="Logo" />
            Get Harmony
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
