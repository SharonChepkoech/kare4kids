import axios from "axios";

const api = axios.create({
  baseURL: "https://yourbackend.com/auth",
  withCredentials: true, // ✅ Allows cookies to be sent with requests
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh Token on Expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post("/token/refresh/", {}, { withCredentials: true });

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("access_token", newAccessToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(error.config); // ✅ Retry the failed request
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        window.location.href = "/login"; // ✅ Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
