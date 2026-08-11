import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import { RoutineCard } from "../components/DailycoursePreview/RoutineCard";

import { colorPalette } from "../lib/colorPalette";

import * as S from "../styles/FocusCare/FinishFocusCare.styles";

type PageStep = "intro" | "indicator" | "concern" | "routine";

type SkinConcern =
  | "따가움"
  | "건조함"
  | "번들거림"
  | "각질"
  | "붓기"
  | "트러블"
  | "가려움"
  | "붉은기"
  | "열감";

type RoutineId = "calm" | "clear" | "sebum" | "moisture";

interface RoutineOption {
  id: RoutineId;
  title: string;
  description: string;
  tags: string[];
  iconSrc: string;
}

const PAGE_STEPS: PageStep[] = ["intro", "indicator", "concern", "routine"];

const SKIN_CONCERNS: SkinConcern[] = [
  "따가움",
  "건조함",
  "번들거림",
  "가려움",
  "각질",
  "붓기",
];

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

  const [currentStep, setCurrentStep] = useState<PageStep>("intro");

  const PRIMARY_CONCERNS: SkinConcern[] = ["붉은기", "열감"];

  const SECONDARY_CONCERNS = SKIN_CONCERNS.filter(
    (concern) => !PRIMARY_CONCERNS.includes(concern)
  );

  const [selectedRoutine, setSelectedRoutine] = useState<RoutineId | null>(
    null
  );
  const isRoutineSelected = selectedRoutine !== null;
  const [shouldAutoAdvanceIndicator, setShouldAutoAdvanceIndicator] =
    useState(false);

  const touchStartY = useRef<number | null>(null);
  const isWheelLocked = useRef(false);
  const routineScreenRef = useRef<HTMLElement | null>(null);

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
  function handleStartDailyCourse() {
    if (!selectedRoutine) {
      return;
    }

    navigate("/care/finish_select_routine");
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
              데일리 코스에서 {PRIMARY_CONCERNS[0]}와 {PRIMARY_CONCERNS[1]}를 좀
              더 케어해볼까요?
            </S.SectionDescription>

            <S.ConcernArea>
              <S.PrimaryConcernList>
                {PRIMARY_CONCERNS.map((concern) => (
                  <S.PrimaryConcernChip key={concern}>
                    {concern}
                  </S.PrimaryConcernChip>
                ))}
              </S.PrimaryConcernList>

              <S.SecondaryConcernList>
                {SECONDARY_CONCERNS.map((concern) => (
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
              {ROUTINE_OPTIONS.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  id={routine.id}
                  title={routine.title}
                  description={routine.description}
                  tags={routine.tags}
                  iconSrc={routine.iconSrc}
                  isSelected={selectedRoutine === routine.id}
                  onClick={() => handleSelectRoutine(routine.id)}
                />
              ))}
            </S.RoutineList>

            <S.ButtonWrapper>
              <CareButton
                disabled={!isRoutineSelected}
                backgroundColor={
                  isRoutineSelected
                    ? colorPalette.BlackSelected
                    : colorPalette.White
                }
                textColor={
                  isRoutineSelected ? colorPalette.White : colorPalette.Tertiary
                }
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
