import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { routineApi, type RoutineCompletionData } from "../api/routine";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection, {
  type Product,
} from "../components/FocusCare/RecommendedProductSection";
import RoutineRecordCard from "../components/FocusCare/RoutineRecordCard";

import * as S from "../styles/FocusCare/FinishRoutine.styles";

interface FinishRoutineLocationState {
  courseId: number;
  routineId: number;
  completionData: RoutineCompletionData;

  /*
   * ThirdFocusCare에서 넘겨준 추천 제품 데이터
   *
   * ingredientId / ingredientName이 포함되어 있어서
   * 더보기 → RecommendProduct에서
   * 추천 성분 카드 생성에 사용한다.
   */
  recommendedProducts?: Product[];
}

export default function FinishRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishRoutineLocationState | null;

  const completionData = state?.completionData;

  const routineId = state?.routineId;

  /*
   * ThirdFocusCare에서 전달받은 추천 데이터
   *
   * ingredientId가 포함되어 있기 때문에
   * RecommendedProductSection의 "더보기"를 통해
   * RecommendProduct 페이지로 전달한다.
   */
  const moreProducts = state?.recommendedProducts ?? [];

  const storageKey =
    routineId != null ? `routine-recommended-products-${routineId}` : null;

  /*
   * FinishRoutine 화면에 실제로 표시할 추천 제품
   *
   * GET
   * /api/routines/{routineId}/recommended-products
   *
   * 응답 결과를 Product 형태로 변환해서 사용한다.
   */
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(
    () => {
      if (!storageKey) {
        return [];
      }

      const storedProducts = sessionStorage.getItem(storageKey);

      if (!storedProducts) {
        return [];
      }

      try {
        return JSON.parse(storedProducts) as Product[];
      } catch (error) {
        console.error("저장된 추천 제품 파싱 실패:", error);

        sessionStorage.removeItem(storageKey);

        return [];
      }
    }
  );

  useEffect(() => {
    if (routineId == null || storageKey == null) {
      console.error("추천 제품 조회에 필요한 routineId가 없습니다.");

      return;
    }

    /*
     * 같은 루틴에서 이미 조회한 추천 제품이 있으면
     * 다시 API를 호출하지 않는다.
     *
     * 뒤로 갔다가 다시 FinishRoutine에 들어오더라도
     * 같은 제품을 유지하기 위함.
     */
    const storedProducts = sessionStorage.getItem(storageKey);

    if (storedProducts) {
      return;
    }

    const currentRoutineId = routineId;
    const currentStorageKey = storageKey;

    let isCancelled = false;

    async function fetchRecommendedProducts() {
      try {
        console.log("🔥 집중 루틴 추천 제품 요청:", currentRoutineId);

        /*
         * GET
         * /api/routines/{routineId}/recommended-products
         */
        const response = await routineApi.getRecommendedProducts(
          currentRoutineId
        );

        if (isCancelled) {
          return;
        }

        console.log("🔥 집중 루틴 추천 제품 조회 성공:", response);

        /*
         * API 응답
         *
         * {
         *   ingredientName,
         *   product: {
         *     id,
         *     name,
         *     brand,
         *     category,
         *     imageUrl,
         *     linkUrl
         *   }
         * }
         *
         * ↓
         *
         * RecommendedProductSection에서 사용하는
         * Product 형태로 변환한다.
         *
         * 여기서 ingredientId는 필요 없다.
         * 화면에 제품을 표시하기 위한 데이터이기 때문.
         */
        const mappedProducts: Product[] = response.map((item) => ({
          id: item.product.id,

          brand: item.product.brand,

          name: item.product.name,

          ingredientName: item.ingredientName,

          /*
           * 기존 컴포넌트 호환
           */
          categories: [item.ingredientName],

          category: item.product.category,

          imageUrl: item.product.imageUrl,

          linkUrl: item.product.linkUrl,
        }));

        setRecommendedProducts(mappedProducts);

        /*
         * 동일 routineId로 다시 들어왔을 때
         * 추천 제품이 달라지는 것을 방지한다.
         */
        sessionStorage.setItem(
          currentStorageKey,
          JSON.stringify(mappedProducts)
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("집중 루틴 추천 제품 조회 실패:", error);

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

  function handleMoveToDaily() {
    navigate("/preview");
  }

  return (
    <S.Page>
      <S.Content>
        <S.CompletionSection>
          <FocusConfetti />

          <S.CompletionTitle>
            오늘의 루틴을
            <br />
            모두 마쳤어요!
          </S.CompletionTitle>
        </S.CompletionSection>

        <S.InformationSection>
          <RoutineRecordCard
            completionSummaryText={
              completionData?.completionSummaryText ??
              "오늘의 루틴을 완료했어요."
            }
            ingredients={completionData?.recommendedIngredients ?? []}
          />

          <S.DailyCard type="button" onClick={handleMoveToDaily}>
            <S.DailyImage
              src="/assets/Home_Daily.png"
              alt=""
              aria-hidden="true"
            />

            <S.DailyTextArea>
              <S.DailyDescription>
                집중 코스가 끝나면 데일리로 이어가요
              </S.DailyDescription>

              <S.DailyTitle>데일리 코스 살펴보기</S.DailyTitle>
            </S.DailyTextArea>

            <S.GotoIcon src="/assets/Goto.svg" alt="" aria-hidden="true" />
          </S.DailyCard>
        </S.InformationSection>

        <RecommendedProductSection
          title="오늘의 추천 성분 제품"
          /*
           * FinishRoutine 화면에 보이는 제품
           *
           * GET
           * /api/routines/{routineId}/recommended-products
           */
          products={recommendedProducts}
          /*
           * "더보기"를 눌렀을 때 넘기는 데이터
           *
           * ThirdFocusCare에서 만들어준
           * ingredientId + ingredientName 포함 데이터
           */
          moreProducts={moreProducts}
        />

        <S.ButtonWrapper>
          <CareButton variant="black" onClick={handleMoveToHome}>
            홈으로
          </CareButton>
        </S.ButtonWrapper>
      </S.Content>
    </S.Page>
  );
}
