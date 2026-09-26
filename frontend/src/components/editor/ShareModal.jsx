function ShareModal({
  show,
  onClose,
  email,
  setEmail,
  sharing,
  shareMessage,
  shareError,
  handleShare,
  collaborators,
}) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="share-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
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
            type="button"
            className="close-modal"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* Share form */}
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


        {/* Collaborators */}
        {collaborators?.length > 0 && (
          <div className="collaborators-section">

            <h3>
              Collaborators
            </h3>

            {collaborators.map(
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
  );
}

export default ShareModal;