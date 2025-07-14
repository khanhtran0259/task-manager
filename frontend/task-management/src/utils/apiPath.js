export const BASE_URL = "http://localhost:8080";

export const API_PATHS = {
      AUTH: {
            LOGIN: "/api/auth/login",
            REGISTER: "/api/auth/register",
            GET_PROFILE: "/api/auth/profile",
            UPDATE_PROFILE: "/api/auth/profile", // PUT method
      },

      USERS: {
            GET_ALL_USERS: "/api/users", // GET all users (auth required)
            GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // GET single user
            DELETE_USER: "/api/users", // POST with admin middleware
            CREATE_LOGIN_CODE: "/api/users/create-login-code",          
            VALIDATE_LOGIN_CODE: "/api/users/validate-login-code",
      },

      TASKS: {
            GET_DASHBOARD: "/api/tasks/dashboard", // GET admin dashboard data
            GET_USER_DASHBOARD: "/api/tasks/my-dashboard", // GET user's dashboard data
            GET_ALL_TASKS: "/api/tasks", // GET all tasks
            GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // GET task by ID
            CREATE_TASK: "/api/tasks", // POST (admin only)
            UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // PUT
            DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // DELETE (admin only)
            UPDATE_TASK_STATUS: (taskId) => `/api/tasks/status/${taskId}`, // PUT
            UPDATE_TASK_TODO: (taskId) => `/api/tasks/${taskId}/todo`, // PUT (admin only)
      },

      IMAGE: {
            UPLOAD_IMAGE: "/api/auth/upload-image",
      },

      ADMIN: {
            CREATE_NEW_ACCESS_CODE: "/api/admin/create-access-code", // POST get admin access code
            VALIDATE_ACCESS_CODE: "/api/admin/validate-access-code", // POST validate admin access code
            CREATE_INVITE_BY_ADMIN_CODE: "/api/admin/invite-user-by-admin",
      },
};
