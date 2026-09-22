import Document from "../models/document.model.js";


// Create document
export const createDocument = async (req, res) => {
  try {
    const { title } = req.body;

    const document = await Document.create({
      title: title || "Untitled Document",
      owner: req.userId
    });

    res.status(201).json({
      message: "Document created successfully",
      document
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create document",
      error: error.message
    });
  }
};


// Get user's documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      owner: req.userId
    }).sort({
      updatedAt: -1
    });

    res.json({
      documents
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message
    });
  }
};


// Get single document
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    res.json({
      document
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch document",
      error: error.message
    });
  }
};


// Update document
export const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;

    const document = await Document.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.userId
      },
      {
        title,
        content
      },
      {
        new: true
      }
    );

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    res.json({
      message: "Document updated successfully",
      document
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update document",
      error: error.message
    });
  }
};


// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    res.json({
      message: "Document deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message
    });
  }
};