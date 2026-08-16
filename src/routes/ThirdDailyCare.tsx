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

import type { Product } from "../components/FocusCare/RecommendedProductSection";

import * as S from "../styles/DailyCare/ThirdDailyCare.styles";

interface ThirdDailyCareLocationState {
  routine: RoutineDifficultyResponse;
  routineTypeCode?: RoutineTypeCode;
}

export default function ThirdDailyCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ThirdDailyCareLocationState | null;

  const routine = state?.routine ?? null;

  const routineTypeCode = state?.routineTypeCode;

  const [stepSummaries, setStepSummaries] = useState<RoutineStepSummary[]>([]);

  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!routine) {
      return;
    }

    const fetchRoutineSteps = async () => {
      try {
        const steps = await routineApi.getRoutineSteps(routine.routineId);

        setStepSummaries(steps);
      } catch (error) {
        console.error("루틴 스텝 조회 실패:", error);
      }
    };

    fetchRoutineSteps();
  }, [routine]);

  async function handleCompleteDailyCareRoutine() {
    if (!routine || isCompleting) {
      return;
    }

    try {
      setIsCompleting(true);

      /*
       * 1. 오늘의 루틴만 완료 처리
       *
       * DAILY course 자체는 종료하지 않는다.
       * course는 RoutineChange에서 다른 루틴으로
       * 변경할 때만 end 처리한다.
       */
      const completionData = await routineApi.completeRoutine(
        routine.routineId
      );

      console.log("데일리 루틴 완료 응답:", completionData);

      /*
       * 2. 추천 제품 조회
       *
       * 추천 제품 조회가 실패하더라도
       * 루틴 완료 페이지는 정상적으로 보여준다.
       */
      let recommendedProducts: Product[] = [];

      try {
        const productData = await routineApi.getRecommendedProducts(
          routine.routineId
        );

        console.log("데일리 추천 제품 응답:", productData);

        recommendedProducts = productData.map((item) => ({
          id: item.product.id,
          brand: item.product.brand,
          name: item.product.name,
          categories: [item.ingredientName],
          imageUrl: item.product.imageUrl,
          linkUrl: item.product.linkUrl,
        }));
      } catch (error) {
        console.error(
          "데일리 추천 제품 조회 실패 - 완료 페이지 이동은 계속 진행:",
          error
        );
      }

      /*
       * 3. DAILY course는 종료하지 않고
       * 오늘 루틴 요약 페이지로 이동
       */
      navigate("/care/today_routine_summary", {
        state: {
          routineId: routine.routineId,
          routineTypeCode,
          completionData,
          recommendedProducts,
        },
      });
    } catch (error) {
      console.error("데일리 루틴 완료 처리 실패:", error);
    } finally {
      setIsCompleting(false);
    }
  }

  const handleOpenConsultationGuide = () => {
    navigate("/safety");
  };

  function handleMoveToRecommendedProduct(stepId: number) {
    const step = stepSummaries.find(
      (stepSummary) => stepSummary.stepId === stepId
    );

    if (!step) {
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.set("from", "care");

    searchParams.set("category", step.category);

    if (step.ingredientId !== null) {
      searchParams.set("ingredientId", String(step.ingredientId));
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
            {routine.steps.map((step) => (
              <RoutineStepCard
                key={step.stepId}
                step={step.order}
                title={step.stepName}
                product={step.productText}
                method={step.methodText}
                alternative={step.alternateText ?? undefined}
                variant="daily"
                productButtonText="추천 성분이 포함된 제품"
                onProductButtonClick={() =>
                  handleMoveToRecommendedProduct(step.stepId)
                }
              />
            ))}
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
              상담 안내 확인
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
