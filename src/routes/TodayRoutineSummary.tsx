import { useNavigate } from "react-router-dom";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection from "../components/FocusCare/RecommendedProductSection";

import { colorPalette } from "../lib/colorPalette";
import * as S from "../styles/DailyCare/TodayRoutineSummary.styles";

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["히알루론산"],
  },
  {
    id: 2,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["히알루론산"],
  },
  {
    id: 3,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["히알루론산"],
  },
];

export default function TodayRoutineSummary() {
  const navigate = useNavigate();

  function handleMoveToHome() {
    navigate("/");
  }

  return (
    <S.Page>
      <S.Content>
        <S.ConfettiArea>
          <FocusConfetti />

          <S.TitleArea>
            <S.Title>
              오늘의 클리어업 루틴을
              <br />
              모두 마쳤어요!
            </S.Title>
          </S.TitleArea>
        </S.ConfettiArea>

        <S.RoutineRecordCard>
          <S.RecordTitle>오늘의 루틴 기록</S.RecordTitle>

          <S.RecordDescription>
            오늘도 칙칙함과 피부 흔적을 관리하는 루틴을 실천했어요.
            <br />
            꾸준히 이어가며 피부 변화를 기록해 보세요.
          </S.RecordDescription>

          <S.RecordNotice>
            * 이 안내는 관리 목적 참고 정보이며 의료 진단을 대체하지 않아요
          </S.RecordNotice>
        </S.RoutineRecordCard>

        <S.ProductSection>
          <RecommendedProductSection
            title="클리어업 루틴 추천 제품"
            products={RECOMMENDED_PRODUCTS}
          />
        </S.ProductSection>

        <S.ButtonArea>
          <CareButton
            onClick={handleMoveToHome}
            backgroundColor={colorPalette.Black}
            textColor={colorPalette.White}
          >
            홈으로
          </CareButton>
        </S.ButtonArea>
      </S.Content>
    </S.Page>
  );
}
