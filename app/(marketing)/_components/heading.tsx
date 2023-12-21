"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { cn } from "@/lib/utils";

const Heading = () => {
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

      <Button className="gap-2">
        <Image src="/logo-dark.svg" width="28" height="28" alt="Logo" />
        Enter Harmony
      </Button>
    </div>
  );
};

export default Heading;
