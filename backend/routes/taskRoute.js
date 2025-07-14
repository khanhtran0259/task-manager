const express = require("express");
const { authMiddleware, adminRoleMiddleware } = require("../middlewares/authMiddleware");
const {
      getTasks,
      getTaskById,
      createTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      updateTaskTodo,
      getDashboardData,
      getUserDashboardData
} = require("../controllers/taskController");
const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardData);
router.get("/my-dashboard", authMiddleware, getUserDashboardData);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.post("/", authMiddleware, adminRoleMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, adminRoleMiddleware, deleteTask);
router.put("/status/:id", authMiddleware, updateTaskStatus);
router.put("/:id/todo", authMiddleware, adminRoleMiddleware, updateTaskTodo);

module.exports = router;