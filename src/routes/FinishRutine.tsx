import axios from "axios";
import { useEffect, useRef, useState } from "react";
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
   * ThirdFocusCare에서 넘겨준 데이터
   *
   * 화면 제품 표시용이 아니라
   * 더보기 → 성분 카드 이동용
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
   * ThirdFocusCare에서 전달받은
   * ingredientId가 포함된 데이터.
   *
   * 오직 더보기 이동에 사용한다.
   */
  const moreProducts = state?.recommendedProducts ?? [];

  const hasRequestedProductsRef = useRef(false);

  const storageKey =
    routineId != null ? `routine-recommended-products-${routineId}` : null;

  /*
   * 화면에 보여주는 추천 제품.
   *
   * 기존 방식 그대로:
   * routineId 기준 추천 제품 API 사용.
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
     * 기존 캐시가 있으면
     * 화면용 제품을 다시 랜덤 조회하지 않는다.
     */
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    if (hasRequestedProductsRef.current) {
      return;
    }

    hasRequestedProductsRef.current = true;

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

        console.log("집중 루틴 추천 제품 조회 성공:", response);

        /*
         * 여기서는 화면 표시만 목적이므로
         * ingredientId가 필요하지 않다.
         */
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

        setRecommendedProducts(mappedProducts);

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
           * 화면에는 기존 제품
           */
          products={recommendedProducts}
          /*
           * 더보기에는
           * ThirdFocusCare 성분 정보
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
