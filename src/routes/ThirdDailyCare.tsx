import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { courseApi } from "../api/course";
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
}

export default function ThirdDailyCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as ThirdDailyCareLocationState | null;

  const routine = state?.routine ?? null;

  const [stepSummaries, setStepSummaries] = useState<
    RoutineStepSummary[]
  >([]);

  useEffect(() => {
    if (!routine) {
      return;
    }

    const fetchRoutineSteps = async () => {
      try {
        const steps = await routineApi.getRoutineSteps(
          routine.routineId
        );

        setStepSummaries(steps);
      } catch (error) {
        console.error("루틴 스텝 조회 실패:", error);
      }
    };

    fetchRoutineSteps();
  }, [routine]);

  async function handleCompleteDailyCareRoutine() {
    if (!routine) {
      return;
    }

    try {
      /*
       * courseId만 먼저 확보하고
       * 아직 코스는 종료하지 않는다.
       */
      const currentCourse =
        await courseApi.getCurrentCourse();

      console.log("완료할 데일리 루틴 ID:", routine.routineId);
      console.log("현재 코스 ID:", currentCourse.courseId);

      /*
       * 1. 루틴 완료
       */
      const completionData =
        await routineApi.completeRoutine(
          routine.routineId
        );

      console.log(
        "데일리 루틴 완료 응답:",
        completionData
      );

      /*
       * 2. 추천 제품
       */
      const productData =
        await routineApi.getRecommendedProducts(
          routine.routineId
        );

      console.log(
        "데일리 추천 제품 응답:",
        productData
      );

      const recommendedProducts: Product[] =
        productData.map((item) => ({
          id: item.product.id,
          brand: item.product.brand,
          name: item.product.name,
          categories: [item.ingredientName],
          imageUrl: item.product.imageUrl,
          linkUrl: item.product.linkUrl,
        }));

      /*
       * 3. 마지막으로 코스 종료
       */
      const endedCourse = await courseApi.endCourse(
        currentCourse.courseId
      );

      console.log(
        "데일리 코스 종료 성공:",
        endedCourse
      );

      /*
       * 4. 완료 페이지로 데이터 전달
       */
      navigate("/care/today_routine_summary", {
        state: {
          routineId: routine.routineId,
          completionData,
          recommendedProducts,
        },
      });
    } catch (error) {
      console.error(
        "데일리 루틴 완료 처리 실패:",
        error
      );
    }
  }

  const handleOpenConsultationGuide = () => {
    navigate("/safety");
  };

  function handleMoveToRecommendedProduct(
    stepId: number
  ) {
    const step = stepSummaries.find(
      (stepSummary) =>
        stepSummary.stepId === stepId
    );

    if (!step) {
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.set("from", "care");
    searchParams.set("category", step.category);

    if (step.ingredientId !== null) {
      searchParams.set(
        "ingredientId",
        String(step.ingredientId)
      );
    }

    navigate(
      `/recommend?${searchParams.toString()}`
    );
  }

  if (!routine) {
    return null;
  }

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Main>
        <FocusProgress
          currentStep={3}
          variant="daily"
        />

        <S.Content>
          <S.RoutineIntro>
            <S.SectionTitle>
              {routine.title}
            </S.SectionTitle>

            <S.Description>
              {routine.reasonText}
            </S.Description>
          </S.RoutineIntro>

          <S.CardList>
            {routine.steps.map((step) => (
              <RoutineStepCard
                key={step.stepId}
                step={step.order}
                title={step.stepName}
                product={step.productText}
                method={step.methodText}
                alternative={
                  step.alternateText ?? undefined
                }
                variant="daily"
                productButtonText="추천 성분이 포함된 제품"
                onProductButtonClick={() =>
                  handleMoveToRecommendedProduct(
                    step.stepId
                  )
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

              <S.WarningTitle>
                주의사항
              </S.WarningTitle>
            </S.WarningHeader>

            <S.WarningList>
              <S.WarningText>
                · 피부에 자극이 느껴지면 해당 제품의 사용을
                중단해 주세요.
              </S.WarningText>

              <S.WarningText>
                · 새 제품은 얼굴 전체에 사용하기 전 좁은
                부위에 먼저 테스트해 주세요.
              </S.WarningText>

              <S.WarningText>
                · 이 루틴은 일상 관리 안내이며 의료 처방이
                아닙니다.
              </S.WarningText>

              <S.WarningText>
                · 증상이 심해지거나 통증이 있으면 병원
                상담을 권장합니다.
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
              onClick={
                handleCompleteDailyCareRoutine
              }
              variant="daily"
            >
              루틴 완료
            </CareButton>
          </S.CompleteButtonWrapper>
        </S.Content>
      </S.Main>
    </S.Page>
  );
}