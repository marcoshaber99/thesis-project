"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl">
        Experience the power of writing, planning, and sharing your work.
        Welcome to <span className="font-bold italic ">Harmony</span>{" "}
      </h1>

      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Harmony is the connected space where <br />
        better, faster work happens
      </h3>

      <Button className="gap-2">
        <Image src="/logo-dark.svg" width="28" height="28" alt="Logo" />
        Enter Harmony
      </Button>
    </div>
  );
};

export default Heading;
