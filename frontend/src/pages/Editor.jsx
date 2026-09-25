import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import "../styles/editor.css";
import socket from "../socket";

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(
          `/documents/${id}`
        );

        const document = response.data.document;

        setTitle(document.title);
        setContent(document.content);

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

  //socket io
  useEffect(()=>{
    socket.emit("join-document",id)

    //recieve changes from other users
    socket.on("document-updated",(data)=>{
      setTitle(data.title);
      setContent(data.content);
    })
    return ()=>{
      socket.off("document-updated");
    }
  },[id])

  const handleTitleChange = (e)=>{
    const newTitle = e.target.value;
    setTitle(newTitle);

    socket.emit(
      "document-change",{
        documentId:id,
        title:newTitle,
        content
      }
    );
  }

  const handleContentChange = (e) =>{
    const newContent = e.target.value;
    setContent(newContent);

    socket.emit("document-change",{
      documentId:id,
      title,
      content:newContent
    })
  }


  const saveDocument = async () => {
    try {
      setSaving(true);

      await api.put(`/documents/${id}`, {
        title,
        content
      });

    } catch (error) {
      console.error(
        "Failed to save document:",
        error
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div>
        Loading document...
      </div>
    );
  }


  return (
    <div className="editor-page">

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


        <div className="editor-status">

          <span className="saved-dot"></span>

          {saving ? "Saving..." : "Saved"}

        </div>


        <div className="editor-user">

          <div className="avatar">
            A
          </div>

        </div>

      </header>


      <main className="editor-container">

        <input
          className="title-input"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />


        <div className="editor-info">
          Document ID: {id}
        </div>


        <textarea
          className="content-editor"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="Start writing your document..."
        />


        <button
          className="save-button"
          onClick={saveDocument}
        >
          Save Document
        </button>

      </main>

    </div>
  );
}

export default Editor;