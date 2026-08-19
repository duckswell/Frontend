import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { RoutineTypeCode } from "../api/course";
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

export default function FinishSelectRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishSelectRoutineLocationState | null;

  const courseId = state?.courseId;
  const routineTypeCode = state?.routineTypeCode;

  const routineTitle =
    state?.routineTitle ?? state?.routineTypeName ?? "데일리 루틴";

  const routineImage = state?.routineImage ?? "/assets/Daily_cooldown.png";

  /*
   * FinishFocusCare에서 선택한 루틴의 성분.
   *
   * 예)
   * COOLDOWN
   * → 센텔라 / 판테놀 / 알로에
   */
  const routineCategories = state?.routineCategories ?? [];

  const routineDisplayName = routineTitle.replace(" 루틴", "");

  /*
   * 제품 추천 페이지에서 뒤로 돌아왔을 때
   * FinishSelectRoutine의 추천 제품이 바뀌지 않도록
   * 최초 조회 결과를 sessionStorage에 저장한다.
   */
  const storageKey =
    courseId !== undefined && routineTypeCode !== undefined
      ? `finish-select-routine-products-${courseId}-${routineTypeCode}`
      : null;

  /*
   * 이미 저장된 추천 제품이 있다면
   * 초기 렌더링부터 바로 사용한다.
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
        console.error("저장된 데일리 추천 제품 파싱 실패:", error);

        sessionStorage.removeItem(storageKey);

        return [];
      }
    }
  );

  /*
   * ==================================================
   * TEST
   *
   * FinishSelectRoutine 시점에
   * 이미 오늘의 DAILY routine이 생성되어 있는지 확인.
   *
   * 확인하려는 것:
   *
   * GET /api/routines/today
   *
   * routineId가 존재한다면
   *
   * GET /api/routines/{routineId}/steps
   *
   * 으로 ingredientId + ingredientName을
   * 가져올 수 있는지 확인한다.
   * ==================================================
   */
  useEffect(() => {
    let isCancelled = false;

    async function testTodayRoutine() {
      try {
        const todayRoutineId = await routineApi.getTodayRoutine();

        if (isCancelled) {
          return;
        }

        console.log(
          "🔥 FinishSelectRoutine 현재 오늘 routineId:",
          todayRoutineId
        );

        if (todayRoutineId === null) {
          console.log("🔥 아직 생성된 DAILY routine 없음");

          return;
        }

        const steps = await routineApi.getRoutineSteps(todayRoutineId);

        if (isCancelled) {
          return;
        }

        console.log("🔥 오늘 DAILY 루틴 steps:", steps);

        console.log("🔥 FinishFocusCare 선택 루틴 성분:", routineCategories);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("🔥 오늘 DAILY 루틴 테스트 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);

          console.error("API Error Response:", error.response?.data);

          console.error("요청 URL:", error.config?.url);
        }
      }
    }

    void testTodayRoutine();

    return () => {
      isCancelled = true;
    };
  }, [routineCategories]);

  /*
   * ==================================================
   * FinishSelectRoutine 추천 제품 조회
   *
   * GET
   * /api/courses/routine-types/{routineTypeCode}/recommended-products
   *
   * 이 API는 FinishSelectRoutine 섹션에 보여줄 제품용.
   * ==================================================
   */
  useEffect(() => {
    if (routineTypeCode === undefined || storageKey === null) {
      console.error("추천 제품 조회에 필요한 routineTypeCode가 없습니다.");

      return;
    }

    /*
     * 이전에 같은 완료 페이지에서 이미 조회했다면
     * 다시 API를 호출하지 않는다.
     *
     * 제품 추천 페이지 갔다가 뒤로 와도
     * 섹션 제품 유지.
     */
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    const currentRoutineTypeCode: RoutineTypeCode = routineTypeCode;

    const currentStorageKey = storageKey;

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

        setRecommendedProducts(mappedProducts);

        /*
         * 처음 받아온 추천 제품을 저장해서
         * 뒤로 왔을 때 다시 랜덤 조회되지 않게 한다.
         */
        sessionStorage.setItem(
          currentStorageKey,
          JSON.stringify(mappedProducts)
        );
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
  }, [routineTypeCode, storageKey]);

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
             * FinishSelectRoutine 화면에
             * 실제 표시되는 추천 제품.
             */
            products={recommendedProducts}
            /*
             * 기존 RecommendedProductSection
             * 호환용.
             */
            moreProducts={recommendedProducts}
            /*
             * 더보기 →
             * RecommendProduct의 성분카드 기준.
             *
             * FinishFocusCare에서 선택한
             * 루틴의 성분 전체를 전달한다.
             */
            moreIngredientNames={routineCategories}
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
