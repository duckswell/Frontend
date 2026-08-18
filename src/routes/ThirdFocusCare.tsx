import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { courseApi } from "../api/course";
import { procedureApi } from "../api/procedure";
import {
  routineApi,
  type RoutineDifficultyResponse,
  type RoutineStepSummary,
} from "../api/routine";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineStepCard from "../components/FocusCare/RoutineStepCard";

import * as S from "../styles/FocusCare/ThirdFocusCare.styles";

interface ThirdFocusCareLocationState {
  routine: RoutineDifficultyResponse;
}

/**
 * 시술 날짜 기준 현재 몇 일차인지 계산
 *
 * 예)
 * 8/13 시술
 * 8/13 → 1일차
 * 8/14 → 2일차
 * ...
 * 8/19 → 7일차
 */
function calculateProcedureDay(procedureDate: string): number {
  const [year, month, day] = procedureDate.split("-").map(Number);

  const procedure = new Date(year, month - 1, day);
  const today = new Date();

  procedure.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - procedure.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(diffDays + 1, 1);
}

export default function ThirdFocusCare() {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("🚨 ThirdFocusCare 컴포넌트 실행됨");
  console.log("🚨 현재 pathname:", location.pathname);
  console.log("🚨 전달받은 state:", location.state);

  const state = location.state as ThirdFocusCareLocationState | null;
  const routine = state?.routine ?? null;

  console.log("🚨 전달받은 routine:", routine);

  const [stepSummaries, setStepSummaries] = useState<RoutineStepSummary[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!routine) {
      console.error("ThirdFocusCare에 전달된 routine이 없습니다.");
      return;
    }

    const fetchRoutineSteps = async () => {
      try {
        const steps = await routineApi.getRoutineSteps(routine.routineId);

        console.log("루틴 스텝 조회 성공:", steps);

        setStepSummaries(steps);
      } catch (error) {
        console.error("루틴 스텝 조회 실패:", error);
      }
    };

    fetchRoutineSteps();
  }, [routine]);

  async function handleCompleteFocusCareRoutine() {
    if (isCompleting || !routine) {
      return;
    }

    try {
      setIsCompleting(true);

      /*
       * 1. 현재 진행 중인 코스 확인
       *
       * 루틴 완료 전에 현재 FOCUS 코스가
       * 정상적으로 존재하는지 먼저 확인한다.
       */
      const currentCourse = await courseApi.getCurrentCourse();

      if (!currentCourse) {
        console.error("현재 진행 중인 코스가 없습니다.");
        return;
      }

      if (currentCourse.courseType !== "FOCUS") {
        console.error(
          "현재 진행 중인 코스가 집중 코스가 아닙니다:",
          currentCourse
        );
        return;
      }

      console.log("현재 집중 코스:", currentCourse);
      console.log("현재 집중 코스 ID:", currentCourse.courseId);

      /*
       * 2. 현재 집중 코스에 등록된 시술 조회
       *
       * /api/procedures/current는
       * 현재 진행 중인 집중 코스에 등록된 시술만 반환한다.
       *
       * 코스를 종료한 뒤에는 빈 배열이 되므로
       * 반드시 endCourse보다 먼저 조회해야 한다.
       */
      const currentProcedures = await procedureApi.getCurrentProcedures();

      console.log("현재 집중 코스 시술:", currentProcedures);

      if (!Array.isArray(currentProcedures) || currentProcedures.length === 0) {
        console.error("현재 집중 코스에 등록된 시술이 없습니다.");
        return;
      }

      /*
       * Home에서도 currentProcedures[0]을
       * 현재 시술 기준으로 사용하고 있으므로
       * 동일한 기준으로 사용한다.
       */
      const currentProcedure = currentProcedures[0];

      const procedureDay = calculateProcedureDay(
        currentProcedure.procedureDate
      );

      console.log("시술 정보:", currentProcedure);
      console.log("시술일:", currentProcedure.procedureDate);
      console.log("현재 시술 일차:", procedureDay);

      /*
       * 3. 오늘의 루틴 완료
       *
       * 루틴 완료와 집중 코스 종료는 별개이다.
       *
       * 1~6일차:
       *   오늘 루틴만 완료
       *
       * 7일차:
       *   오늘 루틴 완료 후 집중 코스까지 종료
       */
      const completionData = await routineApi.completeRoutine(
        routine.routineId
      );

      console.log("오늘의 루틴 완료 성공:", completionData);

      /*
       * 4. 추천 제품 조회
       *
       * 추천 제품 API가 실패하더라도
       * 루틴 완료 및 이후 페이지 이동은 계속 진행한다.
       */
      let recommendedProducts: {
        id: number;
        brand: string;
        name: string;
        categories: string[];
        imageUrl: string;
        linkUrl: string;
      }[] = [];

      try {
        const recommendedProductResponse =
          await routineApi.getRecommendedProducts(routine.routineId);

        console.log("추천 제품 조회 성공:", recommendedProductResponse);

        recommendedProducts = recommendedProductResponse.map((item) => ({
          id: item.product.id,
          brand: item.product.brand,
          name: item.product.name,
          categories: [item.ingredientName],
          imageUrl: item.product.imageUrl,
          linkUrl: item.product.linkUrl,
        }));
      } catch (error) {
        console.error("추천 제품 조회 실패 - 이후 흐름은 계속 진행:", error);
      }

      /*
       * 5. 시술 7일차 이상
       *
       * 이때만 집중 코스 자체를 종료한다.
       *
       * ThirdFocusCare
       * → 집중 코스 종료
       * → FinishFocusCare
       * → 데일리 루틴 선택
       * → FinishSelectRoutine
       */
      if (procedureDay >= 7) {
        console.log(
          `시술 ${procedureDay}일차 → 집중 코스 종료 후 FinishFocusCare 이동`
        );

        const endedCourse = await courseApi.endCourse(currentCourse.courseId);

        console.log("집중 코스 종료 성공:", endedCourse);

        navigate("/care/finish_focus_care", {
          state: {
            courseId: endedCourse.id,
          },
        });

        return;
      }

      /*
       * 6. 시술 1~6일차
       *
       * 집중 코스는 절대로 종료하지 않는다.
       *
       * 오늘 루틴만 완료하고 FinishRoutine으로 이동한다.
       *
       * 따라서 홈으로 돌아간 뒤 다음 날에도
       * 같은 FOCUS 코스를 계속 사용할 수 있다.
       */
      console.log(
        `시술 ${procedureDay}일차 → 집중 코스 유지 / FinishRoutine 이동`
      );

      navigate("/care/finish_routine", {
        state: {
          courseId: currentCourse.courseId,
          routineId: routine.routineId,
          completionData,
          recommendedProducts,
        },
      });
    } catch (error) {
      console.error("루틴 완료 처리 실패:", error);

      if (axios.isAxiosError(error)) {
        console.error("HTTP Status:", error.response?.status);
        console.error("API Error Response:", error.response?.data);
        console.error("요청 URL:", error.config?.url);
      }
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
      console.error("추천 제품 이동에 필요한 step 정보를 찾지 못했습니다.");
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
      <NavBar title="집중 코스" />

      <S.Main>
        <FocusProgress currentStep={3} />

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
                · 각질이 있는 부위는 문지르거나 억지로 떼어내지 마세요
              </S.WarningText>

              <S.WarningText>
                · 따갑거나 자극이 느껴지면 해당 단계를 건너뛰어도 돼요
              </S.WarningText>

              <S.WarningText>
                · 이 루틴은 일상적인 피부 관리 안내이며 의료 진단을 대신하지
                않아요.
              </S.WarningText>

              <S.WarningText>
                · 붓기나 통증이 심해지면 루틴을 멈추고 의료기관에 상담해 주세요.
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
              variant="focus"
              disabled={isCompleting}
              onClick={handleCompleteFocusCareRoutine}
            >
              루틴 완료
            </CareButton>
          </S.CompleteButtonWrapper>
        </S.Content>
      </S.Main>
    </S.Page>
  );
}
