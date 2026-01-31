import axios from "axios";

const API = axios.create({
  baseURL:"http://localhost:8000/api/"
,
  });

// Add JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (
    token &&
    !req.url.includes("users/login") &&
    !req.url.includes("users/register")
  ) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
