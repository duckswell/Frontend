import { useLocation, useNavigate } from "react-router-dom";

import type { RoutineCompletionData } from "../api/routine";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection, {
  type Product,
} from "../components/FocusCare/RecommendedProductSection";
import RoutineRecordCard from "../components/FocusCare/RoutineRecordCard";

import * as S from "../styles/FocusCare/FinishRoutine.styles";

interface FinishRoutineLocationState {
  courseId: number;
  routineId: number;
  completionData: RoutineCompletionData;
  recommendedProducts: Product[];
}

export default function FinishRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishRoutineLocationState | null;

  console.log("FinishRoutine state:", state);

  const completionData = state?.completionData;
  const recommendedProducts = state?.recommendedProducts ?? [];

  function handleMoveToHome() {
    navigate("/");
  }
  function handleMoveToDaily() {
    navigate("/preview");
  }

  return (
    <S.Page>
      <S.Content>
        <S.CompletionSection>
          <FocusConfetti />

          <S.CompletionTitle>
            오늘의 루틴을
            <br />
            모두 마쳤어요!
          </S.CompletionTitle>
        </S.CompletionSection>

        <S.InformationSection>
          <RoutineRecordCard
            completionSummaryText={
              completionData?.completionSummaryText ??
              "오늘의 루틴을 완료했어요."
            }
            ingredients={completionData?.recommendedIngredients ?? []}
          />

          <S.DailyCard type="button" onClick={handleMoveToDaily}>
            <S.DailyImage
              src="/assets/Home_Daily.png"
              alt=""
              aria-hidden="true"
            />

            <S.DailyTextArea>
              <S.DailyDescription>
                집중 코스가 끝나면 데일리로 이어가요
              </S.DailyDescription>

              <S.DailyTitle>데일리 코스 살펴보기</S.DailyTitle>
            </S.DailyTextArea>

            <S.GotoIcon src="/assets/Goto.svg" alt="" aria-hidden="true" />
          </S.DailyCard>
        </S.InformationSection>

        <RecommendedProductSection
          title="오늘의 추천 성분 제품"
          products={recommendedProducts}
        />

        <S.ButtonWrapper>
          <CareButton variant="black" onClick={handleMoveToHome}>
            홈으로
          </CareButton>
        </S.ButtonWrapper>
      </S.Content>
    </S.Page>
  );
}
