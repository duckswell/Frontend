import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { RoutineTypeCode } from "../api/course";

import {
  routineApi,
  type RoutineDifficultyResponse,
  type RoutineStepSummary,
} from "../api/routine";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineStepCard from "../components/FocusCare/RoutineStepCard";

import type {
  CareIngredient,
  Product,
} from "../components/FocusCare/RecommendedProductSection";

import * as S from "../styles/DailyCare/ThirdDailyCare.styles";

interface ThirdDailyCareLocationState {
  routine: RoutineDifficultyResponse;
  routineTypeCode?: RoutineTypeCode;
}

function normalizeIngredientName(name: string) {
  return name.replace(/\s/g, "").trim();
}

function isSameIngredientName(firstName: string, secondName: string) {
  const first = normalizeIngredientName(firstName);

  const second = normalizeIngredientName(secondName);

  if (first === second) {
    return true;
  }

  const aliases = [
    ["징크", "징크PCA"],
    ["알로에", "알로에베라"],
  ];

  return aliases.some(
    ([firstAlias, secondAlias]) =>
      (first === firstAlias && second === secondAlias) ||
      (first === secondAlias && second === firstAlias)
  );
}

export default function ThirdDailyCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ThirdDailyCareLocationState | null;

  const routine = state?.routine ?? null;

  const routineTypeCode = state?.routineTypeCode;

  const [stepSummaries, setStepSummaries] = useState<RoutineStepSummary[]>([]);

  const [isCompleting, setIsCompleting] = useState(false);

  /*
   * 현재 실제 루틴의 step 정보 조회.
   *
   * 여기서 ingredientId +
   * ingredientName을 확보한다.
   */
  useEffect(() => {
    if (!routine) {
      return;
    }

    let isCancelled = false;

    async function fetchRoutineSteps() {
      try {
        const steps = await routineApi.getRoutineSteps(routine!.routineId);

        if (isCancelled) {
          return;
        }

        console.log("🔥 데일리 루틴 steps:", steps);

        setStepSummaries(steps);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("루틴 스텝 조회 실패:", error);

        setStepSummaries([]);
      }
    }

    void fetchRoutineSteps();

    return () => {
      isCancelled = true;
    };
  }, [routine]);

  async function handleCompleteDailyCareRoutine() {
    if (!routine || isCompleting) {
      return;
    }

    try {
      setIsCompleting(true);

      /*
       * 1.
       * 오늘 루틴 완료
       */
      const completionData = await routineApi.completeRoutine(
        routine.routineId
      );

      console.log("🔥 데일리 루틴 완료 응답:", completionData);

      /*
       * 완료 시점에도 step 데이터가
       * 확실하게 존재하도록 보정.
       */
      let resolvedStepSummaries = stepSummaries;

      if (resolvedStepSummaries.length === 0) {
        try {
          resolvedStepSummaries = await routineApi.getRoutineSteps(
            routine.routineId
          );

          console.log(
            "🔥 완료 시점 데일리 steps 재조회:",
            resolvedStepSummaries
          );
        } catch (error) {
          console.error("완료 시점 steps 조회 실패:", error);
        }
      }

      /*
       * =====================================
       * 2.
       * 오늘 루틴의 모든 실제 성분 추출
       * =====================================
       *
       * 추천 제품 API 결과가 아니라
       * /steps를 기준으로 한다.
       *
       * 따라서 해당 성분의 추천 제품이
       * Finish 화면에 없더라도
       * 더보기 성분카드에는 들어간다.
       */
      const ingredientMap = new Map<number, CareIngredient>();

      resolvedStepSummaries.forEach((step) => {
        if (step.ingredientId === null || !step.ingredientName) {
          return;
        }

        if (ingredientMap.has(step.ingredientId)) {
          return;
        }

        ingredientMap.set(step.ingredientId, {
          id: step.ingredientId,
          name: step.ingredientName,
        });
      });

      const routineIngredients = Array.from(ingredientMap.values());

      console.log("🔥 오늘 데일리 루틴 전체 성분:", routineIngredients);

      /*
       * =====================================
       * 3.
       * TodayRoutineSummary 섹션 제품 조회
       * =====================================
       */
      let recommendedProducts: Product[] = [];

      try {
        const productData = await routineApi.getRecommendedProducts(
          routine.routineId
        );

        console.log("🔥 데일리 추천 제품 응답:", productData);

        recommendedProducts = productData.map((item) => {
          const matchedIngredient = routineIngredients.find((ingredient) =>
            isSameIngredientName(ingredient.name, item.ingredientName)
          );

          if (!matchedIngredient) {
            console.warn(
              "⚠️ 추천 제품의 ingredientId 매칭 실패:",
              item.ingredientName
            );
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

        console.log(
          "🔥 TodayRoutineSummary 전달 추천 제품:",
          recommendedProducts
        );

        /*
         * 추천 제품 페이지 갔다가
         * 뒤로 돌아왔을 때 제품이 변경되지 않도록
         * 최초 결과 저장.
         */
        sessionStorage.setItem(
          `routine-recommended-products-${routine.routineId}`,
          JSON.stringify(recommendedProducts)
        );
      } catch (error) {
        console.error(
          "데일리 추천 제품 조회 실패 - 완료 페이지 이동은 계속:",
          error
        );
      }

      /*
       * 4.
       * TodayRoutineSummary 이동
       */
      navigate("/care/today_routine_summary", {
        state: {
          routineId: routine.routineId,

          routineTypeCode,

          completionData,

          recommendedProducts,

          /*
           * 핵심.
           *
           * /steps 기준
           * 실제 루틴 전체 성분.
           */
          routineIngredients,
        },
      });
    } catch (error) {
      console.error("데일리 루틴 완료 처리 실패:", error);
    } finally {
      setIsCompleting(false);
    }
  }

  function handleOpenConsultationGuide() {
    navigate("/safety");
  }

  function handleMoveToRecommendedProduct(stepId: number) {
    const step = stepSummaries.find(
      (stepSummary) => stepSummary.stepId === stepId
    );

    if (!step) {
      console.error("추천 제품 이동에 필요한 step 정보가 없습니다.");

      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.set("from", "care");

    searchParams.set("category", step.category);

    if (step.ingredientId !== null) {
      searchParams.set("ingredientId", String(step.ingredientId));

      if (step.ingredientName) {
        searchParams.set("ingredientName", step.ingredientName);
      }
    }

    navigate(`/recommend?${searchParams.toString()}`);
  }

  if (!routine) {
    return null;
  }

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Main>
        <FocusProgress currentStep={3} variant="daily" />

        <S.Content>
          <S.RoutineIntro>
            <S.SectionTitle>{routine.title}</S.SectionTitle>

            <S.Description>{routine.reasonText}</S.Description>
          </S.RoutineIntro>

          <S.CardList>
            {routine.steps.map((step) => {
              const stepSummary = stepSummaries.find(
                (summary) => summary.stepId === step.stepId
              );

              const canShowRecommendation =
                step.order !== 1 &&
                stepSummary !== undefined &&
                stepSummary.ingredientId !== null;

              return (
                <RoutineStepCard
                  key={step.stepId}
                  step={step.order}
                  title={step.stepName}
                  product={step.productText}
                  method={step.methodText}
                  alternative={step.alternateText ?? undefined}
                  variant="daily"
                  productButtonText="추천 성분이 포함된 제품"
                  onProductButtonClick={
                    canShowRecommendation
                      ? () => handleMoveToRecommendedProduct(step.stepId)
                      : undefined
                  }
                />
              );
            })}
          </S.CardList>

          <S.WarningBox>
            <S.WarningHeader>
              <S.WarningIcon
                src="/assets/warning_icon.svg"
                alt=""
                aria-hidden="true"
              />

              <S.WarningTitle>주의사항</S.WarningTitle>
            </S.WarningHeader>

            <S.WarningList>
              <S.WarningText>
                · 피부에 자극이 느껴지면 해당 제품의 사용을 중단해 주세요.
              </S.WarningText>

              <S.WarningText>
                · 새 제품은 얼굴 전체에 사용하기 전 좁은 부위에 먼저 테스트해
                주세요.
              </S.WarningText>

              <S.WarningText>
                · 이 루틴은 일상 관리 안내이며 의료 처방이 아닙니다.
              </S.WarningText>

              <S.WarningText>
                · 증상이 심해지거나 통증이 있으면 병원 상담을 권장합니다.
              </S.WarningText>
            </S.WarningList>

            <S.SymptomButton
              type="button"
              onClick={handleOpenConsultationGuide}
            >
              상담이 필요한 증상 확인
            </S.SymptomButton>
          </S.WarningBox>

          <S.CompleteButtonWrapper>
            <CareButton
              onClick={handleCompleteDailyCareRoutine}
              variant="daily"
              disabled={isCompleting}
            >
              루틴 완료
            </CareButton>
          </S.CompleteButtonWrapper>
        </S.Content>
      </S.Main>
    </S.Page>
  );
}
