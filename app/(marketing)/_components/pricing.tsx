"use client";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useState } from "react";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { SignInButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";

export default function Pricing() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
    userId: user?.id || "",
  });

  const pay = useAction(api.stripe.pay);
  const portal = useAction(api.stripe.portal);
  const [portalPending, setPortalPending] = useState(false);

  const handleUpgrade = async () => {
    if (!user?.id) return;
    setPortalPending(true);
    try {
      const action = isSubscribed ? portal : pay;
      const redirectUrl = await action({
        userId: user.id,
      });
      window.location.href = redirectUrl;
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPortalPending(false);
    }
  };

  if (!isUserLoaded || isSubscribed === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isSubscribed) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Pricing
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Choose the plan that&apos;s right for your business.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="rounded-lg border-solid border-2 bg-white border-gray-500/30  p-12 shadow-lg text-gray-800 dark:text-white dark:bg-gray-800/30">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2">Basic</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Perfect for individuals.
              </p>
            </div>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold">Free</span>
            </div>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 mb-8">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-6 w-6 fill-current" />
                Unlimited private documents
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-6 w-6 fill-current" />
                Limit of 2 documents per team
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-6 w-6 fill-current" />
                Basic AI Assistance
              </li>
              <li className="h-6"></li> {/* Spacer */}
            </ul>
            {!user ? (
              <SignInButton mode="modal">
                <Button className="w-full mt-6">Get Started</Button>
              </SignInButton>
            ) : (
              <Button className="w-full mt-6" asChild>
                <Link href="/documents">Get Started</Link>
              </Button>
            )}
          </div>
          <div className="rounded-lg border-solid border-2 bg-white border-gray-500/30  p-12 shadow-lg text-gray-800 dark:text-white dark:bg-gray-800/30">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2">Pro</h3>
              <p>For power users and teams.</p>
            </div>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold">$9.99</span>
              <span className="ml-1">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-6 w-6 fill-current" />
                Unlimited private documents
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-6 w-6 fill-current" />
                Unlimited team documents
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-6 w-6 fill-current" />
                All AI Features
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-6 w-6 fill-current" />
                Priority support
              </li>
            </ul>
            {!user ? (
              <SignInButton mode="modal">
                <Button className="w-full mt-6">Upgrade to Pro</Button>
              </SignInButton>
            ) : (
              <Button
                className="w-full mt-6"
                onClick={handleUpgrade}
                disabled={portalPending}
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
