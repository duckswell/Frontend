import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import AnalysisLoading from "../components/FocusCare/AnalysisLoading";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineBottomSheet from "../components/FocusCare/RoutineBottomSheet";

import type { DiagnosisResponse } from "../api/diagnosis";

import * as S from "../styles/FocusCare/SecondFocusCare.styles";

interface SecondFocusCareLocationState {
  diagnosis: DiagnosisResponse;
  selectedConditions: string[];
  skinImage?: File;
}

export default function SecondFocusCare() {
  const location = useLocation();

  const state = location.state as SecondFocusCareLocationState | null;

  const diagnosis = state?.diagnosis;
  const selectedConditions = state?.selectedConditions ?? [];
  const skinImage = state?.skinImage;

  const [isRoutineSheetVisible, setIsRoutineSheetVisible] = useState(false);

  const imageUrl = useMemo(() => {
    if (!(skinImage instanceof File)) {
      return "";
    }

    return URL.createObjectURL(skinImage);
  }, [skinImage]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleAnalysisComplete = useCallback(() => {
    setIsRoutineSheetVisible(true);
  }, []);

  const today = new Date();

  const formattedDate = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일`;

  return (
    <S.Page>
      <NavBar title="집중 코스" />

      <S.Main>
        <FocusProgress currentStep={2} />

        <S.Content>
          <S.AnalysisCard>
            <S.AnalysisHeader>
              <S.AnalysisTitle>AI 피부 분석 결과</S.AnalysisTitle>

              <S.DateBadge>{formattedDate}</S.DateBadge>
            </S.AnalysisHeader>

            <S.Divider />

            <S.AnalysisContent>
              <S.StatusTitle>오늘 확인한 피부 상태</S.StatusTitle>

              {imageUrl ? (
                <S.AnalysisImage src={imageUrl} alt="오늘 촬영한 피부 사진" />
              ) : (
                <S.PhotoPlaceholder />
              )}

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

          <AnalysisLoading onComplete={handleAnalysisComplete} />
        </S.Content>
      </S.Main>

      {isRoutineSheetVisible && diagnosis && (
        <RoutineBottomSheet
          difficultyOptions={diagnosis.difficultyOptions}
          routineId={diagnosis.routineId}
        />
      )}
    </S.Page>
  );
}
