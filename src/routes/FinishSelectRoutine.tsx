import axios from "axios";
import { useEffect, useState } from "react";
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

  /*
   * 실제 RecommendedProductSection에
   * 화면으로 표시할 제품
   */
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  /*
   * 더보기 클릭 시
   * RecommendProduct 페이지로 전달할 데이터
   *
   * ingredientId까지 포함한다.
   */
  const [moreProducts, setMoreProducts] = useState<Product[]>([]);

  const routineTitle =
    state?.routineTitle ?? state?.routineTypeName ?? "데일리 루틴";

  const routineImage = state?.routineImage ?? "/assets/Daily_cooldown.png";

  const routineCategories = state?.routineCategories ?? [];

  const routineDisplayName = routineTitle.replace(" 루틴", "");

  useEffect(() => {
    const routineTypeCode = state?.routineTypeCode;

    if (!routineTypeCode) {
      console.error("추천 제품 조회에 필요한 routineTypeCode가 없습니다.");

      return;
    }

    /*
     * 위에서 undefined를 제거한 값을
     * async 함수에서도 확실한 RoutineTypeCode로 사용한다.
     */
    const currentRoutineTypeCode: RoutineTypeCode = routineTypeCode;

    let isCancelled = false;

    async function fetchRecommendedProducts() {
      try {
        console.log(
          "🔥 데일리 추천 제품 요청 routineTypeCode:",
          currentRoutineTypeCode
        );

        const response = await routineApi.getRecommendedProductsByRoutineType(
          currentRoutineTypeCode
        );

        if (isCancelled) {
          return;
        }

        console.log("🔥 데일리 루틴 추천 제품 API 응답:", response);

        const displayProducts: Product[] = response.map((item) => ({
          id: item.product.id,
          brand: item.product.brand,
          name: item.product.name,

          ingredientName: item.ingredientName,

          categories: [item.ingredientName],

          category: item.product.category,

          imageUrl: item.product.imageUrl,

          linkUrl: item.product.linkUrl,
        }));

        console.log("🔥 섹션 표시용 추천 제품:", displayProducts);

        /*
         * 화면 제품은 여기서 먼저 띄운다.
         */
        setRecommendedProducts(displayProducts);

        /*
         * 더보기용 ingredientId 매칭
         */
        try {
          const ingredients = await productApi.getRecommendedIngredients();

          if (isCancelled) {
            return;
          }

          console.log("🔥 ingredientId 매칭용 성분 목록:", ingredients);

          const navigationProducts: Product[] = displayProducts.map(
            (product) => {
              const ingredientName =
                product.ingredientName ?? product.categories?.[0] ?? "";

              const matchedIngredient = ingredients.find(
                (ingredient) =>
                  normalizeIngredientName(ingredient.name) ===
                  normalizeIngredientName(ingredientName)
              );

              if (!matchedIngredient) {
                console.warn("⚠️ ingredientId를 찾지 못함:", ingredientName);
              }

              return {
                ...product,

                ingredientId: matchedIngredient?.id,

                ingredientName,
              };
            }
          );

          console.log("🔥 더보기 이동용 추천 제품:", navigationProducts);

          setMoreProducts(navigationProducts);
        } catch (ingredientError) {
          console.error("더보기용 ingredientId 조회 실패:", ingredientError);
        }
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
            /*
             * 화면에 실제 표시되는 제품.
             *
             * routineTypeCode 추천 제품 API의
             * 응답을 그대로 매핑한 값.
             */
            products={recommendedProducts}
            /*
             * 더보기 버튼에서만 사용.
             *
             * ingredientId 매칭이 끝났다면
             * 이 데이터를 RecommendProduct로 넘긴다.
             */
            moreProducts={
              moreProducts.length > 0 ? moreProducts : recommendedProducts
            }
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
