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

// The backend rotates the refresh token on every use (old one is invalidated
// as soon as a new one is issued). If several requests 401 at the same time
// (e.g. multiple widgets fetching on page load right as the access token
// expires), each one calling /refresh-token independently means only the
// first succeeds and the rest fail on the now-stale token - which can
// spuriously log a genuinely-authenticated user out. Sharing one in-flight
// refresh promise across all concurrent 401s avoids that dogpile.
let refreshPromise: Promise<unknown> | null = null;

function refreshTokens() {
    if (!refreshPromise) {
        refreshPromise = axios
            .post("/api/v1/refresh-token", {}, { withCredentials: true })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Now we call our own proxy route for refresh
                await refreshTokens();
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
