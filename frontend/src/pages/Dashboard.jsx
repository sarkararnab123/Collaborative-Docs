import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          CollabDocs
        </div>

        <button className="new-document">
          + New Document
        </button>

        <div className="sidebar-section">
          <p className="section-title">Documents</p>

          <Link to="/editor/1" className="document-link">
            📄 My First Document
          </Link>

          <Link to="/editor/2" className="document-link">
            📄 Project Ideas
          </Link>

          <Link to="/editor/3" className="document-link">
            📄 Meeting Notes
          </Link>
        </div>

      </aside>


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Navbar */}
        <header className="dashboard-navbar">

          <div>
            <h1>My Documents</h1>
            <p>Manage and collaborate on your documents.</p>
          </div>

          <div className="user-section">
            <span>Arnab</span>

            <div className="avatar">
              A
            </div>
          </div>

        </header>


        {/* Documents */}
        <section className="documents-section">

          <div className="section-header">
            <h2>Recent Documents</h2>

            <Link to="/editor/new">
              <button className="create-button">
                + Create Document
              </button>
            </Link>
          </div>


          <div className="document-grid">

            <Link to="/editor/1" className="document-card">

              <div className="document-icon">
                📄
              </div>

              <div>
                <h3>My First Document</h3>
                <p>Edited recently</p>
              </div>

            </Link>


            <Link to="/editor/2" className="document-card">

              <div className="document-icon">
                📄
              </div>

              <div>
                <h3>Project Ideas</h3>
                <p>Edited yesterday</p>
              </div>

            </Link>


            <Link to="/editor/3" className="document-card">

              <div className="document-icon">
                📄
              </div>

              <div>
                <h3>Meeting Notes</h3>
                <p>Edited 2 days ago</p>
              </div>

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;