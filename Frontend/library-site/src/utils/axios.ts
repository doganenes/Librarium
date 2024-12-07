import axios from 'axios';

const refreshTokenApiUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api/refresh-token`;

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api`,
});

// Request Interceptor: Add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and refresh token exists, attempt to refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          refreshTokenApiUrl,
          { refreshToken }
        );

        const { accessToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('token', accessToken);

        // Update Axios default Authorization header
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Logout and redirect to login on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
