import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const COLORS = ["#0affc2", "#ffea00", "#00ccf5", "#73d707", "#ff8000"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}
