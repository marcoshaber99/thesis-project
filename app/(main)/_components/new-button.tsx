"use client";

import { UserPlus2Icon } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Item } from "./item";

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="btn btn-primary">
        <Item label="Create a Teamspace" icon={UserPlus2Icon} />
      </DialogTrigger>
      <DialogContent className="p-0 border-none max-w-[480px] text-black">
        <CreateOrganization afterCreateOrganizationUrl="/documents" />
      </DialogContent>
    </Dialog>
  );
};
