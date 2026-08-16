import { api } from "../lib/api";
import type { ApiResponse } from "./dashboard";

export type IngredientCategory = "VITAMIN" | "MOISTURE" | "PLANT_EXTRACT";

export type ProductCategory =
  | "CLEANSER"
  | "SKIN_TONER"
  | "AMPOULE_SERUM"
  | "CREAM"
  | "MIST_OIL";

export interface RecommendedIngredient {
  id: number;
  name: string;
  category: IngredientCategory;
}

export interface RecommendedProduct {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  imageUrl: string | null;
  linkUrl: string;
}

export const productApi = {
  getRecommendedIngredients: async (): Promise<RecommendedIngredient[]> => {
    const response = await api.get<ApiResponse<RecommendedIngredient[]>>(
      "/api/products/recommendations/ingredients"
    );

    return response.data.data;
  },

  getRecommendedProducts: async (
    ingredientId: number,
    productCategory?: ProductCategory
  ): Promise<RecommendedProduct[]> => {
    const response = await api.get<ApiResponse<RecommendedProduct[]>>(
      "/api/products/recommendations",
      {
        params: {
          ingredientId,
          ...(productCategory ? { productCategory } : {}),
        },
      }
    );

    return response.data.data;
  },
};
