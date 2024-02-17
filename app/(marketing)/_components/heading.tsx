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
          <span
            style={{ backgroundColor: "hsl(140deg 100% 50%)" }}
            className="px-1 text-black italic"
          >
            writing
          </span>
          ,{" "}
          <span
            style={{ backgroundColor: "hsl(50deg, 100%, 50%)" }}
            className="px-1 text-black italic"
          >
            planning
          </span>
          , and{" "}
          <span
            style={{ backgroundColor: "hsl(190deg 100% 50%)" }}
            className="bg-orange-200 px-1 text-black italic"
          >
            sharing
          </span>{" "}
          your work, all while being supported by an AI companion
        </h3>
      </div>

      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {isAuthenticated && !isLoading && (
        <Link href="/documents" className="gap-2">
          <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            Enter Harmony
          </button>
        </Link>
      )}

      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            Get Harmony
          </button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
