"use client";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useRoom, useSelf } from "@/liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export function Editor({ onChange, initialContent, editable }: EditorProps) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);
    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  if (!doc || !provider) {
    return null;
  }

  return (
    <BlockNote
      doc={doc}
      provider={provider}
      room={room}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      uploadFile={handleUpload}
      onChange={onChange}
      initialContent={initialContent}
      editable={editable}
    />
  );
}

type BlockNoteProps = {
  doc: Y.Doc;
  provider: any;
  room: any;
  theme: "light" | "dark";
  uploadFile: (file: File) => Promise<string>;
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

function BlockNote({
  room,
  theme,
  uploadFile,
  onChange,
  initialContent,
  editable,
  doc,
  provider,
}: BlockNoteProps) {
  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name || "Anonymous",
        color: userInfo?.color || "#b4e6b4",
      },
    },
    uploadFile,
  });

  const handleEditorChange = useCallback(() => {
    const updatedContent = JSON.stringify(editor.document, null, 2);
    onChange(updatedContent);
  }, [editor, onChange]);

  useEffect(() => {
    const unsubscribe = editor.onChange(handleEditorChange);
    return () => {
      unsubscribe();
    };
  }, [editor, handleEditorChange]);

  return (
    <div>
      <BlockNoteView editor={editor} theme={theme} editable={editable} />
    </div>
  );
}

export default Editor;
