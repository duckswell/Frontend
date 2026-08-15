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

// src/api/course.ts

export interface StartCourseRequest {
  courseType: "FOCUS" | "DAILY";
  routineTypeCode?:
    | "COOLDOWN"
    | "CLEAR_UP"
    | "SEBUM_CONTROL"
    | "HYDRATION"
    | null;
}

export const courseApi = {
  getCurrentCourse: async () => {
    const response = await api.get<ApiResponse<CurrentCourseResponse>>(
      "/api/courses/current",
    );
    return response.data.data;
  },

  getCourseHistory: async () => {
    const response = await api.get<ApiResponse<PastCourseHistoryItem[]>>(
      "/api/courses/history",
    );
    return response.data.data;
  },

  startCourse: async (data: StartCourseRequest) => {
    const response = await api.post<ApiResponse<CurrentCourseResponse>>(
      "/api/courses/start",
      data,
    );
    return response.data.data;
  },

  endCourse: async (courseId: number | string) => {
    const response = await api.post<ApiResponse<string>>(
      `/api/courses/${courseId}/end`,
    );
    return response.data.data;
  },

  restartFocusCourse: async () => {
    const response = await api.post<ApiResponse<CurrentCourseResponse>>(
      "/api/courses/restart-focus",
    );
    return response.data.data;
  },
};
