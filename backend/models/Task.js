const db = require('../config/firebase');

class Task {
      constructor({
            title,
            description,
            priority = "Medium",
            status = "Pending",
            dueDate,
            assignedTo = [],
            createdBy,
            attachments = [],
            todoChecklist = [],
            createdAt,
            updatedAt,
            progress = 0,
            isDeleted = false
      }) {
            this.title = title;
            this.description = description;
            this.priority = priority;
            this.status = status;
            this.dueDate = dueDate;
            this.assignedTo = assignedTo;
            this.createdBy = createdBy;
            this.attachments = attachments;
            this.todoChecklist = todoChecklist;
            this.progress = progress;
            this.createdAt = new Date().toISOString();
            this.updatedAt = new Date().toISOString();
            this.isDeleted = isDeleted;
      }

      static async findById(id) {
            const snapshot = await db.ref(`tasks/${id}`).once('value');
            if (!snapshot.exists()) return null;
            const data = snapshot.val();
            return { id, ...data };
      }

      static async findAll() {
            const snapshot = await db.ref('tasks').once('value');
            if (!snapshot.exists()) return [];
            const data = snapshot.val();
            return Object.entries(data).map(([id, task]) => ({ id, ...task }));
      }

      static async create(taskData) {
            const newTaskRef = db.ref('tasks').push();
            await newTaskRef.set(taskData);
            return { id: newTaskRef.key, ...taskData };
      }

      static async update(id, updateData) {
            await db.ref(`tasks/${id}`).update(updateData);
            return this.findById(id);
      }

      static async delete(id) {
            await db.ref(`tasks/${id}`).remove();
            return { message: "Task deleted successfully" };
      }

      static async countByStatus(userId, status) {
            const snapshot = await db.ref('tasks').orderByChild('assignedTo').once('value');
            if (!snapshot.exists()) return 0;

            const tasks = snapshot.val();
            let count = 0;

            for (const key in tasks) {
                  const task = tasks[key];
                  if (task.assignedTo?.includes?.(userId) && task.status === status) {
                        count++;
                  }
            }

            return count;
      }

}

module.exports = Task;
