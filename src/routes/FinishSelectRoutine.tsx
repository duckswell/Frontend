import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { RoutineTypeCode } from "../api/course";
import { productApi } from "../api/product";
import { routineApi } from "../api/routine";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection, {
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

function normalizeIngredientName(name: string) {
  return name.replace(/\s/g, "").trim();
}

export default function FinishSelectRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishSelectRoutineLocationState | null;

  const hasRequestedProductsRef = useRef(false);

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const routineTitle =
    state?.routineTitle ?? state?.routineTypeName ?? "데일리 루틴";

  const routineImage = state?.routineImage ?? "/assets/Daily_cooldown.png";

  const routineCategories = state?.routineCategories ?? [];

  const routineDisplayName = routineTitle.replace(" 루틴", "");

  useEffect(() => {
    if (!state?.routineTypeCode) {
      console.error("추천 제품 조회에 필요한 routineTypeCode가 없습니다.");

      return;
    }

    if (hasRequestedProductsRef.current) {
      return;
    }

    hasRequestedProductsRef.current = true;

    const routineTypeCode = state.routineTypeCode;

    let isCancelled = false;

    async function fetchRecommendedProducts() {
      try {
        /*
         * 선택한 루틴 타입의 추천 제품과
         * 전체 추천 성분을 동시에 조회한다.
         */
        const [productResponse, ingredientResponse] = await Promise.all([
          routineApi.getRecommendedProductsByRoutineType(routineTypeCode),

          productApi.getRecommendedIngredients(),
        ]);

        if (isCancelled) {
          return;
        }

        console.log("데일리 루틴 타입 추천 제품:", productResponse);

        console.log("전체 추천 성분:", ingredientResponse);

        /*
         * 추천 제품 API에는 ingredientId가 없으므로
         * ingredientName으로 전체 추천 성분과 매칭해서
         * ingredientId를 붙인다.
         */
        const mappedProducts: Product[] = productResponse.map((item) => {
          const matchedIngredient = ingredientResponse.find(
            (ingredient) =>
              normalizeIngredientName(ingredient.name) ===
              normalizeIngredientName(item.ingredientName)
          );

          if (!matchedIngredient) {
            console.warn("ingredientId를 찾지 못한 성분:", item.ingredientName);
          }

          return {
            id: item.product.id,
            brand: item.product.brand,
            name: item.product.name,

            ingredientId: matchedIngredient?.id,

            ingredientName: item.ingredientName,

            categories: [item.ingredientName],

            category: item.product.category,

            imageUrl: item.product.imageUrl,

            linkUrl: item.product.linkUrl,
          };
        });

        console.log("ingredientId 매칭 완료:", mappedProducts);

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
  }, [state?.routineTypeCode]);

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
