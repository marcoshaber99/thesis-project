"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Banknote, Cog, Rocket } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { useProModal } from "@/hooks/use-pro-modal";

export const SettingsModal = () => {
  const settings = useSettings();
  const { user } = useUser();
  const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
    userId: user?.id || "",
  });

  const pay = useAction(api.stripe.pay);
  const portal = useAction(api.stripe.portal);
  const [portalPending, setPortalPending] = useState(false);
  const { onOpen } = useProModal();

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

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Harmony looks to you.
            </span>
          </div>
          <ModeToggle />
        </div>
        <div className="mt-6 ">
          <Button
            onClick={handleUpgrade}
            disabled={portalPending}
            size="sm"
            className="w-full dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
          >
            <div className="flex items-center space-x-2">
              {isSubscribed ? (
                <>
                  <Cog className="h-5 w-5  text-yellow-500 group-hover:text-yellow-600 transition-colors duration-200" />
                  <span className="text-sm font-medium text-white group-hover:text-primary transition-colors duration-200">
                    Manage Subscription
                  </span>
                </>
              ) : (
                <>
                  <Rocket className="h-5 w-5 text-yellow-500 group-hover:text-yellow-600 transition-colors duration-200" />
                  <span className="text-sm font-medium text-white group-hover:text-primary transition-colors duration-200">
                    Upgrade to Pro
                  </span>
                </>
              )}
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
