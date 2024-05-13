"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { CheckCircle } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();
  const [pending, setPending] = useState(false);
  const { user } = useUser();
  const pay = useAction(api.stripe.pay);

  const handleUpgrade = async () => {
    if (!user?.id) return;
    setPending(true);
    try {
      const redirectUrl = await pay({
        userId: user.id,
      });
      window.location.href = redirectUrl;
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden dark:bg-white dark:text-black ">
        <div className="relative bg-white text-slate-900 p-6 sm:p-8  ">
          <div className="absolute inset-0 bg-white dark:opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              🚀 Upgrade to Pro!
            </h2>
            <p className="text-sm sm:text-base mb-6">
              Unlock the full potential of Harmony with these amazing features:
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <span>Unlimited Organizations</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <span>Unlimited Organization Documents</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <span>Unlimited AI Assistance</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-black dark:text-white "
            onClick={handleUpgrade}
            disabled={pending}
          >
            {pending ? "Upgrading..." : "Upgrade Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
