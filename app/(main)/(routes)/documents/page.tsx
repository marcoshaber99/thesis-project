"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating note...",
      success: "Note created!",
      error: "Failed to create note",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 px-4">
      <Image
        src="think.svg"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="think.svg"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-2xl font-semibold text-center">
        Welcome to {user?.firstName}&apos;s Harmony
      </h2>
      <Button
        onClick={onCreate}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-6 py-3 shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Create a Note
      </Button>
    </div>
  );
};

export default DocumentsPage;
