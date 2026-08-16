import { api } from "../lib/api";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errorCode?: string;
  message?: string;
}

export interface WeatherFactor {
  value: number;
  level: "양호" | "주의" | "심각" | string;
  cardStatus: string;
}

export interface WeatherBannerData {
  uv: WeatherFactor;
  humidity: WeatherFactor;
  dust: WeatherFactor;
  summaryMessage: string;
  triggerFactor: string;
}

export interface StatMetric {
  current: number;
  delta: number;
}

export interface RecoveryBannerData {
  summaryMessage: string;
  dDay: number;
  redness: StatMetric;
  texture: StatMetric;
  blemish: StatMetric;
}

export interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  checked: boolean;
}
export interface RecoveryBannerDetailMetric {
  current: number;
  previous: number;
  delta: number;
}

export interface RecoveryBannerDetailData {
  redness: RecoveryBannerDetailMetric;
  texture: RecoveryBannerDetailMetric;
  blemish: RecoveryBannerDetailMetric;
  summaryMessage: string;
}
export const dashboardApi = {
  getWeatherBanner: async (coords?: { lat: number; lon: number }) => {
    const response = await api.get<ApiResponse<WeatherBannerData>>(
      "/api/dashboard/weather-banner",
      {
        params: coords ? { lat: coords.lat, lon: coords.lon } : undefined,
      }
    );
    return response.data.data;
  },

  getRecoveryBanner: async () => {
    const response = await api.get<ApiResponse<RecoveryBannerData>>(
      "/api/dashboard/recovery-banner"
    );
    return response.data.data;
  },

  getChecklist: async (coords?: { lat: number; lon: number }) => {
    const response = await api.get<ApiResponse<ChecklistItem[]>>(
      "/api/dashboard/checklist",
      {
        params: coords ? { lat: coords.lat, lon: coords.lon } : undefined,
      }
    );
    return response.data.data;
  },

  toggleChecklistItem: async (checklistItemId: number | string) => {
    const response = await api.patch<ApiResponse<ChecklistItem>>(
      `/api/dashboard/checklist/${checklistItemId}/toggle`
    );
    return response.data.data;
  },

  getRecoveryBannerDetail:
    async (): Promise<RecoveryBannerDetailData | null> => {
      const response = await api.get<{
        success: boolean;
        data?: RecoveryBannerDetailData;
        errorCode?: string;
        message?: string;
      }>("/api/dashboard/recovery-banner");

      return response.data.data ?? null;
    },
};
