import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";
const REFRESH_URL = `${BASE_URL}token/refresh/`;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await api.post("token/", { username, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("logout/", {}, { withCredentials: true });
  return response.data;
};

export const authenticated_user = async () => {
  const response = await api.get("authenticated/");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("users/");
  return response.data;
};

export const createUser = async (username, email) => {
  const response = await api.post("users/", { username, email });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`users/${id}`);
  return response.data;
};

export const updateUser = async (id, username, email) => {
  const response = await api.put(`users/${id}/update/`, { username, email });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`users/${id}/delete/`);
  return response.data;
};

export const getPages = async () => {
  const response = await api.get("pages/");
  return response.data;
};

export const getUserAccess = async (userId, pageId) => {
  const response = await api.post("user-page-permission/", {
    user: userId,
    page: pageId,
  });
  return response.data;
};

export const assignUserAccess = async (userId, pageId, permissions) => {
  const response = await api.post("access/", {
    user: userId,
    page: pageId,
    can_create: permissions.can_create,
    can_edit: permissions.can_edit,
    can_delete: permissions.can_delete,
    can_comment: permissions.can_comment,
  });
  return response.data;
};

export const getPermissionById = async () => {
  const response = await api.get("access/list/");
  return response.data;
};

export const sendOTP = async (email) => {
  const response = await api.post("verify/send-otp/", { email });
  return response.data;
};

export const verifyOTP = async (email, input_otp) => {
  const response = await api.post("verify/confirm-otp/", { email, input_otp });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post("verify/reset-password/", {
    token,
    password,
  });
  return response.data;
};

export const createComment = async (page, content) => {
  const response = await api.post("comments/create/", { page, content });
  return response.data;
};

export const updateComment = async (id, content) => {
  const response = await api.put(`comments/${id}/edit/`, { content });
  return response.data;
};

export const getCommentByPage = async (pageId) => {
  const response = await api.get(`comments/?page_id=${pageId}`);
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await api.delete(`comments/${id}/delete/`);
  return response.data;
};
