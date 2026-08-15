import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export interface CurrentCourseResponse {
  courseId: number;
  courseType: "FOCUS" | "DAILY" | string;
  label: string;
  startedAt: string;
  streakDays: number;
}

export interface PastCourseHistoryItem {
  id: number;
  courseType: "FOCUS" | "DAILY" | string;
  routineTypeCode: string;
  routineTypeName: string;
  startedAt: string;
  endedAt: string;
  status: string;
}

export interface StartCourseRequest {
  courseType: "FOCUS" | "DAILY";
  routineTypeCode?:
    | "COOLDOWN"
    | "CLEAR_UP"
    | "SEBUM_CONTROL"
    | "HYDRATION"
    | null;
}

export interface StartCourseResponse {
  id: number;
  courseType: "FOCUS" | "DAILY";
  routineTypeCode:
    | "COOLDOWN"
    | "CLEAR_UP"
    | "SEBUM_CONTROL"
    | "HYDRATION"
    | null;
  routineTypeName: string | null;
  startedAt: string;
  endedAt: string | null;
  status: "IN_PROGRESS" | "COMPLETED";
}

export interface RecoverySummaryResponse {
  recoveryStageSummaryText: string;
}
export interface EndCourseResponse {
  id: number;
  courseType: "FOCUS" | "DAILY";
  routineTypeCode:
    | "COOLDOWN"
    | "CLEAR_UP"
    | "SEBUM_CONTROL"
    | "HYDRATION"
    | null;
  routineTypeName: string | null;
  startedAt: string;
  endedAt: string;
  status: "COMPLETED";
}
export const courseApi = {
  getCurrentCourse: async () => {
    const response = await api.get<ApiResponse<CurrentCourseResponse>>(
      "/api/courses/current"
    );
    return response.data.data;
  },

  getCourseHistory: async () => {
    const response = await api.get<ApiResponse<PastCourseHistoryItem[]>>(
      "/api/courses/history"
    );
    return response.data.data;
  },

  startCourse: async (data: StartCourseRequest) => {
    const response = await api.post<ApiResponse<StartCourseResponse>>(
      "/api/courses/start",
      data
    );

    return response.data.data;
  },

  endCourse: async (courseId: number | string) => {
    const response = await api.post<ApiResponse<EndCourseResponse>>(
      `/api/courses/${courseId}/end`
    );

    return response.data.data;
  },

  restartFocusCourse: async () => {
    const response = await api.post<ApiResponse<CurrentCourseResponse>>(
      "/api/courses/restart-focus"
    );
    return response.data.data;
  },

  getRecoverySummary: async (courseId: number | string) => {
    const response = await api.get<ApiResponse<RecoverySummaryResponse>>(
      `/api/courses/${courseId}/recovery-summary`
    );

    return response.data.data;
  },
};
