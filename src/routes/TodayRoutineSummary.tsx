import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { RoutineTypeCode } from "../api/course";

import { productApi, type RecommendedIngredient } from "../api/product";

import { routineApi, type RoutineCompletionData } from "../api/routine";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection, {
  type CareIngredient,
  type Product,
} from "../components/FocusCare/RecommendedProductSection";

import * as S from "../styles/DailyCare/TodayRoutineSummary.styles";

interface TodayRoutineSummaryLocationState {
  routineId: number;

  routineTypeCode?: RoutineTypeCode;

  completionData: RoutineCompletionData;

  /*
   * ThirdDailyCare에서 전달받은
   * 섹션 추천 제품.
   */
  recommendedProducts?: Product[];

  /*
   * 기존 state 호환용.
   *
   * 지금은 TodayRoutineSummary에서
   * productApi.getRecommendedIngredients()를
   * 다시 조회해서 실제 맞춤 성분을 사용한다.
   */
  routineIngredients?: CareIngredient[];
}

const ROUTINE_TITLE_MAP: Record<RoutineTypeCode, string> = {
  COOLDOWN: "쿨다운",
  CLEAR_UP: "클리어업",
  SEBUM_CONTROL: "피지컨트롤",
  HYDRATION: "수분충전",
};

export default function TodayRoutineSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as TodayRoutineSummaryLocationState | null;

  const routineId = state?.routineId;

  /*
   * 같은 완료 페이지에서
   * 제품추천 페이지로 갔다가 돌아왔을 때
   * 추천 제품이 다시 랜덤 변경되지 않도록
   * routineId 기준으로 캐시한다.
   */
  const storageKey =
    routineId != null ? `routine-recommended-products-${routineId}` : null;

  /*
   * ==================================
   * 화면에 표시할 추천 제품
   * ==================================
   *
   * ThirdDailyCare에서 이미 저장한
   * sessionStorage 값이 있으면 우선 사용한다.
   */
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(
    () => {
      if (!storageKey) {
        return state?.recommendedProducts ?? [];
      }

      const storedProducts = sessionStorage.getItem(storageKey);

      if (!storedProducts) {
        return state?.recommendedProducts ?? [];
      }

      try {
        return JSON.parse(storedProducts) as Product[];
      } catch (error) {
        console.error("저장된 추천 제품 파싱 실패:", error);

        sessionStorage.removeItem(storageKey);

        return state?.recommendedProducts ?? [];
      }
    }
  );

  /*
   * ==================================
   * 더보기로 넘길 실제 맞춤 성분
   * ==================================
   *
   * /api/products/recommendations/ingredients
   *
   * 응답:
   * {
   *   id,
   *   name,
   *   category
   * }
   *
   * 여기서 받은 실제 ingredientId를
   * RecommendProduct로 넘긴다.
   */
  const [routineIngredients, setRoutineIngredients] = useState<
    CareIngredient[]
  >([]);

  const routineTitle = state?.routineTypeCode
    ? ROUTINE_TITLE_MAP[state.routineTypeCode]
    : "데일리";

  const completionSummaryText =
    state?.completionData?.completionSummaryText ??
    "오늘의 데일리 루틴을 완료했어요.";

  /*
   * ==================================
   * 맞춤 성분 조회
   * ==================================
   *
   * DAILY 코스의 실제 루틴이 완료된 시점이므로
   * /api/products/recommendations/ingredients
   * 응답의 id를 그대로 사용할 수 있다.
   *
   * 예:
   * 클리어업
   * → 나이아신아마이드
   * → 비타민C
   */
  useEffect(() => {
    let isCancelled = false;

    async function fetchRoutineIngredients() {
      try {
        const response: RecommendedIngredient[] =
          await productApi.getRecommendedIngredients();

        if (isCancelled) {
          return;
        }

        console.log("🔥 TodayRoutineSummary 맞춤 성분 API 응답:", response);

        const ingredients: CareIngredient[] = response.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
        }));

        console.log("🔥 TodayRoutineSummary 더보기 전달 성분:", ingredients);

        setRoutineIngredients(ingredients);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("TodayRoutineSummary 맞춤 성분 조회 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);

          console.error("API Error Response:", error.response?.data);

          console.error("요청 URL:", error.config?.url);
        }

        /*
         * 맞춤 성분 조회 실패 시
         * 기존 ThirdDailyCare state가 있다면
         * 최후 fallback으로 사용.
         */
        setRoutineIngredients(state?.routineIngredients ?? []);
      }
    }

    void fetchRoutineIngredients();

    return () => {
      isCancelled = true;
    };
  }, [state?.routineIngredients]);

  /*
   * ==================================
   * 섹션 추천 제품 조회
   * ==================================
   *
   * GET
   * /api/routines/{routineId}/recommended-products
   *
   * ThirdDailyCare에서 이미
   * sessionStorage에 저장했다면
   * 다시 조회하지 않는다.
   */
  useEffect(() => {
    if (routineId == null || storageKey == null) {
      console.error("추천 제품 조회에 필요한 routineId가 없습니다.");

      return;
    }

    /*
     * 기존 추천 제품이 있다면
     * 다시 랜덤 추천 API를 호출하지 않는다.
     */
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    const currentRoutineId = routineId;

    const currentStorageKey = storageKey;

    let isCancelled = false;

    async function fetchRecommendedProducts() {
      try {
        const response = await routineApi.getRecommendedProducts(
          currentRoutineId
        );

        if (isCancelled) {
          return;
        }

        console.log("🔥 TodayRoutineSummary 추천 제품 API 응답:", response);

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

        console.log("🔥 TodayRoutineSummary 표시 추천 제품:", mappedProducts);

        setRecommendedProducts(mappedProducts);

        /*
         * 제품 추천 페이지 갔다가
         * 뒤로 돌아와도 같은 제품 유지.
         */
        sessionStorage.setItem(
          currentStorageKey,
          JSON.stringify(mappedProducts)
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("데일리 루틴 추천 제품 조회 실패:", error);

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
  }, [routineId, storageKey]);

  function handleMoveToHome() {
    navigate("/");
  }

  return (
    <S.Page>
      <S.Content>
        <S.CompletionSection>
          <FocusConfetti />

          <S.Title>
            오늘의 {routineTitle} 루틴을
            <br />
            모두 마쳤어요!
          </S.Title>
        </S.CompletionSection>

        <S.RoutineRecordCard>
          <S.RecordTitle>오늘의 루틴 기록</S.RecordTitle>

          <S.RecordDescription>{completionSummaryText}</S.RecordDescription>

          <S.RecordNotice>
            * 이 안내는 관리 목적 참고 정보이며 의료 진단을 대체하지 않아요
          </S.RecordNotice>
        </S.RoutineRecordCard>

        <S.ProductSection>
          <RecommendedProductSection
            title={`${routineTitle} 루틴 추천 제품`}
            /*
             * 완료 페이지 섹션에
             * 실제 표시되는 추천 제품.
             */
            products={recommendedProducts}
            /*
             * 기존 공용 컴포넌트 호환.
             */
            moreProducts={recommendedProducts}
            /*
             * 핵심.
             *
             * /steps가 아니라
             * /api/products/recommendations/ingredients
             * 응답의 실제 ingredientId + name을 전달.
             *
             * RecommendProduct에서는
             * 이 값을 최우선으로 성분카드로 사용한다.
             */
            moreIngredients={routineIngredients}
          />
        </S.ProductSection>

        <S.ButtonArea>
          <CareButton onClick={handleMoveToHome} variant="black">
            홈으로
          </CareButton>
        </S.ButtonArea>
      </S.Content>
    </S.Page>
  );
}
