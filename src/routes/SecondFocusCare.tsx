import { useCallback, useState } from "react";

import { NavBar } from "../components/NavBar";
import AnalysisLoading from "../components/FocusCare/AnalysisLoading";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineBottomSheet from "../components/FocusCare/RoutineBottomSheet";

import * as S from "../styles/FocusCare/SecondFocusCare.styles";

const SKIN_CONDITIONS = ["열감", "따가움", "건조함"];

export default function SecondFocusCare() {
  const [isRoutineSheetVisible, setIsRoutineSheetVisible] = useState(false);

  const handleAnalysisComplete = useCallback(() => {
    setIsRoutineSheetVisible(true);
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

              <S.DateBadge>2026년 8월 31일</S.DateBadge>
            </S.AnalysisHeader>

            <S.Divider />

            <S.AnalysisContent>
              <S.StatusTitle>오늘 확인한 피부 상태</S.StatusTitle>

              <S.PhotoPlaceholder />

              <S.ConditionList>
                {SKIN_CONDITIONS.map((condition) => (
                  <S.ConditionBadge key={condition}>
                    {condition}
                  </S.ConditionBadge>
                ))}
              </S.ConditionList>

              <S.SummaryArea>
                <S.SummaryTitle>분석 요약</S.SummaryTitle>

                <S.SummaryDescription>
                  붉은기는 어제보다 줄었지만, 각질이 여전히 많이 남아 있어요
                </S.SummaryDescription>
              </S.SummaryArea>
            </S.AnalysisContent>
          </S.AnalysisCard>

          <AnalysisLoading onComplete={handleAnalysisComplete} />
        </S.Content>
      </S.Main>

      {isRoutineSheetVisible && <RoutineBottomSheet />}
    </S.Page>
  );
}
