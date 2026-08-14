import { api } from "../lib/api";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface WeatherItem {
  value: number;
  level: string;
  cardStatus: string;
}

export interface WeatherBannerData {
  uv: WeatherItem;
  humidity: WeatherItem;
  dust: WeatherItem;
  summaryMessage: string;
  triggerFactor?: string;
}

export interface RecoveryScoreItem {
  current: number;
  previous: number;
  delta: number;
}

export interface RecoveryBannerData {
  redness: RecoveryScoreItem;
  texture: RecoveryScoreItem;
  blemish: RecoveryScoreItem;
  summaryMessage: string;
}

export interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  checked: boolean;
}

export const dashboardApi = {
  getWeatherBanner: async (params?: { lat?: number; lon?: number }) => {
    const response = await api.get<ApiResponse<WeatherBannerData>>(
      "/api/dashboard/weather-banner",
      { params },
    );
    return response.data.data;
  },

  getRecoveryBanner: async () => {
    const response = await api.get<ApiResponse<RecoveryBannerData>>(
      "/api/dashboard/recovery-banner",
    );
    return response.data.data;
  },

  getChecklist: async (params?: { lat?: number; lon?: number }) => {
    const response = await api.get<ApiResponse<ChecklistItem[]>>(
      "/api/dashboard/checklist",
      { params },
    );
    return response.data.data;
  },

  toggleChecklistItem: async (checklistItemId: number) => {
    const response = await api.patch<ApiResponse<ChecklistItem>>(
      `/api/dashboard/checklist/${checklistItemId}/toggle`,
    );
    return response.data.data;
  },
};
