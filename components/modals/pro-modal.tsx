"use client";

import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();
  const [pending, setPending] = useState(false);
  const { organization } = useOrganization();

  const handleUpgrade = async () => {
    if (!organization?.id) return;
    setPending(true);
    try {
      // TODO: Implement the upgrade logic using Stripe
      console.log("Upgrading to pro plan...");
    } finally {
      setPending(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] p-0 overflow-hidden dark:bg-white dark:text-black">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/pro.svg" alt="pro" className="object-fit" fill />
        </div>
        <div
          className={cn(
            "text-neutral-700 mx-auto space-y-6 p-6",
            font.className
          )}
        >
          <h2 className="font-medium text-lg">🚀 Upgrade to Pro!</h2>
          <div className="pl-3">
            <ul className="text-[11px] space-y-1 list-disc">
              <li>Unlimited Organizations</li>
              <li>Unlimited Organization Members</li>
              <li>Unlimited AI Assistance</li>
            </ul>
          </div>
          <Button size="sm" className="w-full">
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
