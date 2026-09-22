import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import documentRoutes from "./src/routes/doucment.routes.js";

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Collaborative Docs API is running"
  });
});


// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();