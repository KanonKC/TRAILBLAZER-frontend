import { apiClient } from "@/lib/api-client";
import { LinkedAccount } from "../types";

export const getLinkedAccounts = async (): Promise<LinkedAccount[]> => {
    const response = await apiClient.get<LinkedAccount[]>("/api/v1/linked-accounts");
    return response.data;
};

export const bindAccount = async (platform: string, code: string, codeVerifier?: string): Promise<LinkedAccount> => {
    const response = await apiClient.post<LinkedAccount>(`/api/v1/linked-accounts/${platform}/bind`, {
        code,
        code_verifier: codeVerifier,
    });
    return response.data;
};

export const unbindAccount = async (platform: string): Promise<void> => {
    await apiClient.delete(`/api/v1/linked-accounts/${platform}`);
};
