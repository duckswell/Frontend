import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export const demoApi = {
  resetDemoData: async (): Promise<string> => {
    const response = await api.post<ApiResponse<string>>("/api/demo/reset");
    return response.data.data;
  },
};
