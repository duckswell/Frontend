import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  courseApi,
  type RoutineTypeCode,
  type SymptomSummaryResponse,
} from "../api/course";

import CareButton from "../components/CareButton";
import { RoutineCard } from "../components/DailycoursePreview/RoutineCard";
import FocusConfetti from "../components/FocusCare/FocusConfetti";

import * as S from "../styles/FocusCare/FinishFocusCare.styles";

type PageStep = "intro" | "indicator" | "concern" | "routine";

type SkinConcern =
  | "붉은기"
  | "열감"
  | "따가움"
  | "건조함"
  | "각질"
  | "번들거림"
  | "가려움"
  | "붓기"
  | "트러블";

type RoutineId = "calm" | "clear" | "sebum" | "moisture";

interface FinishFocusCareLocationState {
  courseId: number;
}

interface RoutineOption {
  id: RoutineId;
  title: string;
  description: string;
  tags: string[];
  iconSrc: string;
}

const PAGE_STEPS: PageStep[] = ["intro", "indicator", "concern", "routine"];

const SKIN_CONCERNS: SkinConcern[] = [
  "붉은기",
  "열감",
  "따가움",
  "건조함",
  "각질",
  "번들거림",
  "가려움",
  "붓기",
  "트러블",
];

const SYMPTOM_LABEL_MAP: Record<string, SkinConcern> = {
  REDNESS: "붉은기",
  HEAT: "열감",
  STINGING: "따가움",
  DRYNESS: "건조함",
  FLAKING: "각질",
  OILINESS: "번들거림",
  ITCHINESS: "가려움",
  SWELLING: "붓기",
};

const ROUTINE_TYPE_CODE_MAP: Record<RoutineId, RoutineTypeCode> = {
  calm: "COOLDOWN",
  clear: "CLEAR_UP",
  sebum: "SEBUM_CONTROL",
  moisture: "HYDRATION",
};

const ROUTINE_ID_BY_TYPE_CODE: Record<RoutineTypeCode, RoutineId> = {
  COOLDOWN: "calm",
  CLEAR_UP: "clear",
  SEBUM_CONTROL: "sebum",
  HYDRATION: "moisture",
};

const ROUTINE_OPTIONS: RoutineOption[] = [
  {
    id: "calm",
    title: "쿨다운 루틴",
    description: "쉽게 붉어지고 예민해지는 피부를 진정",
    tags: ["센텔라", "판테놀", "알로에"],
    iconSrc: "/assets/Daily_cooldown.png",
  },
  {
    id: "clear",
    title: "클리어업 루틴",
    description: "칙칙한 피부톤과 눈에 띄는 피부 흔적에 집중",
    tags: ["나이아신아마이드", "비타민C"],
    iconSrc: "/assets/Daily_clearup.png",
  },
  {
    id: "sebum",
    title: "피지컨트롤 루틴",
    description: "과도한 피지가 고민인 피부를 산뜻하고 깨끗하게",
    tags: ["나이아신아마이드", "징크 PCA"],
    iconSrc: "/assets/Daily_pore.png",
  },
  {
    id: "moisture",
    title: "수분충전 루틴",
    description: "건조하거나 당기는 피부에 수분을 채워 촉촉하게",
    tags: ["히알루론산", "세라마이드", "판테놀"],
    iconSrc: "/assets/Daily_barrier.png",
  },
];

export default function FinishFocusCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishFocusCareLocationState | null;
  const courseId = state?.courseId;

  const [currentStep, setCurrentStep] = useState<PageStep>("intro");

  const [symptomSummary, setSymptomSummary] =
    useState<SymptomSummaryResponse | null>(null);

  const [selectedRoutine, setSelectedRoutine] = useState<RoutineId | null>(
    null
  );

  const [isStartingDailyCourse, setIsStartingDailyCourse] = useState(false);

  const [shouldAutoAdvanceIndicator, setShouldAutoAdvanceIndicator] =
    useState(false);

  const touchStartY = useRef<number | null>(null);
  const isWheelLocked = useRef(false);
  const routineScreenRef = useRef<HTMLElement | null>(null);

  const primaryConcerns: SkinConcern[] =
    symptomSummary?.topSymptoms
      .map((item) => SYMPTOM_LABEL_MAP[item.symptom])
      .filter((concern): concern is SkinConcern => Boolean(concern)) ?? [];

  const secondaryConcerns = SKIN_CONCERNS.filter(
    (concern) => !primaryConcerns.includes(concern)
  );

  const recommendedRoutineId =
    symptomSummary?.recommendedRoutineTypeCode !== null &&
    symptomSummary?.recommendedRoutineTypeCode !== undefined
      ? ROUTINE_ID_BY_TYPE_CODE[symptomSummary.recommendedRoutineTypeCode]
      : null;

  const recommendedBadgeText =
    primaryConcerns.length > 0
      ? `${primaryConcerns.join("·")} 맞춤 추천`
      : "맞춤 추천";

  const isRoutineSelected = selectedRoutine !== null;

  useEffect(() => {
    if (courseId === undefined) {
      console.error("증상 요약 조회에 필요한 courseId가 없습니다.");
      return;
    }

    const targetCourseId = courseId;

    async function fetchSymptomSummary() {
      try {
        const summary = await courseApi.getSymptomSummary(targetCourseId);

        console.log("7일 증상 요약 조회 성공:", summary);

        setSymptomSummary(summary);

        if (summary.recommendedRoutineTypeCode) {
          const recommendedId =
            ROUTINE_ID_BY_TYPE_CODE[summary.recommendedRoutineTypeCode];

          setSelectedRoutine(recommendedId);
        }
      } catch (error) {
        console.error("7일 증상 요약 조회 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);
          console.error("API Error Response:", error.response?.data);
          console.error("요청 URL:", error.config?.url);
        }
      }
    }

    fetchSymptomSummary();
  }, [courseId]);

  function handleMoveToNextStep() {
    const currentIndex = PAGE_STEPS.indexOf(currentStep);

    if (currentIndex >= PAGE_STEPS.length - 1) {
      return;
    }

    const nextStep = PAGE_STEPS[currentIndex + 1];

    if (currentStep === "intro" && nextStep === "indicator") {
      setShouldAutoAdvanceIndicator(true);
    }

    setCurrentStep(nextStep);
  }

  function handleMoveToPreviousStep() {
    const currentIndex = PAGE_STEPS.indexOf(currentStep);

    if (currentIndex <= 0) {
      return;
    }

    const previousStep = PAGE_STEPS[currentIndex - 1];

    if (previousStep === "indicator") {
      setShouldAutoAdvanceIndicator(false);
    }

    setCurrentStep(previousStep);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartY.current = event.touches[0].clientY;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartY.current === null) {
      return;
    }

    const touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = touchStartY.current - touchEndY;

    if (swipeDistance >= 50) {
      handleMoveToNextStep();
    }

    if (swipeDistance <= -50) {
      handleMoveToPreviousStep();
    }

    touchStartY.current = null;
  }

  function handleSelectRoutine(routineId: RoutineId) {
    setSelectedRoutine(routineId);
  }

  async function handleStartDailyCourse() {
    if (!selectedRoutine || isStartingDailyCourse) {
      return;
    }

    try {
      setIsStartingDailyCourse(true);

      const routineTypeCode = ROUTINE_TYPE_CODE_MAP[selectedRoutine];

      const course = await courseApi.startCourse({
        courseType: "DAILY",
        routineTypeCode,
      });

      console.log("데일리 코스 시작 성공:", course);

      navigate("/care/finish_select_routine");
    } catch (error) {
      console.error("데일리 코스 시작 실패:", error);

      if (axios.isAxiosError(error)) {
        console.error("HTTP Status:", error.response?.status);
        console.error("API Error Response:", error.response?.data);
        console.error("요청 URL:", error.config?.url);
      }
    } finally {
      setIsStartingDailyCourse(false);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleMoveToNextStep();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        handleMoveToNextStep();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        handleMoveToPreviousStep();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStep]);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey) {
        return;
      }

      if (Math.abs(event.deltaY) < 15) {
        return;
      }

      if (currentStep === "routine") {
        const routineScreen = routineScreenRef.current;

        if (!routineScreen) {
          return;
        }

        const isAtTop = routineScreen.scrollTop <= 0;

        if (event.deltaY < 0 && isAtTop) {
          if (isWheelLocked.current) {
            return;
          }

          isWheelLocked.current = true;

          handleMoveToPreviousStep();

          window.setTimeout(() => {
            isWheelLocked.current = false;
          }, 700);
        }

        return;
      }

      if (isWheelLocked.current) {
        return;
      }

      isWheelLocked.current = true;

      if (event.deltaY > 0) {
        handleMoveToNextStep();
      } else {
        handleMoveToPreviousStep();
      }

      window.setTimeout(() => {
        isWheelLocked.current = false;
      }, 700);
    }

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== "indicator" || !shouldAutoAdvanceIndicator) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep("concern");
      setShouldAutoAdvanceIndicator(false);
    }, 1900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentStep, shouldAutoAdvanceIndicator]);

  return (
    <S.Page onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {(currentStep === "intro" || currentStep === "indicator") && (
        <S.FullScreenSection>
          <S.CompletionArea>
            {currentStep === "intro" && <FocusConfetti />}

            <S.IntroTextArea $showIndicator={currentStep === "indicator"}>
              <S.CompleteText>
                축하합니다! 피부 회복이 완료되었어요.
              </S.CompleteText>

              <S.MainTitle>
                이제 데일리 코스와 함께
                <br />
                좋은 피부를 오래 유지해볼까요?
              </S.MainTitle>

              {currentStep === "indicator" && (
                <S.IndicatorContainer $isVisible>
                  <S.IndicatorDot $type="tertiary" />
                  <S.IndicatorDot $type="secondary" />
                  <S.IndicatorDot $type="primary" />
                </S.IndicatorContainer>
              )}
            </S.IntroTextArea>
          </S.CompletionArea>
        </S.FullScreenSection>
      )}

      {currentStep === "concern" && (
        <S.FullScreenSection>
          <S.ConcernContent>
            <S.SectionTitle>
              7일 동안 가장 많이 신경 쓴 피부 고민
            </S.SectionTitle>

            <S.SectionDescription>
              {primaryConcerns.length >= 2
                ? `데일리 코스에서 ${primaryConcerns[0]}와 ${primaryConcerns[1]}를 좀 더 케어해볼까요?`
                : primaryConcerns.length === 1
                ? `데일리 코스에서 ${primaryConcerns[0]}를 좀 더 케어해볼까요?`
                : "최근 피부 기록을 바탕으로 데일리 케어를 시작해볼까요?"}
            </S.SectionDescription>

            <S.ConcernArea>
              {primaryConcerns.length > 0 && (
                <S.PrimaryConcernList>
                  {primaryConcerns.map((concern) => (
                    <S.PrimaryConcernChip key={concern}>
                      {concern}
                    </S.PrimaryConcernChip>
                  ))}
                </S.PrimaryConcernList>
              )}

              <S.SecondaryConcernList>
                {secondaryConcerns.map((concern) => (
                  <S.SecondaryConcernChip key={concern}>
                    {concern}
                  </S.SecondaryConcernChip>
                ))}
              </S.SecondaryConcernList>
            </S.ConcernArea>
          </S.ConcernContent>
        </S.FullScreenSection>
      )}

      {currentStep === "routine" && (
        <S.RoutineScreen ref={routineScreenRef}>
          <S.RoutineContent>
            <S.RoutineHeader>
              <S.SectionTitle>어떤 관리에 집중하고 싶으세요?</S.SectionTitle>

              <S.SectionDescription>
                지금 가장 신경 쓰이는 피부 고민에 맞춰 루틴을 선택해 주세요
                <br />
                선택한 루틴은 언제든 변경할 수 있어요
              </S.SectionDescription>
            </S.RoutineHeader>

            <S.RoutineList>
              {ROUTINE_OPTIONS.map((routine) => {
                const isRecommended = recommendedRoutineId === routine.id;

                return (
                  <S.RoutineCardWrapper key={routine.id}>
                    {isRecommended && (
                      <S.RecommendedBadge>
                        {recommendedBadgeText}
                      </S.RecommendedBadge>
                    )}

                    <RoutineCard
                      id={routine.id}
                      title={routine.title}
                      description={routine.description}
                      tags={routine.tags}
                      iconSrc={routine.iconSrc}
                      isSelected={selectedRoutine === routine.id}
                      onClick={() => handleSelectRoutine(routine.id)}
                    />
                  </S.RoutineCardWrapper>
                );
              })}
            </S.RoutineList>

            <S.ButtonWrapper>
              <CareButton
                variant="black"
                disabled={!isRoutineSelected || isStartingDailyCourse}
                onClick={handleStartDailyCourse}
              >
                나의 데일리 코스 시작하기
              </CareButton>
            </S.ButtonWrapper>
          </S.RoutineContent>
        </S.RoutineScreen>
      )}
    </S.Page>
  );
}
