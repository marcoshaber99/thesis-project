"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <section className="w-full">
      <div className="container md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2 mb-3">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Harmony is a better way to write notes.
            </h1>
            <div className="flex items-center justify-center p-5">
              <Image src="./logo.svg" width="200" height="100" alt="Logo" />
            </div>
            <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-300">
              Create, communicate, and collaborate seamlessly — all in one
              place.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            {isAuthenticated && !isLoading && (
              <Link href="/documents" className="gap-2">
                <Button className="px-6 py-2 rounded-full focus:outline-none focus:ring transition duration-150 ease-in-out flex items-center">
                  <span className="mr-2 font-medium">Enter Harmony</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </Link>
            )}
            {!isAuthenticated && !isLoading && (
              <SignInButton mode="modal">
                <Button className="px-6 py-2 rounded-full focus:outline-none focus:ring transition duration-150 ease-in-out flex items-center">
                  <span className="mr-2 font-medium">Get Started</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </section>
  );
};

export default Heading;
