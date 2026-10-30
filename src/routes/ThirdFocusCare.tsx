import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// [아카이빙] FinishRoutine용 추천 제품 처리를 주석처리하면서 사용하지 않음
// import type { Product } from "../components/FocusCare/RecommendedProductSection";

// [백엔드 연동 주석처리] 아카이빙을 위해 API 대신 목 데이터 사용
// import { courseApi } from "../api/course";
// import { procedureApi } from "../api/procedure";
import {
  // routineApi,
  type RoutineDifficultyResponse,
  type RoutineStepSummary,
} from "../api/routine";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineStepCard from "../components/FocusCare/RoutineStepCard";

import * as S from "../styles/FocusCare/ThirdFocusCare.styles";

import {
  // MOCK_COMPLETION_DATA,
  MOCK_FOCUS_COURSE,
  // MOCK_RECOMMENDED_PRODUCTS,
  getMockRoutineStepSummaries,
  mockDelay,
} from "../mocks/focusCare";
// import { getMockIngredient } from "../mocks/products";

interface ThirdFocusCareLocationState {
  routine: RoutineDifficultyResponse;
}

/* [백엔드 연동 주석처리] 시술 일차 계산은 시술 조회 API 결과에만 쓰여 함께 주석처리
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
*/

export default function ThirdFocusCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ThirdFocusCareLocationState | null;

  const routine = state?.routine ?? null;

  // [백엔드 연동 주석처리] 루틴 스텝 조회 API 대신 목 루틴에서 스텝 요약 생성
  // const [stepSummaries, setStepSummaries] = useState<RoutineStepSummary[]>([]);
  const [stepSummaries] = useState<RoutineStepSummary[]>(() =>
    routine ? getMockRoutineStepSummaries(routine) : []
  );

  const [isCompleting, setIsCompleting] = useState(false);

 
  useEffect(() => {
    if (!routine) {
      console.error("ThirdFocusCare에 전달된 routine이 없습니다.");

      return;
    }

    // [백엔드 연동 주석처리] 루틴 스텝 조회 API (목 데이터는 위 useState에서 초기화)
    /*
    let isCancelled = false;

    async function fetchRoutineSteps() {
      try {
        const steps = await routineApi.getRoutineSteps(routine!.routineId);

        if (isCancelled) {
          return;
        }

        console.log("🔥 루틴 스텝 조회 성공:", steps);

        setStepSummaries(steps);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("루틴 스텝 조회 실패:", error);

        setStepSummaries([]);
      }
    }

    fetchRoutineSteps();

    return () => {
      isCancelled = true;
    };
    */
  }, [routine]);

  async function handleCompleteFocusCareRoutine() {
    if (isCompleting || !routine) {
      return;
    }

    try {
      setIsCompleting(true);

  
      // [백엔드 연동 주석처리] 현재 코스 조회 대신 목 집중 코스 사용
      // const currentCourse = await courseApi.getCurrentCourse();
      const currentCourse = MOCK_FOCUS_COURSE;

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

 
      /* [백엔드 연동 주석처리] 시술 조회 API로 시술 일차 계산 (7일차 이상이면 코스 종료 처리에 사용)
      const currentProcedures = await procedureApi.getCurrentProcedures();

      if (!Array.isArray(currentProcedures) || currentProcedures.length === 0) {
        console.error("현재 집중 코스에 등록된 시술이 없습니다.");

        return;
      }

      const currentProcedure = currentProcedures[0];

      const procedureDay = calculateProcedureDay(
        currentProcedure.procedureDate
      );

      console.log("🔥 현재 시술 일차:", procedureDay);
      */


      // [아카이빙] 체험용으로 루틴을 완료하면 항상 집중 코스 완료(FinishFocusCare)로 이동
      // 원래 흐름: 시술 7일차 미만이면 오늘의 루틴 완료(FinishRoutine), 7일차 이상이면 코스 종료 후 FinishFocusCare
      await mockDelay(500);

      navigate("/care/finish_focus_care", {
        state: {
          courseId: currentCourse.courseId,
        },
      });

      /* [아카이빙] FinishRoutine으로 넘기던 루틴 완료·추천 제품 처리 (FinishFocusCare로 바로 이동하면서 사용하지 않음)
      // [백엔드 연동 주석처리] 루틴 완료 API 대신 목 완료 데이터 사용
      // const completionData = await routineApi.completeRoutine(
      //   routine.routineId
      // );
      await mockDelay(500);
      const completionData = MOCK_COMPLETION_DATA;

      console.log("🔥 오늘의 루틴 완료:", completionData);

   
      let recommendedProducts: Product[] = [];

      try {
        // [백엔드 연동 주석처리] 루틴 추천 제품 API 대신 목 추천 제품 사용
        // const recommendedProductResponse =
        //   await routineApi.getRecommendedProducts(routine.routineId);
        const recommendedProductResponse = MOCK_RECOMMENDED_PRODUCTS;

        console.log("🔥 루틴 추천 제품 API 응답:", recommendedProductResponse);

    
        recommendedProducts = recommendedProductResponse.map((item) => {
          const normalizedIngredientName = item.ingredientName.replace(
            /\s/g,
            ""
          );

          const matchedStep = stepSummaries.find((step) => {
            if (step.ingredientId === null || !step.ingredientName) {
              return false;
            }

            return (
              step.ingredientName.replace(/\s/g, "") ===
              normalizedIngredientName
            );
          });

          return {
            id: item.product.id,

            brand: item.product.brand,
            name: item.product.name,

            // [백엔드 연동 주석처리] 루틴 단계에 없는 성분도 추천 제품 페이지에서 보이도록 목 성분 id로 보완
            // ingredientId: matchedStep?.ingredientId ?? undefined,
            ingredientId:
              matchedStep?.ingredientId ??
              getMockIngredient(item.ingredientName)?.id,

            ingredientName: item.ingredientName,

            categories: [item.ingredientName],

            category: item.product.category,

            imageUrl: item.product.imageUrl,
            linkUrl: item.product.linkUrl,
          };
        });

        console.log("🔥 FinishRoutine 전달 추천 제품:", recommendedProducts);
      } catch (error) {
    
        console.error("추천 제품 조회 실패 - 완료 흐름은 계속 진행:", error);
      }

 
      /* [백엔드 연동 주석처리] 시술 7일차 이상이면 코스 종료 API 호출 후 집중 코스 완료 페이지로 이동
      if (procedureDay >= 7) {
        const endedCourse = await courseApi.endCourse(currentCourse.courseId);

        console.log("🔥 집중 코스 종료:", endedCourse);

        navigate("/care/finish_focus_care", {
          state: {
            courseId: endedCourse.id,
          },
        });

        return;
      }
      * /

      navigate("/care/finish_routine", {
        state: {
          courseId: currentCourse.courseId,

          routineId: routine.routineId,

          completionData,

     
          recommendedProducts,
        },
      });
      */
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

  function handleOpenConsultationGuide() {
    navigate("/safety");
  }


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
