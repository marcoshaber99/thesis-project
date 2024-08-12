import { Button } from "@/components/ui/button";

export default function Breadcrumb() {
  return (
    <Button className="bg-gradient-to-r from-[#5f8ff7] to-[#0246c6] dark:from-[#323742] dark:to-[#282f3c] px-4 py-1.5 rounded-full text-white hover:opacity-80 active:opacity-90 focus:outline-none focus:ring transition duration-150 ease-in-out flex items-center">
      <span className="mr-2 font-medium text-sm">
        ✨ Now with AI Assistance
      </span>
    </Button>
  );
}
