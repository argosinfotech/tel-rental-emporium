import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
};

export function RichTextEditor({
  value,
  onChange,
  minHeight = 140,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "underline" },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "px-3 py-2 text-sm outline-none prose prose-sm max-w-none",
        style: `min-height:${minHeight}px;`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (current !== next && !(current === "<p></p>" && next === "")) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link")["href"] as
      | string
      | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btnClass = (active: boolean) =>
    `rounded p-1.5 transition-colors ${
      active ? "text-white" : "text-[#495057] hover:bg-muted"
    }`;

  return (
    <div className="overflow-hidden rounded-md border border-input bg-white focus-within:border-[#0b8a7a] focus-within:ring-2 focus-within:ring-[#0b8a7a]/20">
      <div className="flex flex-wrap gap-1 border-b border-border px-2 py-1.5">
        <button
          type="button"
          aria-label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          style={
            editor.isActive("bold")
              ? { backgroundColor: BRAND.primary }
              : undefined
          }
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          style={
            editor.isActive("italic")
              ? { backgroundColor: BRAND.primary }
              : undefined
          }
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
          style={
            editor.isActive("bulletList")
              ? { backgroundColor: BRAND.primary }
              : undefined
          }
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
          style={
            editor.isActive("orderedList")
              ? { backgroundColor: BRAND.primary }
              : undefined
          }
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Link"
          onClick={setLink}
          className={btnClass(editor.isActive("link"))}
          style={
            editor.isActive("link")
              ? { backgroundColor: BRAND.primary }
              : undefined
          }
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
