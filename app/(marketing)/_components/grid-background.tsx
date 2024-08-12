import React from "react";

export default function GridBackground() {
  return (
    <div className="fixed inset-0 dark:bg-[#1f1f1f] dark:bg-grid-white/[0.05] bg-grid-black/[0.08] z-0">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 bg-gradient-radial from-transparent via-background/60 to-background/80 dark:via-background/60 dark:to-background/80"></div>
    </div>
  );
}
