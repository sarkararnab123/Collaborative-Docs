import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from 'http'

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


const httpServer = http.createServer(app);

const io = new Server(httpServer,{
  cors:{
    origin:"http://localhost:5173"
  }
})

io.on("connection", (socket)=>{
  console.log("User connected", socket.id);

  socket.on("join-document",(documentId)=>{
    socket.join(documentId);

    console.log(`User ${socket.id} joined document ${documentId}`)
  });

  socket.on("document-change",(data)=>{
    const {documentId,title,content} = data;
    socket.to(documentId).emit(
    "document-updated",{
      title,
      content
    }
  );
  })

  socket.on("disconnect",()=>{
    console.log("User disconnected:",socket.id)
  });

})

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();