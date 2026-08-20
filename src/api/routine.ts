import { api } from "../lib/api";

import type { ApiResponse } from "./dashboard";
import type { RoutineTypeCode } from "./course";
import type { Difficulty } from "./diagnosis";

export type ProductCategory =
  | "CLEANSER"
  | "SKIN_TONER"
  | "AMPOULE_SERUM"
  | "CREAM"
  | "MIST_OIL";

export interface RoutineIngredient {
  ingredientId: number;
  role: "PRIMARY" | "ALTERNATE";
}

export interface RoutineStep {
  stepId: number;
  order: number;
  stepName: string;
  category: ProductCategory;
  productText: string;
  methodText: string;
  alternateText: string | null;
  ingredients: RoutineIngredient[];
}

export interface RoutineDifficultyResponse {
  routineId: number;
  difficulty: Difficulty;
  title: string;
  estimatedMinutes: number;
  reasonText: string;
  steps: RoutineStep[];
}

export interface RoutineStepSummary {
  stepId: number;
  stepName: string;
  category: ProductCategory;
  ingredientId: number | null;
  ingredientName: string | null;
}

export interface RoutineCompletionData {
  completionSummaryText: string;
  recommendedIngredients: string[];
  completedAt: string;
}

export interface RecommendedRoutineProduct {
  ingredientName: string;

  product: {
    id: number;
    name: string;
    brand: string;
    category: ProductCategory;
    imageUrl: string;
    linkUrl: string;
  };
}

export interface TodayRoutineResponse {
  routineId: number;
}

export const routineApi = {
  selectDifficulty: async (
    routineId: number,
    difficulty: Difficulty
  ): Promise<RoutineDifficultyResponse> => {
    const response = await api.post<ApiResponse<RoutineDifficultyResponse>>(
      `/api/routines/${routineId}/difficulty`,
      {
        difficulty,
      },
      {
        timeout: 60000,
      }
    );

    return response.data.data;
  },

  getRoutineSteps: async (routineId: number): Promise<RoutineStepSummary[]> => {
    const response = await api.get<ApiResponse<RoutineStepSummary[]>>(
      `/api/routines/${routineId}/steps`
    );

    return response.data.data;
  },

  completeRoutine: async (
    routineId: number
  ): Promise<RoutineCompletionData> => {
    const response = await api.post<ApiResponse<RoutineCompletionData>>(
      `/api/routines/${routineId}/complete`,
      undefined,
      {
        timeout: 60000,
      }
    );

    return response.data.data;
  },

  getTodayRoutine: async (): Promise<number | null> => {
    const response = await api.get<ApiResponse<TodayRoutineResponse>>(
      "/api/routines/today"
    );

    return response.data.data?.routineId ?? null;
  },


  getRecommendedProducts: async (
    routineId: number
  ): Promise<RecommendedRoutineProduct[]> => {
    const response = await api.get<ApiResponse<RecommendedRoutineProduct[]>>(
      `/api/routines/${routineId}/recommended-products`
    );

    return response.data.data;
  },

  getRecommendedProductsByRoutineType: async (
    routineTypeCode: RoutineTypeCode
  ): Promise<RecommendedRoutineProduct[]> => {
    const response = await api.get<ApiResponse<RecommendedRoutineProduct[]>>(
      `/api/courses/routine-types/${routineTypeCode}/recommended-products`
    );

    return response.data.data;
  },
};
