import { useNavigate } from "react-router-dom";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RoutineRecordCard from "../components/FocusCare/RoutineRecordCard";
import RecommendedProductSection from "../components/FocusCare/RecommendedProductSection";

import { colorPalette } from "../lib/colorPalette";
import * as S from "../styles/FocusCare/FinishRoutine.styles";

export default function FinishRoutine() {
  const navigate = useNavigate();

  function handleMoveToHome() {
    navigate("/");
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
            symptoms="붉은기와 건조함, 각질"
            routineName="진정·장벽 루틴"
            ingredients={["판테놀", "센텔라", "히알루론산", "세라마이드"]}
          />

          <S.DailyCard type="button">
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

            <S.GotoIcon
              src="/assets/Goto.svg"
              alt=""
              aria-hidden="true"
            />
          </S.DailyCard>
        </S.InformationSection>

        <RecommendedProductSection />

        <S.ButtonWrapper>
          <CareButton
            backgroundColor={colorPalette.Black}
            textColor={colorPalette.White}
            onClick={handleMoveToHome}
          >
            홈으로
          </CareButton>
        </S.ButtonWrapper>
      </S.Content>
    </S.Page>
  );
}