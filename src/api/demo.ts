import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export interface DemoResetResponse {
  message?: string;
}

export const demoApi = {
  resetDemoData: async (): Promise<DemoResetResponse> => {
    const response =
      await api.post<ApiResponse<DemoResetResponse>>("/api/demo/reset");

    return response.data.data;
  },
};
