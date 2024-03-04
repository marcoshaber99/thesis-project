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
        <span className="inline-block text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-cyan-400 dark:to-green-300">
          Harmony
        </span>
      </h1>

      <div className="flex items-center justify-center p-5">
        <Image src="./logo.svg" width="200" height="100" alt="Logo" />
      </div>

      <div className="text-center">
        <p className="mt-6 mb-8 text-lg leading-8 text-gray-700 dark:text-gray-200">
          Elevate Your Workflow with{" "}
          <span className="text-blue-500 leading-snug font-semibold dark:text-blue-300">
            AI-Powered
          </span>{" "}
          Assistance and{" "}
          <span className="text-blue-500 leading-snug font-semibold dark:text-blue-300">
            Collaboration
          </span>{" "}
        </p>
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
            Get Started
          </button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
