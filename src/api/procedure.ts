import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export interface ProcedureItem {
  id: number;
  procedureType: string;
  procedureTypeName: string;
  procedureDate: string;
  currentCount: number;
  totalCount: number;
  areas: string[];
}

export interface ProcedurePayload {
  procedureType: string;
  procedureDate: string;
  currentCount: number;
  totalCount: number;
  areas: string[];
}

export interface CreateProceduresRequest {
  procedures: ProcedurePayload[];
}

export const procedureApi = {
  getCurrentProcedures: async () => {
    const response = await api.get<ApiResponse<ProcedureItem[]>>(
      "/api/procedures/current",
    );
    return response.data.data;
  },

  getAllProcedures: async () => {
    const response =
      await api.get<ApiResponse<ProcedureItem[]>>("/api/procedures");
    return response.data.data;
  },

  createProcedures: async (data: CreateProceduresRequest) => {
    const response = await api.post<ApiResponse<ProcedureItem[]>>(
      "/api/procedures",
      data,
    );
    return response.data.data;
  },

  updateProcedure: async (
    procedureId: number | string,
    data: ProcedurePayload,
  ) => {
    const response = await api.put<ApiResponse<ProcedureItem>>(
      `/api/procedures/${procedureId}`,
      data,
    );
    return response.data.data;
  },

  deleteProcedure: async (procedureId: number | string) => {
    const response = await api.delete<ApiResponse<string>>(
      `/api/procedures/${procedureId}`,
    );
    return response.data.data;
  },
};
