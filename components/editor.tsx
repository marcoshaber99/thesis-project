"use client";

import {
  BlockNoteEditor,
  filterSuggestionItems,
  PartialBlock,
  Block,
  InlineContent,
  StyledText,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useRoom, useSelf } from "@/liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

import { HiOutlineGlobeAlt } from "react-icons/hi";
import { Wand } from "lucide-react";

interface TextItem {
  type: "text";
  text: string;
  styles?: { bold?: boolean; italic?: boolean; [key: string]: any };
}

const aiAssistantItem = (editor: BlockNoteEditor) => ({
  title: "AI Assistant",
  onItemClick: async () => {
    const currentPosition = editor.getTextCursorPosition();
    if (
      currentPosition &&
      currentPosition.block &&
      currentPosition.block.content
    ) {
      // Simplifying assumption: all items are TextItem
      const content = (currentPosition.block.content as TextItem[])
        .map((item) => item.text)
        .join(" ");

      try {
        const response = await fetch("/api/completion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: content }),
        });

        if (!response.ok) {
          console.error(
            "Failed to fetch AI completion:",
            await response.text()
          );
          return;
        }

        const completion = await response.json();

        // Use the same insertion logic as the Hello World item
        const completionBlock: PartialBlock = {
          type: "paragraph",
          content: [{ type: "text", text: completion, styles: {} }],
        };

        editor.insertBlocks([completionBlock], currentPosition.block, "after");
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  },
  aliases: ["aiassist", "ai"],
  group: "AI Tools",
  icon: <Wand size={18} color="#8E3CCB" />,
  subtext: "Use AI to autocomplete text based on current context.",
});

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  aiAssistantItem(editor), // Add the AI Assistant item
  ...getDefaultReactSlashMenuItems(editor),
];

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
      <BlockNoteView
        editor={editor}
        theme={theme}
        editable={editable}
        slashMenu={false}
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </div>
  );
}

export default Editor;
