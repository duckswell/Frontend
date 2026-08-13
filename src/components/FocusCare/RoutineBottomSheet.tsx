import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import CareButton from "../CareButton";
import RoutineOptionCard from "./RoutineOptionCard";

import * as S from "../../styles/FocusCare/RoutineBottomSheet.styles";

type RoutineLevel = "light" | "basic" | "full";

interface RoutineBottomSheetProps {
  variant?: "focus" | "daily";
}

const ROUTINE_OPTIONS = [
  {
    id: "light" as const,
    focusTitle: "가벼운 루틴",
    dailyTitle: "가벼운 관리",
    time: "약 5분",
    description: "꼭 필요한 단계만 빠르게",
    steps: "예) 진정 클렌징 → 토너 → 진정 세럼 → 크림",
  },
  {
    id: "basic" as const,
    focusTitle: "기본 루틴",
    dailyTitle: "기본 관리",
    time: "약 10분",
    description: "피부 상태에 필요한 관리를 균형 있게",
    steps: "예) 진정 클렌징 → 토너 → 추천 세럼 → 마스크팩 → 크림",
  },
  {
    id: "full" as const,
    focusTitle: "꼼꼼한 루틴",
    dailyTitle: "꼼꼼한 관리",
    time: "약 15분",
    description: "오늘 추천된 관리 단계를 빠짐없이",
    steps: "예) 진정 클렌징 → 토너 → 추천 세럼 → 마스크팩 → 크림 → 추가 관리",
  },
];

export default function RoutineBottomSheet({
  variant = "focus",
}: RoutineBottomSheetProps) {
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineLevel | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState(0);

  const isRoutineSelected = selectedRoutine !== null;

  const startYRef = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    startYRef.current = event.clientY;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (startYRef.current === null) {
      return;
    }

    const moveY = event.clientY - startYRef.current;

    setDragOffset(moveY);
  };

  const handlePointerUp = () => {
    if (isExpanded && dragOffset > 80) {
      setIsExpanded(false);
    }

    if (!isExpanded && dragOffset < -30) {
      setIsExpanded(true);
    }

    startYRef.current = null;
    setDragOffset(0);
  };

  const handleSelectRoutine = (routine: RoutineLevel) => {
    setSelectedRoutine(routine);
  };

  function handleMoveToNextCare() {
    if (!selectedRoutine) {
      return;
    }

    if (variant === "daily") {
      navigate("/care/third_daily_care");

      return;
    }

    navigate("/care/third_focus_care");
  }

  return (
    <S.BottomSheet $expanded={isExpanded} $dragOffset={dragOffset}>
      <S.DragArea
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <S.Handle />
      </S.DragArea>

      <S.SheetContent $expanded={isExpanded}>
        <S.HeaderArea>
          <S.Title>오늘의 관리 강도를 선택해 주세요</S.Title>

          <S.Description>
            선택한 강도에 따라 관리 단계와 소요 시간이 달라져요
          </S.Description>
        </S.HeaderArea>

        <S.OptionList>
          {ROUTINE_OPTIONS.map((routine) => (
            <RoutineOptionCard
              key={routine.id}
              title={
                variant === "daily" ? routine.dailyTitle : routine.focusTitle
              }
              time={routine.time}
              description={routine.description}
              steps={routine.steps}
              selected={selectedRoutine === routine.id}
              variant={variant}
              onClick={() => handleSelectRoutine(routine.id)}
            />
          ))}
        </S.OptionList>

        <S.ButtonArea>
          <CareButton
            variant={variant}
            disabled={!isRoutineSelected}
            onClick={handleMoveToNextCare}
          >
            {variant === "daily" ? "루틴 시작하기" : "선택한 루틴 시작하기"}
          </CareButton>
        </S.ButtonArea>
      </S.SheetContent>
    </S.BottomSheet>
  );
}
