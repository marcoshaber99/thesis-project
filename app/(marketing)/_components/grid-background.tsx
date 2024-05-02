import React from "react";

export default function GridBackground() {
  return (
    <div className="fixed inset-0 dark:bg-grid-white/[0.03] bg-grid-black/[0.1] z-0">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 bg-gradient-radial from-transparent via-background/60 to-background/75 dark:via-background/30 dark:to-background/80"></div>
    </div>
  );
}
