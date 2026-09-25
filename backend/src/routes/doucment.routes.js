import express from "express";

import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  shareDocument
} from "../controllers/document.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createDocument);

router.get("/", getDocuments);

router.get("/:id", getDocument);

router.put("/:id", updateDocument);

router.delete("/:id", deleteDocument);

router.post("/:id/share", shareDocument);

export default router;