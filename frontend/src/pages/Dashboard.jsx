import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/dashboard.css";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");

      setDocuments(response.data.documents);
    } catch (error) {
      console.error(
        "Failed to fetch documents:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const createDocument = async () => {
    try {
      const response = await api.post(
        "/documents",
        {
          title: "Untitled Document"
        }
      );

      const newDocument = response.data.document;

      setDocuments((prev) => [
        newDocument,
        ...prev
      ]);
    } catch (error) {
      console.error(
        "Failed to create document:",
        error
      );
    }
  };

const isOwner = (document) => {
  if (!document?.owner || !user) {
    return false;
  }

  const ownerId = document.owner._id || document.owner;

  const userId = user._id || user.id;

  return ownerId.toString() === userId.toString();
};

  return (
    <div className="dashboard">

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="logo">
          CollabDocs
        </div>

        <button
          className="new-document"
          onClick={createDocument}
        >
          + New Document
        </button>

        <div className="sidebar-section">

          <p className="section-title">
            Documents
          </p>

          {documents.map((document) => (
            <Link
              key={document._id}
              to={`/editor/${document._id}`}
              className="document-link"
            >
              📄 {document.title}
            </Link>
          ))}

        </div>

      </aside>


      {/* Main */}

      <main className="dashboard-main">

        <header className="dashboard-navbar">

          <div>
            <h1>
              My Documents
            </h1>

            <p>
              Manage and collaborate on your documents.
            </p>
          </div>

          <div className="user-section">

            <span>
              {user?.name}
            </span>

            <div className="avatar" onClick={()=>navigate("/login")}>
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>


        <section className="documents-section">

          <div className="section-header">

            <h2>
              Recent Documents
            </h2>

            <button
              className="create-button"
              onClick={createDocument}
            >
              + Create Document
            </button>

          </div>


          {loading ? (

            <p>
              Loading documents...
            </p>

          ) : documents.length === 0 ? (

            <div className="empty-state">

              <p>
                You don't have any documents yet.
              </p>

              <button
                className="create-button"
                onClick={createDocument}
              >
                Create your first document
              </button>

            </div>

          ) : (

            <div className="document-grid">

              {documents.map((document) => {

                const owner = isOwner(document);

                return (
                  <Link
                    key={document._id}
                    to={`/editor/${document._id}`}
                    className="document-card"
                  >

                    <div className="document-icon">
                      📄
                    </div>


                    <div className="document-card-content">

                      <h3>
                        {document.title}
                      </h3>

                      <p className="document-date">
                        Updated{" "}
                        {new Date(
                          document.updatedAt
                        ).toLocaleDateString()}
                      </p>


                      <div className="document-role">

                        {owner ? (
                          <span className="owner-badge">
                            Owned by you
                          </span>
                        ) : (
                          <span className="shared-badge">
                            Shared with you
                          </span>
                        )}

                      </div>

                    </div>

                  </Link>
                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;