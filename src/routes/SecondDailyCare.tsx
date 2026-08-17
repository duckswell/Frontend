// SecondDailyCare.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import type { RoutineTypeCode } from "../api/course";
import type { DiagnosisResponse } from "../api/diagnosis";

import { NavBar } from "../components/NavBar";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineBottomSheet from "../components/FocusCare/RoutineBottomSheet";

import * as S from "../styles/DailyCare/SecondDailyCare.styles";

interface SecondDailyCareLocationState {
  diagnosis: DiagnosisResponse;
  selectedConditions: string[];
  routineTypeCode?: RoutineTypeCode;
}

export default function SecondDailyCare() {
  const location = useLocation();

  const state = location.state as SecondDailyCareLocationState | null;

  const diagnosis = state?.diagnosis ?? null;

  const selectedConditions = state?.selectedConditions ?? [];

  const routineTypeCode = state?.routineTypeCode;

  const formattedDate = useMemo(() => {
    const today = new Date();

    return `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;
  }, []);
  const analysisCardRef = useRef<HTMLElement | null>(null);
  const [sheetTopOffset, setSheetTopOffset] = useState(0);

  useEffect(() => {
    const updateSheetTopOffset = () => {
      if (!analysisCardRef.current) {
        return;
      }

      const rect = analysisCardRef.current.getBoundingClientRect();

      setSheetTopOffset(rect.bottom + 20);
    };

    updateSheetTopOffset();

    window.addEventListener("resize", updateSheetTopOffset);

    return () => {
      window.removeEventListener("resize", updateSheetTopOffset);
    };
  }, [diagnosis]);
  if (!diagnosis) {
    console.error("SecondDailyCare에 전달된 diagnosis가 없습니다.");

    return null;
  }

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Main>
        <FocusProgress currentStep={2} variant="daily" />

        <S.Content>
          <S.AnalysisCard ref={analysisCardRef}>
            <S.AnalysisHeader>
              <S.AnalysisTitle>오늘의 피부 분석</S.AnalysisTitle>

              <S.DateBadge>{formattedDate}</S.DateBadge>
            </S.AnalysisHeader>

            <S.Divider />

            <S.AnalysisContent>
              <S.StatusTitle>오늘 확인한 피부 상태</S.StatusTitle>

              <S.ConditionList>
                {selectedConditions.map((condition) => (
                  <S.ConditionBadge key={condition}>
                    {condition}
                  </S.ConditionBadge>
                ))}
              </S.ConditionList>

              <S.SummaryArea>
                <S.SummaryTitle>분석 요약</S.SummaryTitle>

                <S.SummaryDescription>
                  {diagnosis.summaryText}
                </S.SummaryDescription>
              </S.SummaryArea>
            </S.AnalysisContent>
          </S.AnalysisCard>
        </S.Content>
      </S.Main>

      <RoutineBottomSheet
        variant="daily"
        difficultyOptions={diagnosis.difficultyOptions}
        routineId={diagnosis.routineId}
        routineTypeCode={routineTypeCode}
        topOffset={sheetTopOffset}
      />
    </S.Page>
  );
}
