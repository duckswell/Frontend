import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { diagnosisApi, type DiagnosisResponse } from "../api/diagnosis";

import { NavBar } from "../components/NavBar";
import AnalysisLoading from "../components/FocusCare/AnalysisLoading";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineBottomSheet from "../components/FocusCare/RoutineBottomSheet";

import * as S from "../styles/FocusCare/SecondFocusCare.styles";

type DiagnosisRequest = Parameters<typeof diagnosisApi.createDiagnosis>[0];

interface SecondFocusCareLocationState {
  diagnosisRequest: DiagnosisRequest;
  selectedConditions: string[];
  skinImage?: File;
}

export default function SecondFocusCare() {
  const location = useLocation();

  const state = location.state as SecondFocusCareLocationState | null;

  const diagnosisRequest = state?.diagnosisRequest;
  const selectedConditions = state?.selectedConditions ?? [];
  const skinImage = state?.skinImage;

  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);

  const [isRoutineSheetVisible, setIsRoutineSheetVisible] = useState(false);

  /*
   * React StrictMode 등으로 useEffect가 중복 실행되어
   * 진단 API가 두 번 호출되는 것을 방지
   */
  const hasRequestedDiagnosis = useRef(false);

  useEffect(() => {
    if (!diagnosisRequest) {
      console.error("집중 진단 요청에 필요한 diagnosisRequest가 없습니다.");
      return;
    }

    if (hasRequestedDiagnosis.current) {
      return;
    }

    hasRequestedDiagnosis.current = true;

    const request = diagnosisRequest;

    async function createDiagnosis() {
      try {
        console.log("===== SecondFocusCare AI 진단 시작 =====");
        console.log("진단 요청 body:", request);

        const response = await diagnosisApi.createDiagnosis(request);

        console.log("집중 코스 AI 진단 완료:", response);

        setDiagnosis(response);
      } catch (error) {
        console.error("집중 코스 AI 진단 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);
          console.error("API Error Response:", error.response?.data);
          console.error("요청 URL:", error.config?.url);
          console.error("보낸 요청 데이터:", error.config?.data);
        }
      }
    }

    createDiagnosis();
  }, [diagnosisRequest]);

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

  /*
   * AnalysisLoading 숫자가 실제 100%가 된 뒤
   * 바텀시트를 표시
   */
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

          <AnalysisLoading
            isComplete={diagnosis !== null}
            onComplete={handleAnalysisComplete}
          />
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
