import { EditorContent as TiptapEditorContent } from "@tiptap/react";

function EditorContent({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-content-wrapper">
      <TiptapEditorContent editor={editor} />
    </div>
  );
}

export default EditorContent;