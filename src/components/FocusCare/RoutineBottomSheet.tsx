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

  /*
   * false
   * → 분석 결과 카드 아래 20px 위치
   *
   * true
   * → 내용 전체가 보이는 위치
   */
  const [isExpanded, setIsExpanded] = useState(false);

  const [selectedRoutine, setSelectedRoutine] = useState<Difficulty | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * 사용자가 현재 드래그하고 있는 거리
   */
  const [dragOffset, setDragOffset] = useState(0);

  /*
   * 접힌 상태에서 바텀시트가 아래로 내려가 있어야 하는 거리
   */
  const [collapsedOffset, setCollapsedOffset] = useState(0);

  /*
   * 최초 위치 계산이 끝났는지 여부
   */
  const [isPositionReady, setIsPositionReady] = useState(false);

  const isRoutineSelected = selectedRoutine !== null;

  const startYRef = useRef<number | null>(null);

  const sheetRef = useRef<HTMLElement | null>(null);

  /*
   * 실제 바텀시트 높이를 측정해서
   *
   * 펼친 위치
   * ↕
   * 분석 카드 아래 20px 위치
   *
   * 사이의 정확한 이동 거리를 계산한다.
   */
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

      /*
       * 바텀시트는 bottom: 0이므로
       * translate가 0일 때의 상단 위치
       */
      const expandedTop = window.innerHeight - sheetHeight;

      /*
       * 접힌 상태에서 원하는 상단 위치
       *
       * Second 페이지에서 이미
       * 분석 카드 bottom + 20px을 topOffset으로 전달하고 있음
       */
      const targetCollapsedTop = topOffset;

      /*
       * 펼친 위치에서 얼마나 아래로 내려가야
       * targetCollapsedTop에 도달하는지 계산
       */
      const nextCollapsedOffset = Math.max(targetCollapsedTop - expandedTop, 0);

      setCollapsedOffset(nextCollapsedOffset);
      setIsPositionReady(true);
    };

    /*
     * DOM 배치가 끝난 뒤 정확한 높이 측정
     */
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
    /*
     * 카드 영역을 스크롤하는 게 아니라
     * DragArea를 잡았을 때만 바텀시트 드래그 시작
     */
    startYRef.current = event.clientY;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (startYRef.current === null) {
      return;
    }

    const moveY = event.clientY - startYRef.current;

    /*
     * 1:1 이동보다 아주 조금만 감쇠.
     *
     * 0.55처럼 크게 감쇠하면
     * 손을 놓았을 때 남은 이동거리가 너무 커져서
     * 갑자기 튀는 것처럼 느껴질 수 있다.
     */
    const dampedMoveY = moveY * 0.82;

    if (!isExpanded) {
      /*
       * 접힌 상태에서는 위쪽으로만 드래그 가능.
       *
       * collapsedOffset보다 더 위로 끌어도
       * 펼친 위치를 넘어가지 않도록 제한.
       */
      const maxUpwardDistance = -collapsedOffset;

      setDragOffset(Math.max(Math.min(dampedMoveY, 0), maxUpwardDistance));

      return;
    }

    /*
     * 펼친 상태에서는 아래쪽으로만 드래그 가능.
     *
     * 원래 접힌 위치보다 더 아래로 내려가지 않도록 제한.
     */
    setDragOffset(Math.min(Math.max(dampedMoveY, 0), collapsedOffset));
  };

  const handlePointerUp = () => {
    if (startYRef.current === null) {
      return;
    }

    /*
     * 절대 px 기준이 아니라
     * 전체 이동 가능 거리의 일부를 넘겼을 때 상태 변경.
     *
     * 화면 크기나 카드 높이가 달라도
     * 비슷한 드래그 감각을 유지할 수 있다.
     */
    const openThreshold = Math.min(collapsedOffset * 0.18, 55);

    const closeThreshold = Math.min(collapsedOffset * 0.18, 55);

    if (!isExpanded && Math.abs(dragOffset) >= openThreshold) {
      setIsExpanded(true);
    }

    if (isExpanded && dragOffset >= closeThreshold) {
      setIsExpanded(false);
    }

    /*
     * 현재 드래그 위치 → 새로운 목표 위치로
     * CSS transition이 부드럽게 이어준다.
     */
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
