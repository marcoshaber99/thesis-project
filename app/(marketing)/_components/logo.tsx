import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const Logo = () => {
  const { user } = useUser();
  const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
    userId: user?.id || "",
  });

  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        height="40"
        width="40"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height="40"
        width="40"
        alt="Logo"
        className="hidden dark:block"
      />
      <Link className="text-2xl font-bold tracking-tight" href="#">
        Harmony
      </Link>
      {isSubscribed && (
        <Badge
          className="text-sm font-medium dark:bg-sky-200/10"
          variant="secondary"
        >
          Pro
        </Badge>
      )}
    </div>
  );
};

export default Logo;
