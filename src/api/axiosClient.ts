import axios from "axios";
const token = localStorage.getItem("accessToken");
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && token.includes(".")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default axiosClient;
