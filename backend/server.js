require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoute");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware to handle CORS
app.use(
      cors({
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
      })
);

// Database connection



// Middleware
app.use(express.json());

//Routes

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
});   