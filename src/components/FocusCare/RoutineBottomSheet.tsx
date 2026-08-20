import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { RoutineTypeCode } from "../../api/course";
import type { Difficulty, DifficultyOption } from "../../api/diagnosis";
import { routineApi } from "../../api/routine";

import CareButton from "../CareButton";
import RoutineOptionCard from "./RoutineOptionCard";

import * as S from "../../styles/FocusCare/RoutineBottomSheet.styles";

interface RoutineBottomSheetProps {
  variant?: "focus" | "daily";
  difficultyOptions: DifficultyOption[];
  routineId: number;
  routineTypeCode?: RoutineTypeCode;
  topOffset: number;
}

export default function RoutineBottomSheet({
  variant = "focus",
  difficultyOptions,
  routineId,
  routineTypeCode,
  topOffset,
}: RoutineBottomSheetProps) {
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);

  const [selectedRoutine, setSelectedRoutine] = useState<Difficulty | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dragOffset, setDragOffset] = useState(0);

  const [collapsedOffset, setCollapsedOffset] = useState(0);

  const [isPositionReady, setIsPositionReady] = useState(false);

  const isRoutineSelected = selectedRoutine !== null;

  const startYRef = useRef<number | null>(null);

  const sheetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sheet = sheetRef.current;

    if (!sheet || topOffset <= 0) {
      return;
    }

    const updatePosition = () => {
      if (!sheetRef.current) {
        return;
      }

      const sheetHeight = sheetRef.current.getBoundingClientRect().height;

      const expandedTop = window.innerHeight - sheetHeight;

      const targetCollapsedTop = topOffset;

      const nextCollapsedOffset = Math.max(targetCollapsedTop - expandedTop, 0);

      setCollapsedOffset(nextCollapsedOffset);
      setIsPositionReady(true);
    };

    const frameId = window.requestAnimationFrame(updatePosition);

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    resizeObserver.observe(sheet);

    window.addEventListener("resize", updatePosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
    };
  }, [topOffset, difficultyOptions]);

  const handlePointerDown = (event: React.PointerEvent) => {
    startYRef.current = event.clientY;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (startYRef.current === null) {
      return;
    }

    const moveY = event.clientY - startYRef.current;

    const dampedMoveY = moveY * 0.82;

    if (!isExpanded) {
      const maxUpwardDistance = -collapsedOffset;

      setDragOffset(Math.max(Math.min(dampedMoveY, 0), maxUpwardDistance));

      return;
    }

    setDragOffset(Math.min(Math.max(dampedMoveY, 0), collapsedOffset));
  };

  const handlePointerUp = () => {
    if (startYRef.current === null) {
      return;
    }

    const openThreshold = Math.min(collapsedOffset * 0.18, 55);

    const closeThreshold = Math.min(collapsedOffset * 0.18, 55);

    if (!isExpanded && Math.abs(dragOffset) >= openThreshold) {
      setIsExpanded(true);
    }

    if (isExpanded && dragOffset >= closeThreshold) {
      setIsExpanded(false);
    }

    startYRef.current = null;
    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    startYRef.current = null;
    setDragOffset(0);
  };

  const handleSelectRoutine = (difficulty: Difficulty) => {
    setSelectedRoutine(difficulty);
  };

  const handleMoveToNextCare = async () => {
    if (!selectedRoutine || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      console.log("===== 난이도 선택 요청 =====");
      console.log("variant:", variant);
      console.log("routineId:", routineId);
      console.log("selectedRoutine:", selectedRoutine);

      const routine = await routineApi.selectDifficulty(
        routineId,
        selectedRoutine
      );

      console.log("루틴 난이도 선택 성공:", routine);

      if (variant === "daily") {
        navigate("/care/third_daily_care", {
          state: {
            routine,
            routineTypeCode,
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

      if (axios.isAxiosError(error)) {
        console.error("status:", error.response?.status);
        console.error("response data:", error.response?.data);
        console.error("요청 URL:", error.config?.url);
        console.error("routineId:", routineId);
        console.error("selectedRoutine:", selectedRoutine);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.BottomSheet
      ref={sheetRef}
      $expanded={isExpanded}
      $dragOffset={dragOffset}
      $collapsedOffset={collapsedOffset}
      $isPositionReady={isPositionReady}
    >
      <S.DragArea
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <S.Handle />
      </S.DragArea>

      <S.SheetContent>
        <S.HeaderArea>
          <S.Title>오늘의 관리 강도를 선택해 주세요</S.Title>

          <S.Description>
            선택한 강도에 따라 관리 단계와 소요 시간이 달라져요
          </S.Description>
        </S.HeaderArea>

        <S.ScrollArea>
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
        </S.ScrollArea>
      </S.SheetContent>
    </S.BottomSheet>
  );
}
