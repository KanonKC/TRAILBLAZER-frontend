import axios from "axios";

// Now we use relative URLs because we have Next.js rewrites in next.config.ts
// This makes our app "Same-Origin" even if the backend is on a different port.
export const apiClient = axios.create({
    baseURL: "", // Use empty so we can provide full relative paths (/api/v1/...) 
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Now we call our own proxy route for refresh
                await axios.post(
                    "/api/v1/refresh-token",
                    {},
                    { withCredentials: true }
                );
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
