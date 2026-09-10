import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export interface GuestLoginData {
  memberId: number;
  guestToken: string;
  nickname: string;
}

export const authApi = {
  loginGuest: async (): Promise<GuestLoginData> => {
    const savedToken = localStorage.getItem("guestToken");

    const response = await api.post<ApiResponse<GuestLoginData>>(
      "/api/auth/guest",
      {},
      {
        headers: savedToken
          ? { Authorization: `Bearer ${savedToken}` }
          : undefined,
      },
    );

    return response.data.data;
  },
};
