require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http"); // ✅ Thêm dòng này
const { Server } = require("socket.io"); // ✅ Socket.IO v4

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoute");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app); // ✅ Tạo server từ app

// Middleware
app.use(
      cors({
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
      })
);
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Setup Socket.IO
const io = new Server(server, {
      cors: {
            origin: "*",
            methods: ["GET", "POST"]
      }
});

io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("sendMessage", (message) => {
            io.emit("newMessage", message); 
      });

      socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
      });
});

// ✅ Khởi động server qua http.createServer
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
});
