"use client";
import {
  BlockNoteEditor,
  filterSuggestionItems,
  PartialBlock,
} from "@blocknote/core";
import { toast, Toaster } from "sonner";
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
import { LanguagesIcon, WandIcon, FileTextIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { BeatLoader } from "react-spinners";
import { nanoid } from "nanoid";
import AiToast from "./ai-toast";

interface TextItem {
  type: "text";
  text: string;
  styles?: { bold?: boolean; italic?: boolean; [key: string]: any };
}

const aiTranslateItem = (
  editor: BlockNoteEditor,
  setIsLoading: (isLoading: boolean) => void,
  setTempContent: (content: PartialBlock) => void,
  showToast: () => void
) => ({
  title: "AI Translate",
  onItemClick: async () => {
    const currentPosition = editor.getTextCursorPosition();
    if (
      currentPosition &&
      currentPosition.block &&
      currentPosition.block.content
    ) {
      const content = (currentPosition.block.content as TextItem[])
        .map((item) => item.text)
        .join(" ");
      const targetLanguage = prompt(
        "Enter the target language (e.g., 'French', 'Spanish', 'German'):"
      );
      if (!targetLanguage) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: content, targetLanguage }),
        });
        if (response.status === 429) {
          const { retryAfter } = await response.json();
          toast.error(
            `Rate limit exceeded. Please try again in ${retryAfter}.`,
            { position: "top-center" }
          );
          setIsLoading(false);
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch AI translation:", errorText);
          toast.error(
            "An error occurred during your request. Please try again."
          );
          setIsLoading(false);
          return;
        }
        const translation = await response.json();
        const translationBlock: PartialBlock = {
          id: nanoid(), // Generate a unique id for the block
          type: "paragraph",
          content: [{ type: "text", text: translation, styles: {} }],
        };
        setTempContent(translationBlock);
        editor.insertBlocks([translationBlock], currentPosition.block, "after");
        showToast();
        setIsLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("An error occurred during your request. Please try again.");
        setIsLoading(false);
      }
    }
  },
  aliases: ["translate", "ai-translate"],
  group: "AI Tools",
  icon: (
    <LanguagesIcon
      width={24}
      height={24}
      className="dark:text-cyan-400 text-purple-700 "
    />
  ),
  subtext: "Translate selected text using AI.",
});

const aiAssistantItem = (
  editor: BlockNoteEditor,
  setIsLoading: (isLoading: boolean) => void,
  setTempContent: (content: PartialBlock) => void,
  showToast: () => void
) => ({
  title: "AI Assistant",
  onItemClick: async () => {
    const currentPosition = editor.getTextCursorPosition();
    if (
      currentPosition &&
      currentPosition.block &&
      currentPosition.block.content
    ) {
      const content = (currentPosition.block.content as TextItem[])
        .map((item) => item.text)
        .join(" ");
      setIsLoading(true);
      try {
        const response = await fetch("/api/completion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: content }),
        });
        if (response.status === 429) {
          const { retryAfter } = await response.json();
          toast.error(
            `Rate limit exceeded. Please try again in ${retryAfter}.`,
            { position: "top-center" }
          );
          setIsLoading(false);
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch AI completion:", errorText);
          toast.error(
            "An error occurred during your request. Please try again."
          );
          setIsLoading(false);
          return;
        }
        const completion = await response.json();
        const completionBlock: PartialBlock = {
          id: nanoid(), // Generate a unique id for the block
          type: "paragraph",
          content: [{ type: "text", text: completion, styles: {} }],
        };
        setTempContent(completionBlock);
        editor.insertBlocks([completionBlock], currentPosition.block, "after");
        showToast();
        setIsLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("An error occurred during your request. Please try again.");
        setIsLoading(false);
      }
    }
  },
  aliases: ["aiassist", "ai"],
  group: "AI Tools",
  icon: (
    <WandIcon
      width={24}
      height={24}
      className="dark:text-cyan-400 text-purple-700 "
    />
  ),
  subtext: "Use AI to autocomplete text based on current context.",
});

const aiSummarizeItem = (
  editor: BlockNoteEditor,
  setIsLoading: (isLoading: boolean) => void,
  setTempContent: (content: PartialBlock) => void,
  showToast: () => void
) => ({
  title: "AI Summarize",
  onItemClick: async () => {
    const currentPosition = editor.getTextCursorPosition();
    if (
      currentPosition &&
      currentPosition.block &&
      currentPosition.block.content
    ) {
      const content = (currentPosition.block.content as TextItem[])
        .map((item) => item.text)
        .join(" ");
      setIsLoading(true);
      try {
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: content }),
        });
        if (response.status === 429) {
          const { retryAfter } = await response.json();
          toast.error(
            `Rate limit exceeded. Please try again in ${retryAfter}.`,
            { position: "top-center" }
          );
          setIsLoading(false);
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch AI summary:", errorText);
          toast.error(
            "An error occurred during your request. Please try again."
          );
          setIsLoading(false);
          return;
        }
        const summary = await response.json();
        const summaryBlock: PartialBlock = {
          id: nanoid(), // Generate a unique id for the block
          type: "paragraph",
          content: [{ type: "text", text: summary, styles: {} }],
        };
        setTempContent(summaryBlock);
        editor.insertBlocks([summaryBlock], currentPosition.block, "after");
        showToast();
        setIsLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("An error occurred during your request. Please try again.");
        setIsLoading(false);
      }
    }
  },
  aliases: ["summarize", "ai-summarize"],
  group: "AI Tools",
  icon: (
    <FileTextIcon
      width={24}
      height={24}
      className="dark:text-cyan-400 text-purple-700 "
    />
  ),
  subtext: "Summarize selected text using AI.",
});

const LockedAIAssistanceItem = () => ({
  title: "AI Features",
  onItemClick: () => {},
  aliases: ["ai-features", "locked-ai-features"],
  group: "AI Tools",
  icon: <Lock width={24} height={24} className="text-red-500" />,
  subtext: "Upgrade to Pro to unlock additional AI features.",
  className: "opacity-50 cursor-not-allowed",
});

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor,
  isSubscribed: boolean,
  setIsLoading: (isLoading: boolean) => void,
  setTempContent: (content: PartialBlock) => void,
  showToast: () => void
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  aiAssistantItem(editor, setIsLoading, setTempContent, showToast),
  ...(isSubscribed
    ? [
        aiTranslateItem(editor, setIsLoading, setTempContent, showToast),
        aiSummarizeItem(editor, setIsLoading, setTempContent, showToast),
      ]
    : [LockedAIAssistanceItem()]),
];

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export function Editor({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const { user } = useUser();
  const isSubscribed = useQuery(
    api.subscriptions.getIsSubscribed,
    user?.id ? { userId: user.id } : "skip"
  );

  const [showToast, setShowToast] = useState<boolean>(false);
  const [tempContent, setTempContent] = useState<PartialBlock | null>(null);
  const [editorInstance, setEditorInstance] = useState<BlockNoteEditor | null>(
    null
  );

  const handleToastAccept = () => {
    setTempContent(null); // Keep the content since it's already in the editor
    setShowToast(false);
  };

  const handleToastIgnore = () => {
    if (tempContent && tempContent.id && editorInstance) {
      editorInstance.removeBlocks([{ id: tempContent.id }]); // Use the id to remove the block
    }
    setTempContent(null);
    setShowToast(false);
  };

  const showToastMessage = () => {
    setShowToast(true);
  };

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
    <div>
      <BlockNote
        doc={doc}
        provider={provider}
        room={room}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        uploadFile={handleUpload}
        onChange={onChange}
        initialContent={initialContent}
        editable={editable}
        isSubscribed={!!isSubscribed}
        setTempContent={setTempContent}
        showToastMessage={showToastMessage}
        setEditorInstance={setEditorInstance}
      />
      {showToast && (
        <AiToast onAccept={handleToastAccept} onIgnore={handleToastIgnore} />
      )}
    </div>
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
  isSubscribed: boolean;
  setTempContent: (content: PartialBlock | null) => void;
  showToastMessage: () => void;
  setEditorInstance: (editor: BlockNoteEditor) => void;
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
  isSubscribed,
  setTempContent,
  showToastMessage,
  setEditorInstance,
}: BlockNoteProps) {
  const [isLoading, setIsLoading] = useState(false);
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
        color: userInfo?.color || "#ffb600",
      },
    },
    uploadFile,
  });

  const handleEditorChange = useCallback(() => {
    const updatedContent = JSON.stringify(editor.document, null, 2);
    onChange(updatedContent);
  }, [editor, onChange]);

  useEffect(() => {
    if (editable) {
      const unsubscribe = editor.onChange(handleEditorChange);
      return () => {
        unsubscribe();
      };
    }
  }, [editor, handleEditorChange, editable]);

  useEffect(() => {
    setEditorInstance(editor);
  }, [editor, setEditorInstance]);

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={theme}
        editable={editable}
        slashMenu={false}
      >
        {isLoading ? (
          <div className="flex items-center h-12 ml-20">
            <BeatLoader
              color="currentColor"
              size={8}
              className="text-purple-700 dark:text-cyan-400"
            />
          </div>
        ) : null}
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(
              getCustomSlashMenuItems(
                editor,
                isSubscribed,
                setIsLoading,
                setTempContent,
                showToastMessage
              ),
              query
            )
          }
        />
      </BlockNoteView>
    </div>
  );
}

export default Editor;
