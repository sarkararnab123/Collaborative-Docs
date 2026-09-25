import Document from "../models/document.model.js";
import User from "../models/user.model.js"


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
  $or: [
    { owner: req.userId },
    { collaborators: req.userId }
  ]
}).sort({
  updatedAt: -1
}).populate("owner", "name email")
.populate("collaborators", "name email");


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

  $or: [
    { owner: req.userId },
    { collaborators: req.userId }
  ]
}).populate("owner", "name email")
.populate("collaborators", "name email")

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
          $or:[
        {owner:req.userId},
        {collaborators:req.userId}
      ]
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


export const shareDocument = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "User email is required"
      });
    }

    // Find the document and make sure
    // the current user is the owner
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found or you are not the owner"
      });
    }

    // Find the user we want to add
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist"
      });
    }

    // Owner cannot be added as collaborator
    if (user._id.toString() === req.userId.toString()) {
      return res.status(400).json({
        message: "You are already the owner of this document"
      });
    }

    // Check if already a collaborator
    const alreadyCollaborator =
      document.collaborators.some(
        (id) => id.toString() === user._id.toString()
      );

    if (alreadyCollaborator) {
      return res.status(400).json({
        message: "User is already a collaborator"
      });
    }

    // Add user
    document.collaborators.push(user._id);

    await document.save();

    res.status(200).json({
      message: "Document shared successfully",
      collaborator: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to share document",
      error: error.message
    });
  }
};