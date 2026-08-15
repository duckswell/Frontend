import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import CareButton from "../CareButton";
import RoutineOptionCard from "./RoutineOptionCard";

import type { Difficulty, DifficultyOption } from "../../api/diagnosis";
import { routineApi } from "../../api/routine";

import * as S from "../../styles/FocusCare/RoutineBottomSheet.styles";

interface RoutineBottomSheetProps {
  variant?: "focus" | "daily";
  difficultyOptions: DifficultyOption[];
  routineId: number;
}

export default function RoutineBottomSheet({
  variant = "focus",
  difficultyOptions,
  routineId,
}: RoutineBottomSheetProps) {
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(true);

  const [selectedRoutine, setSelectedRoutine] = useState<Difficulty | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelectRoutine = (difficulty: Difficulty) => {
    setSelectedRoutine(difficulty);
  };

  async function handleMoveToNextCare() {
    if (!selectedRoutine || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const routine = await routineApi.selectDifficulty(
        routineId,
        selectedRoutine
      );

      console.log("루틴 난이도 선택 성공:", routine);

      if (variant === "daily") {
        navigate("/care/third_daily_care", {
          state: {
            routine,
          },
        });

        return;
      }

      navigate("/care/third_focus_care", {
        state: {
          routine,
        },
      });
    } catch (error) {
      console.error("루틴 난이도 선택 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          {difficultyOptions.map((option) => (
            <RoutineOptionCard
              key={option.difficulty}
              title={option.title}
              time={`약 ${option.estimatedMinutes}분`}
              description={option.subtitle}
              steps={option.stepPreview}
              selected={selectedRoutine === option.difficulty}
              variant={variant}
              onClick={() => handleSelectRoutine(option.difficulty)}
            />
          ))}
        </S.OptionList>

        <S.ButtonArea>
          <CareButton
            variant={variant}
            disabled={!isRoutineSelected || isSubmitting}
            onClick={handleMoveToNextCare}
          >
            {variant === "daily" ? "루틴 시작하기" : "선택한 루틴 시작하기"}
          </CareButton>
        </S.ButtonArea>
      </S.SheetContent>
    </S.BottomSheet>
  );
}
