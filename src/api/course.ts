import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export type CourseType = "FOCUS" | "DAILY";

export type RoutineTypeCode =
  | "COOLDOWN"
  | "CLEAR_UP"
  | "SEBUM_CONTROL"
  | "HYDRATION";

export interface CurrentCourseResponse {
  courseId: number;
  courseType: CourseType | string;
  label: string;
  startedAt: string;
  streakDays: number;
}

export interface PastCourseHistoryItem {
  id: number;
  courseType: CourseType | string;
  routineTypeCode: RoutineTypeCode | null;
  routineTypeName: string | null;
  startedAt: string;
  endedAt: string;
  status: string;
}

export interface StartCourseRequest {
  courseType: CourseType;
  routineTypeCode?: RoutineTypeCode | null;
}

export interface StartCourseResponse {
  id: number;
  courseType: CourseType;
  routineTypeCode: RoutineTypeCode | null;
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
  courseType: CourseType;
  routineTypeCode: RoutineTypeCode | null;
  routineTypeName: string | null;
  startedAt: string;
  endedAt: string;
  status: "COMPLETED";
}

export type SymptomCode =
  | "REDNESS"
  | "HEAT"
  | "STINGING"
  | "DRYNESS"
  | "FLAKING"
  | "OILINESS"
  | "ITCHINESS"
  | "SWELLING";

export interface SymptomSummaryItem {
  symptom: SymptomCode;
  count: number;
}

export interface SymptomSummaryResponse {
  topSymptoms: SymptomSummaryItem[];
  recommendedRoutineTypeCode: RoutineTypeCode | null;
  recommendedRoutineTypeName: string | null;
}

export const courseApi = {
  getCurrentCourse: async (): Promise<CurrentCourseResponse | null> => {
    const response = await api.get<{
      success: boolean;
      data?: CurrentCourseResponse;
      errorCode?: string;
      message?: string;
    }>("/api/courses/current");

    return response.data.data ?? null;
  },

  getCourseHistory: async (): Promise<PastCourseHistoryItem[]> => {
    const response = await api.get<ApiResponse<PastCourseHistoryItem[]>>(
      "/api/courses/history"
    );

    return response.data.data;
  },

  startCourse: async (
    data: StartCourseRequest
  ): Promise<StartCourseResponse> => {
    const response = await api.post<ApiResponse<StartCourseResponse>>(
      "/api/courses/start",
      data
    );

    return response.data.data;
  },

  endCourse: async (courseId: number | string): Promise<EndCourseResponse> => {
    const response = await api.post<ApiResponse<EndCourseResponse>>(
      `/api/courses/${courseId}/end`
    );

    return response.data.data;
  },

  restartFocusCourse: async (): Promise<CurrentCourseResponse> => {
    const response = await api.post<ApiResponse<CurrentCourseResponse>>(
      "/api/courses/restart-focus"
    );

    return response.data.data;
  },

  getRecoverySummary: async (
    courseId: number | string
  ): Promise<RecoverySummaryResponse> => {
    const response = await api.get<ApiResponse<RecoverySummaryResponse>>(
      `/api/courses/${courseId}/recovery-summary`
    );

    return response.data.data;
  },

  getSymptomSummary: async (
    courseId: number | string,
  ): Promise<SymptomSummaryResponse> => {
    const response = await api.get<ApiResponse<SymptomSummaryResponse>>(
      `/api/courses/${courseId}/symptom-summary`,
    );

    return response.data.data;
  },
};
