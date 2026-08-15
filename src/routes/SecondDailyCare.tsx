import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import AnalysisLoading from "../components/FocusCare/AnalysisLoading";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineBottomSheet from "../components/FocusCare/RoutineBottomSheet";

import type { DiagnosisResponse } from "../api/diagnosis";

import * as S from "../styles/DailyCare/SecondDailyCare.styles";

interface SecondDailyCareLocationState {
  diagnosis: DiagnosisResponse;
  selectedConditions: string[];
}

export default function SecondDailyCare() {
  const location = useLocation();

  const state = location.state as SecondDailyCareLocationState | null;

  const diagnosis = state?.diagnosis;
  const selectedConditions = state?.selectedConditions ?? [];

  const [isRoutineSheetVisible, setIsRoutineSheetVisible] = useState(false);

  const handleAnalysisComplete = useCallback(() => {
    setIsRoutineSheetVisible(true);
  }, []);

  const formattedDate = useMemo(() => {
    const today = new Date();

    return `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;
  }, []);

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Main>
        <FocusProgress currentStep={2} variant="daily" />

        <S.Content>
          <S.AnalysisCard>
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
                  {diagnosis?.summaryText ?? ""}
                </S.SummaryDescription>
              </S.SummaryArea>
            </S.AnalysisContent>
          </S.AnalysisCard>

          <AnalysisLoading
            variant="daily"
            onComplete={handleAnalysisComplete}
          />
        </S.Content>
      </S.Main>

      {isRoutineSheetVisible && diagnosis && (
        <RoutineBottomSheet
          variant="daily"
          difficultyOptions={diagnosis.difficultyOptions}
          routineId={diagnosis.routineId}
        />
      )}
    </S.Page>
  );
}
