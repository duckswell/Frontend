import { useLocation, useNavigate } from "react-router-dom";

import type { RoutineTypeCode } from "../api/course";

import type { RoutineCompletionData } from "../api/routine";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";

import RecommendedProductSection, {
  type Product,
} from "../components/FocusCare/RecommendedProductSection";

import * as S from "../styles/DailyCare/TodayRoutineSummary.styles";

interface TodayRoutineSummaryLocationState {
  routineId: number;
  routineTypeCode?: RoutineTypeCode;
  completionData: RoutineCompletionData;
  recommendedProducts: Product[];
}

const ROUTINE_TITLE_MAP: Record<RoutineTypeCode, string> = {
  COOLDOWN: "쿨다운",
  CLEAR_UP: "클리어업",
  SEBUM_CONTROL: "피지컨트롤",
  HYDRATION: "수분충전",
};

export default function TodayRoutineSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as TodayRoutineSummaryLocationState | null;

  const routineTitle = state?.routineTypeCode
    ? ROUTINE_TITLE_MAP[state.routineTypeCode]
    : "데일리";

  const completionSummaryText =
    state?.completionData?.completionSummaryText ??
    "오늘의 데일리 루틴을 완료했어요.";

  const recommendedProducts = state?.recommendedProducts ?? [];

  function handleMoveToHome() {
    navigate("/");
  }

  return (
    <S.Page>
      <S.Content>
        <S.CompletionSection>
          <FocusConfetti />

          <S.Title>
            오늘의 {routineTitle} 루틴을
            <br />
            모두 마쳤어요!
          </S.Title>
        </S.CompletionSection>

        <S.RoutineRecordCard>
          <S.RecordTitle>오늘의 루틴 기록</S.RecordTitle>

          <S.RecordDescription>{completionSummaryText}</S.RecordDescription>

          <S.RecordNotice>
            * 이 안내는 관리 목적 참고 정보이며 의료 진단을 대체하지 않아요
          </S.RecordNotice>
        </S.RoutineRecordCard>

        <S.ProductSection>
          <RecommendedProductSection
            title={`${routineTitle} 루틴 추천 제품`}
            products={recommendedProducts}
          />
        </S.ProductSection>

        <S.ButtonArea>
          <CareButton onClick={handleMoveToHome} variant="black">
            홈으로
          </CareButton>
        </S.ButtonArea>
      </S.Content>
    </S.Page>
  );
}
