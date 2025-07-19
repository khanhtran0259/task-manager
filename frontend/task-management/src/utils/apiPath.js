export const BASE_URL = "http://localhost:8080";

export const API_PATHS = {
      AUTH: {
            LOGIN: "/api/auth/login",
            REGISTER: "/api/auth/register",
            GET_PROFILE: "/api/auth/profile",
            UPDATE_PROFILE: "/api/auth/profile", // PUT method
      },

      USERS: {
            GET_ALL_USERS: "/api/users",
            GET_ALL_USERS_INCLUDE_ADMIN: "/api/users/all",
            GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
            DELETE_USER: "/api/users",
            CREATE_LOGIN_CODE: "/api/users/create-login-code",
            VALIDATE_LOGIN_CODE: "/api/users/validate-login-code",
      },

      TASKS: {
            GET_DASHBOARD: "/api/tasks/dashboard",
            GET_USER_DASHBOARD: "/api/tasks/my-dashboard",
            GET_ALL_TASKS: "/api/tasks",
            GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
            CREATE_TASK: "/api/tasks",
            UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
            DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,
            UPDATE_TASK_STATUS: (taskId) => `/api/tasks/status/${taskId}`,
            UPDATE_TASK_TODO: (taskId) => `/api/tasks/${taskId}/todo`,
      },

      IMAGE: {
            UPLOAD_IMAGE: "/api/auth/upload-image",
      },

      ADMIN: {
            CREATE_NEW_ACCESS_CODE: "/api/admin/create-access-code",
            VALIDATE_ACCESS_CODE: "/api/admin/validate-access-code",
            CREATE_INVITE_BY_ADMIN_CODE: "/api/admin/invite-user-by-admin",
      },

      MESSAGES: {
            GET_MESSAGES: (userId) => `/api/messages?userId=${userId}`, // GET messages with a specific user
            SEND_MESSAGE: "/api/messages", // POST a new message
      },
};
