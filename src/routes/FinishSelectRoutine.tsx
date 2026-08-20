import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { courseApi, type RoutineTypeCode } from "../api/course";
import { routineApi } from "../api/routine";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection, {
  type CareIngredient,
  type Product,
} from "../components/FocusCare/RecommendedProductSection";

import * as S from "../styles/FocusCare/FinishSelectRoutine.styles";

interface FinishSelectRoutineLocationState {
  courseId: number;
  routineTypeCode: RoutineTypeCode;
  routineTypeName: string | null;
  routineTitle: string;
  routineImage: string;
  routineCategories: string[];

  isRecommended?: boolean;
  recommendedBadgeText?: string;
}

export default function FinishSelectRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishSelectRoutineLocationState | null;

  const courseId = state?.courseId;
  const routineTypeCode = state?.routineTypeCode;

  const routineTitle =
    state?.routineTitle ?? state?.routineTypeName ?? "데일리 루틴";

  const routineImage = state?.routineImage ?? "/assets/Daily_cooldown.png";

  const routineCategories = state?.routineCategories ?? [];

  const routineDisplayName = routineTitle.replace(" 루틴", "");

  const productStorageKey =
    courseId !== undefined && routineTypeCode !== undefined
      ? `finish-select-routine-products-${courseId}-${routineTypeCode}`
      : null;

  const ingredientStorageKey =
    courseId !== undefined && routineTypeCode !== undefined
      ? `finish-select-routine-ingredients-${courseId}-${routineTypeCode}`
      : null;

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(
    () => {
      if (!productStorageKey) {
        return [];
      }

      const storedProducts = sessionStorage.getItem(productStorageKey);

      if (!storedProducts) {
        return [];
      }

      try {
        return JSON.parse(storedProducts) as Product[];
      } catch (error) {
        console.error("저장된 데일리 추천 제품 파싱 실패:", error);

        sessionStorage.removeItem(productStorageKey);

        return [];
      }
    }
  );

  const [routineIngredients, setRoutineIngredients] = useState<
    CareIngredient[]
  >(() => {
    if (!ingredientStorageKey) {
      return [];
    }

    const storedIngredients = sessionStorage.getItem(ingredientStorageKey);

    if (!storedIngredients) {
      return [];
    }

    try {
      return JSON.parse(storedIngredients) as CareIngredient[];
    } catch (error) {
      console.error("저장된 데일리 루틴 성분 파싱 실패:", error);

      sessionStorage.removeItem(ingredientStorageKey);

      return [];
    }
  });

  useEffect(() => {
    if (routineTypeCode === undefined || ingredientStorageKey === null) {
      console.error("루틴 성분 조회에 필요한 routineTypeCode가 없습니다.");

      return;
    }

    const storedIngredients = sessionStorage.getItem(ingredientStorageKey);

    if (storedIngredients) {
      return;
    }

    const currentRoutineTypeCode: RoutineTypeCode = routineTypeCode;

    const currentStorageKey = ingredientStorageKey;

    let isCancelled = false;

    async function fetchRoutineIngredients() {
      try {
        console.log("🔥 데일리 루틴 전체 성분 요청:", currentRoutineTypeCode);

        const response = await courseApi.getRoutineTypeIngredients(
          currentRoutineTypeCode
        );

        if (isCancelled) {
          return;
        }

        console.log("🔥 데일리 루틴 전체 성분 API 응답:", response);

        const mappedIngredients: CareIngredient[] = response.map(
          (ingredient) => ({
            id: ingredient.ingredientId,
            name: ingredient.ingredientName,
          })
        );

        console.log("🔥 더보기로 전달할 전체 성분:", mappedIngredients);

        sessionStorage.setItem(
          currentStorageKey,
          JSON.stringify(mappedIngredients)
        );

        setRoutineIngredients(mappedIngredients);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("데일리 루틴 전체 성분 조회 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);

          console.error("API Error Response:", error.response?.data);

          console.error("요청 URL:", error.config?.url);
        }
      }
    }

    void fetchRoutineIngredients();

    return () => {
      isCancelled = true;
    };
  }, [routineTypeCode, ingredientStorageKey]);

  useEffect(() => {
    if (routineTypeCode === undefined || productStorageKey === null) {
      console.error("추천 제품 조회에 필요한 routineTypeCode가 없습니다.");

      return;
    }

    const storedProducts = sessionStorage.getItem(productStorageKey);

    if (storedProducts) {
      return;
    }

    const currentRoutineTypeCode: RoutineTypeCode = routineTypeCode;

    const currentStorageKey = productStorageKey;

    let isCancelled = false;

    async function fetchRecommendedProducts() {
      try {
        console.log(
          "🔥 데일리 루틴 타입 추천 제품 요청:",
          currentRoutineTypeCode
        );

        const response = await routineApi.getRecommendedProductsByRoutineType(
          currentRoutineTypeCode
        );

        if (isCancelled) {
          return;
        }

        console.log("🔥 데일리 루틴 타입 추천 제품 API 응답:", response);

        const mappedProducts: Product[] = response.map((item) => ({
          id: item.product.id,
          brand: item.product.brand,
          name: item.product.name,

          ingredientName: item.ingredientName,
          categories: [item.ingredientName],

          category: item.product.category,

          imageUrl: item.product.imageUrl,
          linkUrl: item.product.linkUrl,
        }));

        console.log("🔥 FinishSelectRoutine 표시 제품:", mappedProducts);

        sessionStorage.setItem(
          currentStorageKey,
          JSON.stringify(mappedProducts)
        );

        setRecommendedProducts(mappedProducts);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("데일리 루틴 타입 추천 제품 조회 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);

          console.error("API Error Response:", error.response?.data);

          console.error("요청 URL:", error.config?.url);
        }
      }
    }

    void fetchRecommendedProducts();

    return () => {
      isCancelled = true;
    };
  }, [routineTypeCode, productStorageKey]);

  function handleSaveRecommendedProducts() {
    if (!productStorageKey) {
      return;
    }

    sessionStorage.setItem(
      productStorageKey,
      JSON.stringify(recommendedProducts)
    );

    console.log("🔥 더보기 이동 전 추천 제품 저장:", recommendedProducts);
  }

  function handleMoveToHome() {
    navigate("/");
  }

  return (
    <S.Page>
      <S.Content>
        <S.CompletionSection>
          <FocusConfetti />

          <S.IntroTextArea>
            <S.Title>
              내일부터 {routineDisplayName} 루틴으로
              <br />
              매일 함께해요!
            </S.Title>

            <S.Description>데일리 코스 루틴 선택을 완료했어요</S.Description>
          </S.IntroTextArea>
        </S.CompletionSection>

        <S.IntroSection>
          <S.RoutineCard>
            {state?.isRecommended && (
              <S.RecommendedBadge>
                {state.recommendedBadgeText ?? "맞춤 추천"}
              </S.RecommendedBadge>
            )}

            <S.RoutineImage src={routineImage} alt={routineDisplayName} />

            <S.RoutineName>{routineDisplayName}</S.RoutineName>

            <S.CategoryList>
              {routineCategories.map((category) => (
                <S.Category key={category}>{category}</S.Category>
              ))}
            </S.CategoryList>
          </S.RoutineCard>
        </S.IntroSection>

        <S.ProductSection>
          <RecommendedProductSection
            title="이 제품들과 함께하면 좋아요"
            products={recommendedProducts}
            moreProducts={recommendedProducts}
            moreIngredients={routineIngredients}
            onMoreClick={handleSaveRecommendedProducts}
          />
        </S.ProductSection>

        <S.ButtonArea>
          <CareButton variant="black" onClick={handleMoveToHome}>
            홈으로
          </CareButton>
        </S.ButtonArea>
      </S.Content>
    </S.Page>
  );
}
