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

  /*
   * FinishFocusCare에서 전달받은 루틴 태그.
   *
   * 이 값은 현재 루틴 카드 안에서
   * 성분 이름을 보여주는 용도로만 사용한다.
   *
   * 더보기의 성분카드 데이터는
   * 더 이상 이 문자열 배열을 사용하지 않는다.
   */
  const routineCategories = state?.routineCategories ?? [];

  const routineDisplayName = routineTitle.replace(" 루틴", "");

  /*
   * ==================================================
   * 추천 제품 sessionStorage
   * ==================================================
   */
  const productStorageKey =
    courseId !== undefined && routineTypeCode !== undefined
      ? `finish-select-routine-products-${courseId}-${routineTypeCode}`
      : null;

  /*
   * ==================================================
   * 루틴 전체 성분 sessionStorage
   *
   * 새 API에서 받은
   * ingredientId + ingredientName을 저장한다.
   * ==================================================
   */
  const ingredientStorageKey =
    courseId !== undefined && routineTypeCode !== undefined
      ? `finish-select-routine-ingredients-${courseId}-${routineTypeCode}`
      : null;

  /*
   * ==================================================
   * 추천 제품
   * ==================================================
   */
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

  /*
   * ==================================================
   * 선택한 데일리 루틴의 전체 성분
   *
   * RecommendProduct의 성분카드에 사용.
   * ==================================================
   */
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

  /*
   * ==================================================
   * 데일리 루틴 전체 성분 조회
   *
   * GET
   * /api/courses/routine-types/{routineTypeCode}/ingredients
   *
   * 예:
   *
   * CLEAR_UP
   * →
   * [
   *   {
   *     ingredientId: 3,
   *     ingredientName: "나이아신아마이드"
   *   },
   *   {
   *     ingredientId: 5,
   *     ingredientName: "비타민C"
   *   }
   * ]
   *
   * 이 값 전체를 더보기에서
   * RecommendProduct에 전달한다.
   * ==================================================
   */
  useEffect(() => {
    if (routineTypeCode === undefined || ingredientStorageKey === null) {
      console.error("루틴 성분 조회에 필요한 routineTypeCode가 없습니다.");

      return;
    }

    /*
     * 이미 받아온 성분이 있다면
     * 제품 페이지 갔다가 돌아왔을 때
     * 다시 호출하지 않는다.
     */
    if (sessionStorage.getItem(ingredientStorageKey)) {
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

        /*
         * RecommendedProductSection이 사용하는
         * CareIngredient 형태로 변환.
         */
        const mappedIngredients: CareIngredient[] = response.map(
          (ingredient) => ({
            id: ingredient.ingredientId,
            name: ingredient.ingredientName,
          })
        );

        console.log("🔥 더보기로 전달할 전체 성분:", mappedIngredients);

        setRoutineIngredients(mappedIngredients);

        sessionStorage.setItem(
          currentStorageKey,
          JSON.stringify(mappedIngredients)
        );
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

  /*
   * ==================================================
   * FinishSelectRoutine 추천 제품 조회
   *
   * GET
   * /api/courses/routine-types/{routineTypeCode}/recommended-products
   *
   * 이 API는 아래에 보여주는
   * "이 제품들과 함께하면 좋아요" 영역 전용.
   *
   * 성분카드용 API와 역할을 분리한다.
   * ==================================================
   */
  useEffect(() => {
    if (routineTypeCode === undefined || productStorageKey === null) {
      console.error("추천 제품 조회에 필요한 routineTypeCode가 없습니다.");

      return;
    }

    /*
     * 이전에 같은 완료 페이지에서
     * 이미 추천 제품을 조회했다면
     * 다시 호출하지 않는다.
     */
    if (sessionStorage.getItem(productStorageKey)) {
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

        setRecommendedProducts(mappedProducts);

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
  }, [routineTypeCode, productStorageKey]);

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
             * 실제 표시할 제품.
             */
            products={recommendedProducts}
            /*
             * 기존 더보기 제품 데이터.
             */
            moreProducts={recommendedProducts}
            /*
             * 핵심.
             *
             * 새 API로 조회한
             * 해당 데일리 루틴의 전체 성분.
             *
             * ingredientId +
             * ingredientName이 들어 있다.
             */
            moreIngredients={routineIngredients}
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
