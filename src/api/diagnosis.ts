import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export type SymptomCode =
  | "REDNESS"
  | "HEAT"
  | "STINGING"
  | "DRYNESS"
  | "FLAKING"
  | "OILINESS"
  | "ITCHINESS"
  | "SWELLING"
  | "NONE";

export type Difficulty = "LIGHT" | "BASIC" | "INTENSIVE";

export interface PhotoCheckResponse {
  photoId: string;
}

export interface DiagnosisRequest {
  courseId: number;
  symptoms: SymptomCode[];
  symptomNote?: string;
  photoId?: string;
}

export interface DifficultyOption {
  difficulty: Difficulty;
  title: string;
  subtitle: string;
  stepPreview: string;
  estimatedMinutes: number;
}

export interface DiagnosisResponse {
  diagnosisId: number;
  routineId: number;
  rednessScore: number | null;
  textureScore: number | null;
  blemishScore: number | null;
  summaryText: string;
  difficultyOptions: DifficultyOption[];
}

export const SYMPTOM_CODE_MAP: Record<string, SymptomCode> = {
  붉은기: "REDNESS",
  열감: "HEAT",
  따가움: "STINGING",
  건조함: "DRYNESS",
  각질: "FLAKING",
  번들거림: "OILINESS",
  가려움: "ITCHINESS",
  붓기: "SWELLING",
  해당없음: "NONE",
};

export const diagnosisApi = {
  checkPhoto: async (photo: File) => {
    const formData = new FormData();

    formData.append("photo", photo);

    const response = await api.post<ApiResponse<PhotoCheckResponse>>(
      "/api/diagnoses/photo-check",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    return response.data.data;
  },

  createDiagnosis: async (data: DiagnosisRequest) => {
    const response = await api.post<ApiResponse<DiagnosisResponse>>(
      "/api/diagnoses",
      data,
      {
        timeout: 60000,
      }
    );

    return response.data.data;
  },
};
