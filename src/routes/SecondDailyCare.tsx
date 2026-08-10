import { useCallback, useState } from "react";
import { NavBar } from "../components/NavBar";
import AnalysisLoading from "../components/FocusCare/AnalysisLoading";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineBottomSheet from "../components/FocusCare/RoutineBottomSheet";

import * as S from "../styles/DailyCare/SecondDailyCare.styles";

const SKIN_CONDITIONS = ["열감", "따가움", "건조함"];

export default function SecondDailyCare() {
  const [isRoutineSheetVisible, setIsRoutineSheetVisible] = useState(false);

  const handleAnalysisComplete = useCallback(() => {
    setIsRoutineSheetVisible(true);
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

              <S.DateBadge>2026년 8월 31일</S.DateBadge>
            </S.AnalysisHeader>

            <S.Divider />

            <S.AnalysisContent>
              <S.StatusTitle>오늘 확인한 피부 상태</S.StatusTitle>

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
                  볼 주변에 붉은기가 조금 보이고, 일부 부위에는 건조함과 각질이
                  보여요. 자극을 줄이고 피부를 편안하게 관리해 주세요.
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

      {isRoutineSheetVisible && <RoutineBottomSheet variant="daily" />}
    </S.Page>
  );
}
