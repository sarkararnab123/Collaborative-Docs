function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">

      {/* Bold */}
      <button
        type="button"
        className={
          editor.isActive("bold")
            ? "toolbar-button active"
            : "toolbar-button"
        }
        onClick={() =>
          editor.chain().focus().toggleBold().run()
        }
      >
        B
      </button>

      {/* Italic */}
      <button
        type="button"
        className={
          editor.isActive("italic")
            ? "toolbar-button active"
            : "toolbar-button"
        }
        onClick={() =>
          editor.chain().focus().toggleItalic().run()
        }
      >
        I
      </button>

      {/* Strike */}
      <button
        type="button"
        className={
          editor.isActive("strike")
            ? "toolbar-button active"
            : "toolbar-button"
        }
        onClick={() =>
          editor.chain().focus().toggleStrike().run()
        }
      >
        S
      </button>

      <div className="toolbar-divider"></div>

      {/* Heading 1 */}
      <button
        type="button"
        className="toolbar-button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        }
      >
        H1
      </button>

      {/* Heading 2 */}
      <button
        type="button"
        className="toolbar-button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
      >
        H2
      </button>

      <div className="toolbar-divider"></div>

      {/* Bullet List */}
      <button
        type="button"
        className="toolbar-button"
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        • List
      </button>

      {/* Ordered List */}
      <button
        type="button"
        className="toolbar-button"
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        1. List
      </button>

      <div className="toolbar-divider"></div>

      {/* Link */}
      <button
        type="button"
        className="toolbar-button"
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;

          const url = window.prompt(
            "Enter URL",
            previousUrl || ""
          );

          if (url === null) {
            return;
          }

          if (url === "") {
            editor
              .chain()
              .focus()
              .unsetLink()
              .run();

            return;
          }

          editor
            .chain()
            .focus()
            .setLink({ href: url })
            .run();
        }}
      >
        Link
      </button>

      <div className="toolbar-divider"></div>

      {/* Undo */}
      <button
        type="button"
        className="toolbar-button"
        onClick={() =>
          editor.chain().focus().undo().run()
        }
        disabled={!editor.can().undo()}
      >
        ↶
      </button>

      {/* Redo */}
      <button
        type="button"
        className="toolbar-button"
        onClick={() =>
          editor.chain().focus().redo().run()
        }
        disabled={!editor.can().redo()}
      >
        ↷
      </button>

    </div>
  );
}

export default EditorToolbar;