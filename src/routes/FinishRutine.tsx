import axios from "axios";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  routineApi,
  type RoutineCompletionData,
} from "../api/routine";

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
}

export default function FinishRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as FinishRoutineLocationState | null;

  const hasRequestedProductsRef =
    useRef(false);

  const completionData =
    state?.completionData;

  const routineId = state?.routineId;

  const storageKey = routineId
    ? `routine-recommended-products-${routineId}`
    : null;

  const [
    recommendedProducts,
    setRecommendedProducts,
  ] = useState<Product[]>(() => {
    if (!storageKey) {
      return [];
    }

    const storedProducts =
      sessionStorage.getItem(storageKey);

    if (!storedProducts) {
      return [];
    }

    try {
      return JSON.parse(
        storedProducts
      ) as Product[];
    } catch (error) {
      console.error(
        "저장된 추천 제품 파싱 실패:",
        error
      );

      sessionStorage.removeItem(storageKey);

      return [];
    }
  });

  useEffect(() => {
    if (!routineId || !storageKey) {
      console.error(
        "추천 제품 조회에 필요한 routineId가 없습니다."
      );

      return;
    }

    /*
     * 이미 한 번 받아둔 제품이 있으면
     * 다시 랜덤 추천 API를 호출하지 않는다.
     */
    if (
      sessionStorage.getItem(storageKey)
    ) {
      return;
    }

    if (
      hasRequestedProductsRef.current
    ) {
      return;
    }

    hasRequestedProductsRef.current =
      true;

    async function fetchRecommendedProducts() {
      try {
        const response =
          await routineApi.getRecommendedProducts(
            routineId
          );

        console.log(
          "집중 루틴 추천 제품 조회 성공:",
          response
        );

        const mappedProducts: Product[] =
          response.map((item) => ({
            id: item.product.id,
            brand: item.product.brand,
            name: item.product.name,

            categories: [
              item.ingredientName,
            ],

            ingredientName:
              item.ingredientName,

            category:
              item.product.category,

            imageUrl:
              item.product.imageUrl,

            linkUrl:
              item.product.linkUrl,
          }));

        setRecommendedProducts(
          mappedProducts
        );

        sessionStorage.setItem(
          storageKey,
          JSON.stringify(mappedProducts)
        );
      } catch (error) {
        console.error(
          "집중 루틴 추천 제품 조회 실패:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          console.error(
            "HTTP Status:",
            error.response?.status
          );

          console.error(
            "API Error Response:",
            error.response?.data
          );

          console.error(
            "요청 URL:",
            error.config?.url
          );
        }
      }
    }

    fetchRecommendedProducts();
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
              completionData
                ?.completionSummaryText ??
              "오늘의 루틴을 완료했어요."
            }
            ingredients={
              completionData
                ?.recommendedIngredients ??
              []
            }
          />

          <S.DailyCard
            type="button"
            onClick={handleMoveToDaily}
          >
            <S.DailyImage
              src="/assets/Home_Daily.png"
              alt=""
              aria-hidden="true"
            />

            <S.DailyTextArea>
              <S.DailyDescription>
                집중 코스가 끝나면 데일리로
                이어가요
              </S.DailyDescription>

              <S.DailyTitle>
                데일리 코스 살펴보기
              </S.DailyTitle>
            </S.DailyTextArea>

            <S.GotoIcon
              src="/assets/Goto.svg"
              alt=""
              aria-hidden="true"
            />
          </S.DailyCard>
        </S.InformationSection>

        <RecommendedProductSection
          title="오늘의 추천 성분 제품"
          products={recommendedProducts}
        />

        <S.ButtonWrapper>
          <CareButton
            variant="black"
            onClick={handleMoveToHome}
          >
            홈으로
          </CareButton>
        </S.ButtonWrapper>
      </S.Content>
    </S.Page>
  );
}