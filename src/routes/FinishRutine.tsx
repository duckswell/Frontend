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

  /*
   * ThirdFocusCare에서 조회한 추천 제품
   *
   * 중요:
   * FinishRoutine에서 추천 API를 다시 호출하지 않고
   * ThirdFocusCare의 결과를 그대로 사용한다.
   */
  recommendedProducts?: Product[];
}

export default function FinishRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishRoutineLocationState | null;

  const completionData = state?.completionData;

  /*
   * ThirdFocusCare에서 전달받은 추천 제품을 그대로 사용한다.
   *
   * 이렇게 해야 ThirdFocusCare에서 나온 추천 성분과
   * 제품 추천 페이지의 성분 카드가 동일하게 유지된다.
   */
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
