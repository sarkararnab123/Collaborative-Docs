import { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/editor.css";

function Editor() {
  const { id } = useParams();

  const [title, setTitle] = useState(
    id === "new" ? "Untitled Document" : "My First Document"
  );

  const [content, setContent] = useState("");

  return (
    <div className="editor-page">

      {/* Top bar */}

      <header className="editor-navbar">

        <div className="editor-left">

          <button
            className="back-button"
            onClick={() => window.history.back()}
          >
            ←
          </button>

          <span className="editor-logo">
            CollabDocs
          </span>

        </div>


        <div className="editor-status">
          <span className="saved-dot"></span>
          Saved
        </div>


        <div className="editor-user">
          <div className="avatar">
            A
          </div>
        </div>

      </header>


      {/* Editor */}

      <main className="editor-container">

        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />


        <div className="editor-info">
          Last edited just now
        </div>


        <textarea
          className="content-editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your document..."
        />

      </main>

    </div>
  );
}

export default Editor;