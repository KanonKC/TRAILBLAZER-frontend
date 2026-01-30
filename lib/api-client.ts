
interface ApiClientConfig extends RequestInit {
    headers?: HeadersInit;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async request<T>(endpoint: string, config: ApiClientConfig = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            ...config.headers,
        };

        const response = await fetch(url, {
            ...config,
            headers,
            credentials: "include", // Always send cookies
        });

        if (response.status === 401) {
            // Attempt Silent Refresh
            const refreshSuccessful = await this.refreshToken();
            if (refreshSuccessful) {
                // Retry original request
                return this.request<T>(endpoint, config);
            } else {
                // Refresh failed, throw error (or optionally handle logout here)
                throw new Error("Unauthorized");
            }
        }

        if (!response.ok) {
            // Handle other errors
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        // Attempt to parse JSON
        try {
            return await response.json();
        } catch (e) {
            // Fallback for non-JSON responses if needed, or just return null/empty
            return {} as T;
        }
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const res = await fetch(`${this.baseUrl}/api/v1/refresh-token`, {
                method: "POST",
                credentials: "include",
            });
            return res.ok;
        } catch (error) {
            console.error("Failed to refresh token", error);
            return false;
        }
    }

    // Helper methods for common HTTP verbs
    get<T>(endpoint: string, config?: ApiClientConfig) {
        return this.request<T>(endpoint, { ...config, method: "GET" });
    }

    post<T>(endpoint: string, body: any, config?: ApiClientConfig) {
        return this.request<T>(endpoint, {
            ...config,
            method: "POST",
            body: JSON.stringify(body)
        });
    }

    put<T>(endpoint: string, body: any, config?: ApiClientConfig) {
        return this.request<T>(endpoint, {
            ...config,
            method: "PUT",
            body: JSON.stringify(body)
        });
    }

    delete<T>(endpoint: string, config?: ApiClientConfig) {
        return this.request<T>(endpoint, { ...config, method: "DELETE" });
    }

    // Special case for file uploads which shouldn't have Content-Type: application/json
    upload<T>(endpoint: string, formData: FormData, config: ApiClientConfig = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        // Let browser set Content-Type for FormData (multipart/form-data with boundary)
        const { "Content-Type": _, ...restHeaders } = (config.headers as any) || {};

        return fetch(url, {
            ...config,
            method: "POST", // Usually POST for uploads
            body: formData,
            headers: {
                ...restHeaders
            },
            credentials: "include"
        }).then(async (res) => {
            if (res.status === 401) {
                const refreshSuccessful = await this.refreshToken();
                if (refreshSuccessful) {
                    return this.upload<T>(endpoint, formData, config);
                }
                throw new Error("Unauthorized");
            }
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.message || `Upload failed with status ${res.status}`);
            }
            try { return await res.json() } catch { return {} as T }
        });
    }
}

export const apiClient = new ApiClient(BASE_URL);
