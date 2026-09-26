import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

import api from "../api/axios";
import socket from "../socket";

import EditorToolbar from "../components/editor/EditorToolbar";
import EditorContent from "../components/editor/EditorContent";
import ShareModal from "../components/editor/ShareModal";

import "../styles/editor.css";


function Editor() {

  const { id } = useParams();
  const navigate = useNavigate();
  // STATE

  const [title, setTitle] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Share state
  const [showShareModal, setShowShareModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareError, setShareError] = useState("");

// Current user
const user = JSON.parse(localStorage.getItem("user"));

  // TIPTAP EDITOR

  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
      }),

    ],
    content: "",
    onUpdate: ({ editor }) => {

      const html = editor.getHTML();

      socket.emit(
        "document-change",
        {
          documentId: id,
          title,
          content: html,
        }
      );
    },

  });

  // FETCH DOCUMENT

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response =await api.get(`/documents/${id}`);

        const fetchedDocument =response.data.document;
        setDocument(fetchedDocument);
        setTitle(fetchedDocument.title || "");

        // Put content inside Tiptap
        if (editor) {
          editor.commands.setContent(fetchedDocument.content || "",false);
        }
      } catch (error) {
        console.error(
          "Failed to fetch document:",
          error
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

  }, [id, editor]);


  // CHECK OWNER

  const ownerId =document?.owner?._id ||document?.owner;

  const userId =user?._id || user?.id;

  const isOwner = ownerId?.toString() ===  userId?.toString();


  // SOCKET CONNECTION

  useEffect(() => {
    if (!id) return

    // Join document room

    socket.emit("join-document",id);

    // Receive changes
    const handleDocumentUpdate =(data) => {
        if (data.title !== undefined) {
          setTitle(data.title);
        }
        if (data.content !== undefined && editor) {
          const currentContent = editor.getHTML();

          // Prevent unnecessary update

          if (currentContent !==data.content) {
            editor.commands.setContent(
              data.content,
              false
            );

          }
        }

      };
    socket.on("document-updated",handleDocumentUpdate);
    // Cleanup

    return () => {

      socket.off("document-updated",handleDocumentUpdate);

    };

  }, [id, editor]);

  // TITLE CHANGE

  const handleTitleChange = (e) => {

    const newTitle = e.target.value;

    setTitle(newTitle);
    socket.emit(
      "document-change",
      {
        documentId: id,
        title: newTitle,
        content: editor
          ? editor.getHTML()
          : "",
      }
    );

  };

  // SAVE DOCUMENT

  const saveDocument = async () => {
    try {
      setSaving(true);
      const content =
        editor
          ? editor.getHTML()
          : "";

      await api.put(
        `/documents/${id}`,
        {
          title,
          content,
        }
      );

    } catch (error) {

      console.error(
        "Failed to save document:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // SHARE DOCUMENT

  const handleShare = async (e) => {

    e.preventDefault();
    if (!email.trim()) {
      setShareError(
        "Please enter a user email"
      );

      return;
    }
    try {

      setSharing(true);
      setShareError("");
      setShareMessage("");

      const response =
        await api.post(
          `/documents/${id}/share`,
          {
            email: email.trim(),
          }
        );


      setShareMessage(
        response.data.message
      );
      setEmail("");


      // Refresh document
      // to get updated collaborators

      const documentResponse =
        await api.get(
          `/documents/${id}`
        );

      setDocument(
        documentResponse.data.document
      );

    } catch (error) {

      setShareError(
        error.response?.data?.message ||
        "Failed to share document"
      );

    } finally {

      setSharing(false);

    }

  };

  // DELETE DOCUMENT

  const handleDelete = async () => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this document?"
      );
    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/documents/${id}`
      );
      navigate("/");

    } catch (error) {

      console.error(
        "Delete handle error:",
        error
      );

    }

  };

  // LOADING

  if (loading) {

    return (
      <div className="editor-loading">
        Loading document...
      </div>
    );

  }

  // PAGE


  return (

    <div className="editor-page">
      {/* =====================
          NAVBAR
      ====================== */}

      <header className="editor-navbar">
        {/* Left */}

        <div className="editor-left">

          <button
            className="back-button"
            onClick={() =>
              navigate("/")
            }
          >
            ←
          </button>

          <span className="editor-logo">
            CollabDocs
          </span>

        </div>


        {/* Actions */}

        <div className="editor-actions">

          <div className="editor-status">

            <span className="saved-dot"></span>

            {saving
              ? "Saving..."
              : "Connected"}

          </div>


          {isOwner && (

            <>
              <button
                className="share-button"
                onClick={() => {

                  setShowShareModal(
                    true
                  );

                  setShareMessage("");

                  setShareError("");

                }}
              >
                Share
              </button>


              <button
                className="delete-button"
                onClick={handleDelete}
              >
                Delete
              </button>

            </>

          )}

        </div>


        {/* User */}

        <div className="editor-user">

          <div className="avatar">

            {user?.name?.charAt(0).toUpperCase()}

          </div>
        </div>
      </header>

      {/* =====================
          EDITOR
      ====================== */}

      <main className="editor-container">


        {/* Title */}

        <input
          className="title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Document"
        />


        <div className="editor-info">
          Real-time collaboration enabled
        </div>


        {/* Toolbar */}

        <EditorToolbar editor={editor}
        />

        {/* Tiptap */}

        <EditorContent editor={editor}/>

        {/* Save */}

        <button
          className="save-button"
          onClick={saveDocument}
        >

          {saving
            ? "Saving..."
            : "Save Document"}

        </button>
      </main>

      {/* =====================
          SHARE MODAL
      ====================== */}

      <ShareModal
        show={showShareModal}
        onClose={() =>
          setShowShareModal(false)
        }
        email={email}
        setEmail={setEmail}
        sharing={sharing}
        shareMessage={shareMessage}
        shareError={shareError}
        handleShare={handleShare}
        collaborators={
          document?.collaborators
        }
      />

    </div>

  );
}
export default Editor;