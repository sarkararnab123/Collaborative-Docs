import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import socket from "../socket";

import "../styles/editor.css";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [document, setDocument] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareError, setShareError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  /*
   * Fetch document
   */

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(
          `/documents/${id}`
        );

        const fetchedDocument =
          response.data.document;

        setDocument(fetchedDocument);

        setTitle(fetchedDocument.title);
        setContent(fetchedDocument.content);

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
  }, [id]);


  /*
   * Check whether current user is owner
   */

const ownerId = document?.owner?._id || document?.owner;

const userId = user?._id || user?.id;

const isOwner = ownerId?.toString() === userId?.toString();


  /*
   * Join Socket.IO room
   */

  useEffect(() => {
    socket.emit(
      "join-document",
      id
    );

    socket.on(
      "document-updated",
      (data) => {
        setTitle(data.title);
        setContent(data.content);
      }
    );

    return () => {
      socket.off("document-updated");
    };
  }, [id]);


  /*
   * Title changes
   */

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;

    setTitle(newTitle);

    socket.emit(
      "document-change",
      {
        documentId: id,
        title: newTitle,
        content
      }
    );
  };


  /*
   * Content changes
   */

  const handleContentChange = (e) => {
    const newContent = e.target.value;

    setContent(newContent);

    socket.emit(
      "document-change",
      {
        documentId: id,
        title,
        content: newContent
      }
    );
  };


  /*
   * Save document
   */

  const saveDocument = async () => {
    try {
      setSaving(true);

      await api.put(
        `/documents/${id}`,
        {
          title,
          content
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


  /*
   * Share document
   */

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

      const response = await api.post(
        `/documents/${id}/share`,
        {
          email: email.trim()
        }
      );

      setShareMessage(
        response.data.message
      );

      setEmail("");

      /*
       * Refresh document so the
       * collaborators list is updated
       */

      const documentResponse =await api.get(`/documents/${id}`);

      setDocument(documentResponse.data.document);

    } catch (error) {
      setShareError(
        error.response?.data?.message ||
        "Failed to share document"
      );
    } finally {
      setSharing(false);
    }
  };


  if (loading) {
    return (
      <div>
        Loading document...
      </div>
    );
  }

  const handleDelete = async()=>{
    try {
      const deletedocs = await api.delete(`/documents/${id}`);
      navigate("/");
    } catch (error) {
      console.log("delete handle error",error);
    }
  }


  return (
    <div className="editor-page">

      {/* Navbar */}

      <header className="editor-navbar">

        <div className="editor-left">

          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            ←
          </button>

          <span className="editor-logo">
            CollabDocs
          </span>

        </div>


        <div className="editor-actions">

          <div className="editor-status">

            <span className="saved-dot"></span>

            {saving
              ? "Saving..."
              : "Connected"}

          </div>


          {isOwner && (
            <button
              className="share-button"
              onClick={() => {
                setShowShareModal(true);
                setShareMessage("");
                setShareError("");
              }}
            >
              Share
            </button>
          )}

          {
            isOwner && (
              <button className="delete-button"
              onClick={()=>{handleDelete()}}
              >
                Delete
              </button>
            )
          }

        </div>


        <div className="editor-user">

          <div className="avatar">
            {user?.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

        </div>

      </header>


      {/* Editor */}

      <main className="editor-container">

        <input
          className="title-input"
          value={title}
          onChange={handleTitleChange}
        />


        <div className="editor-info">
          Real-time collaboration enabled
        </div>


        <textarea
          className="content-editor"
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your document..."
        />


        <button
          className="save-button"
          onClick={saveDocument}
        >
          {saving
            ? "Saving..."
            : "Save Document"}
        </button>

      </main>


      {/* Share Modal */}

      {showShareModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowShareModal(false)
          }
        >

          <div
            className="share-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="share-modal-header">

              <div>
                <h2>
                  Share Document
                </h2>

                <p>
                  Add a collaborator to this document.
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() =>
                  setShowShareModal(false)
                }
              >
                ×
              </button>

            </div>


            <form onSubmit={handleShare}>

              <label>
                User email
              </label>

              <input
                type="email"
                placeholder="rahul@gmail.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />


              {shareError && (
                <p className="share-error">
                  {shareError}
                </p>
              )}


              {shareMessage && (
                <p className="share-success">
                  {shareMessage}
                </p>
              )}


              <button
                type="submit"
                className="share-submit"
                disabled={sharing}
              >
                {sharing
                  ? "Sharing..."
                  : "Share"}
              </button>

            </form>


            {document?.collaborators?.length > 0 && (
              <div className="collaborators-section">

                <h3>
                  Collaborators
                </h3>

                {document.collaborators.map(
                  (collaborator) => (
                    <div
                      key={collaborator._id}
                      className="collaborator"
                    >

                      <div className="collaborator-avatar">
                        {collaborator.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {collaborator.name}
                        </strong>

                        <p>
                          {collaborator.email}
                        </p>
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Editor;