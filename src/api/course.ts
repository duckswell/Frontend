import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export interface CourseDetail {
  id: number;
  courseType: "FOCUS" | "DAILY" | string;
  title: string;
  startDate: string;
  endDate?: string;
  dayCount: number;
}

export interface CourseHistoryResponse {
  currentCourse: CourseDetail | null;
  pastCourses: CourseDetail[];
}

export const courseApi = {
  getCurrentCourse: async () => {
    const response = await api.get<ApiResponse<CourseDetail>>(
      "/api/courses/current",
    );
    return response.data.data;
  },

  getCourseHistory: async () => {
    const response = await api.get<ApiResponse<CourseHistoryResponse>>(
      "/api/courses/history",
    );
    return response.data.data;
  },
};
