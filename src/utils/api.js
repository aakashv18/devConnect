import axios from "axios";

const api = axios.create({ baseURL: "/api", withCredentials: true });

// the backend sends errors as plain text, e.g. "Invalid credentials"
export const errorMessage = (error) =>
  typeof error.response?.data === "string" && error.response.data
    ? error.response.data
    : error.message;

export default api;
