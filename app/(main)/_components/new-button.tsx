"use client";

import { UserSquare2 } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Item } from "./item";

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="btn btn-primary">
        <button>
          <Item label="Create a Teamspace" icon={UserSquare2} />
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
        <CreateOrganization afterCreateOrganizationUrl="/documents" />
      </DialogContent>
    </Dialog>
  );
};
