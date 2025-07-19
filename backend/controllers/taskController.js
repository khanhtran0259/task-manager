const Task = require('../models/Task');
const User = require('../models/User');
const moment = require('moment');

const getTasks = async (req, res) => {
      try {
            const { status } = req.query;
            let filter = {};
            if (status) {
                  filter.status = status;
            }
            let tasks = req.user.role === 'admin'
                  ? await Task.findAll()
                  : (await Task.findAll()).filter(task =>
                        task.assignedTo?.includes?.(req.user.id)
                  );
            const statusSummary = {
                  allTasks: tasks.length,
                  pendingTasks: tasks.filter(task => task.status === "Pending").length,
                  inProgressTasks: tasks.filter(task => task.status === "In Progress").length,
                  completedTasks: tasks.filter(task => task.status === "Completed").length
            };
            if (filter.status) {
                  tasks = tasks.filter(task => task.status === filter.status);
            }
            tasks = await Promise.all(
                  tasks.map(async (task) => {
                        const populatedAssignedTo = await Promise.all(
                              (task.assignedTo || []).map(async userId => {
                                    const user = await User.findById(userId);
                                    return user
                                          ? {
                                                id: user.id,
                                                name: user.name,
                                                email: user.email,
                                                profileImageUrl: user.imageUrl || null
                                          }
                                          : null;
                              })
                        );

                        const completedCount = task.todoChecklist?.filter(item => item.completed)?.length || 0;

                        return {
                              ...task,
                              assignedTo: populatedAssignedTo.filter(Boolean),
                              completedCount
                        };
                  })
            );

            res.status(200).json({
                  tasks,
                  statusSummary
            });

      } catch (error) {
            console.error("Error fetching tasks:", error);
            res.status(500).json({ message: "Error fetching tasks" });
      }
};

const getTaskById = async (req, res) => {
      const { id } = req.params;
      try {
            const task = await Task.findById(id);
            if (!task) {
                  return res.status(404).json({ message: "Task not found" });
            }

            const populatedAssignedTo = await Promise.all(
                  (task.assignedTo || []).map(async userId => {
                        const user = await User.findById(userId);
                        return user ? {
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              profileImageUrl: user.imageUrl || null
                        } : null;
                  })
            );
            const completedCount = task.todoChecklist?.filter(item => item.completed)?.length || 0;
            res.status(200).json({
                  ...task,
                  assignedTo: populatedAssignedTo.filter(Boolean),
                  completedCount
            });
      } catch (error) {
            console.error("Error fetching task:", error);
            res.status(500).json({ message: "Error fetching task" });
      }
}

const createTask = async (req, res) => {

      try {
            const { title, description, priority, dueDate, createdAt, status, assignedTo = [], attachments = [], todoChecklist = [] } = req.body;

            if (!Array.isArray(assignedTo)) {
                  return res.status(400).json({ message: "AssignedTo must be an array of user ids" });
            }
            const newTask = await Task.create({
                  title,
                  description,
                  priority,
                  dueDate,
                  createdAt: new Date().toISOString(),
                  status: status || "Pending",
                  assignedTo,
                  createdBy: req.user.id,
                  attachments: attachments || [],
                  todoChecklist: todoChecklist || []
            });

            res.status(201).json({ message: "Task created successfully", newTask });
      } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ message: "Error creating task", error: error.message });
      }
}

const updateTask = async (req, res) => {
      try {
            const task = await Task.findById(req.params.id);
            if (!task) {
                  return res.status(404).json({ message: "Task not found" });
            }
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.priority = req.body.priority || task.priority;
            task.dueDate = req.body.dueDate || task.dueDate;
            task.attachments = req.body.attachments || task.attachments;
            task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

            if (req.body.assignedTo) {
                  if (!Array.isArray(req.body.assignedTo)) {
                        return res.status(400).json({ message: "AssignedTo must be an array of user ids" });
                  }
                  task.assignedTo = req.body.assignedTo;
            }
            const updatedTask = await Task.update(req.params.id, task);
            res.status(200).json({ message: "Task updated successfully", updatedTask });
      } catch (error) {
            console.error("Error updating task:", error);
            res.status(500).json({ message: "Error updating task" });

      }
}

const deleteTask = async (req, res) => {
      const { id } = req.params;
      try {
            const deletedTask = await Task.delete(id);
            if (!deletedTask) {
                  return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json(deletedTask);
      } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ message: "Error deleting task" });
      }
}

const updateTaskStatus = async (req, res) => {
      try {
            const task = await Task.findById(req.params.id);
            if (!task) {
                  return res.status(404).json({ message: "Task not found" });
            }
            const isAssignedToUser = task.assignedTo?.some(
                  (userId) => userId.toString() === req.user.id.toString()
            );
            const isAdmin = req.user.role === 'admin';

            if (!isAssignedToUser && !isAdmin) {
                  return res.status(403).json({ message: "You are not authorized to update this task" });
            }

            task.status = req.body.status || task.status;

            if (task.status === 'Completed') {
                  task.todoChecklist.forEach(item => {
                        item.completed = true;
                  });
                  task.progress = 100;
            }

            await Task.update(req.params.id, task);
            res.status(200).json({ message: "Task status updated successfully", task });
      } catch (error) {
            console.error("Error updating task status:", error);
            res.status(500).json({ message: "Error updating task status" });
      }
};
const updateTaskTodo = async (req, res) => {
      try {
            const { todoChecklist } = req.body;
            const task = await Task.findById(req.params.id);
            if (!task) {
                  return res.status(404).json({ message: "Task not found" });
            }
            const isAssignedToUser = task.assignedTo?.some(
                  (userId) => userId.toString() === req.user.id.toString()
            );
            const isAdmin = req.user.role === 'admin';

            if (!isAssignedToUser && !isAdmin) {
                  return res.status(403).json({ message: "You are not authorized to update this task" });
            }

            task.todoChecklist = todoChecklist || task.todoChecklist;
            const completedCount = task.todoChecklist.filter(item => item.completed).length;
            const totalItems = task.todoChecklist.length;
            task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

            if (task.progress === 100) {
                  task.status = 'Completed';
            } else if (task.progress > 0) {
                  task.status = 'In Progress';
            } else {
                  task.status = 'Pending';
            }

            await Task.update(req.params.id, task);
            const updatedTask = await Task.findById(req.params.id);
            const assignedUsers = await Promise.all(
                  task.assignedTo.map(userId => User.findById(userId))
            );

            res.status(200).json({ message: "Task todo updated successfully", ...updatedTask, assignedUsers });
      } catch (error) {
            console.error("Error updating task todo:", error);
            res.status(500).json({ message: "Error updating task todo" });
      }
};

const getDashboardData = async (req, res) => {
      try {
            const allTasks = await Task.findAll();

            const now = new Date();

            const userTasks = req.user.role === 'admin'
                  ? allTasks
                  : allTasks.filter(task => task.assignedTo?.includes(req.user.id));

            const totalTasks = userTasks.length;
            const completedTasks = userTasks.filter(task => task.status === 'Completed').length;
            const pendingTasks = userTasks.filter(task => task.status === 'Pending').length;
            const overdueTasks = userTasks.filter(task =>
                  task.status !== 'Completed' &&
                  new Date(task.dueDate) < now
            ).length;


            const taskStatuses = ["Pending", "In Progress", "Completed"];
            const taskDistribution = taskStatuses.reduce((acc, status) => {
                  const key = status.replace(/\s+/g, '');
                  acc[key] = userTasks.filter(task => task.status === status).length;
                  return acc;
            }, {});
            taskDistribution["All"] = totalTasks;

            const taskPriorities = ["Low", "Medium", "High"];
            const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
                  acc[priority] = userTasks.filter(task => task.priority === priority).length;
                  return acc;
            }, {});


            const recentTasks = [...userTasks]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 10)
                  .map(task => ({
                        id: task.id,
                        title: task.title,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate,
                        createdAt: task.createdAt,
                  }));

            res.status(200).json({
                  statistics: {
                        totalTasks,
                        pendingTasks,
                        completedTasks,
                        overdueTasks
                  },
                  charts: {
                        taskDistribution,
                        taskPriorityLevels
                  },
                  recentTasks
            });

      } catch (error) {
            console.error("Error fetching dashboard data:", error);
            res.status(500).json({ message: "Error fetching dashboard data" });
      }
};

const getUserDashboardData = async (req, res) => {
      try {
            const userId = req.user.id;
            const allTasks = await Task.findAll();
            const userTasks = allTasks.filter(task =>
                  task.assignedTo?.includes(userId)
            );

            const now = new Date();

            let pendingTasks = 0;
            let completedTasks = 0;
            let inProgressTasks = 0;
            let overdueTasks = 0;

            const priorityLevels = {
                  Low: 0,
                  Medium: 0,
                  High: 0,
            };

            userTasks.forEach(task => {
                  switch (task.status) {
                        case 'Pending':
                              pendingTasks++;
                              break;
                        case 'Completed':
                              completedTasks++;
                              break;
                        case 'In Progress':
                        case 'InProgress':
                              inProgressTasks++;
                              break;
                  }

                  if (task.priority && priorityLevels.hasOwnProperty(task.priority)) {
                        priorityLevels[task.priority]++;
                  }

                  if (task.dueDate && task.status !== 'Completed') {
                        const dueDate = new Date(task.dueDate);
                        if (dueDate < now) {
                              overdueTasks++;
                        }
                  }
            });

            const recentTasks = [...userTasks]
                  .filter(task => task.createdAt)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  .map(task => ({
                        id: task.id,
                        title: task.title,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate,
                        createdAt: task.createdAt,
                  }));

            const totalTasks = userTasks.length;

            const response = {
                  statistics: {
                        totalTasks,
                        pendingTasks,
                        completedTasks,
                        overdueTasks,
                  },
                  charts: {
                        taskDistribution: {
                              Pending: pendingTasks,
                              InProgress: inProgressTasks,
                              Completed: completedTasks,
                              All: totalTasks,
                        },
                        taskPriorityLevels: priorityLevels,
                  },
                  recentTasks,
            };

            res.status(200).json(response);

      } catch (error) {
            console.error('Error in getUserDashboardData:', error);
            res.status(500).json({ error: 'Failed to fetch dashboard data' });
      }
};


module.exports = {
      getTasks,
      getTaskById,
      createTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      updateTaskTodo,
      getDashboardData,
      getUserDashboardData
};