import { useNavigate } from "react-router-dom";

import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection from "../components/FocusCare/RecommendedProductSection";
import CareButton from "../components/CareButton";

import * as S from "../styles/FocusCare/FinishSelectRoutine.styles";

const ROUTINE_CATEGORIES = ["센텔라", "판테놀", "알로에"];

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["센텔라"],
  },
  {
    id: 2,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["판테놀"],
  },
  {
    id: 3,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["알로에"],
  },
];

export default function FinishSelectRoutine() {
  const navigate = useNavigate();

  function handleMoveToHome() {
    navigate("/");
  }

  return (
    <S.Page>
      <S.Content>
        <S.CompletionSection>
          <FocusConfetti />

          <S.IntroTextArea>
            <S.Title>
              내일부터 쿨다운 루틴으로
              <br />
              매일 함께해요!
            </S.Title>

            <S.Description>데일리 코스 루틴 선택을 완료했어요</S.Description>
          </S.IntroTextArea>
        </S.CompletionSection>

        <S.IntroSection>
          <S.RoutineCard>
            <S.RoutineImage
              src="/assets/Daily_cooldown.png"
              alt="쿨다운 루틴"
            />

            <S.RoutineName>쿨다운</S.RoutineName>

            <S.CategoryList>
              {ROUTINE_CATEGORIES.map((category) => (
                <S.Category key={category}>{category}</S.Category>
              ))}
            </S.CategoryList>
          </S.RoutineCard>
        </S.IntroSection>

        <S.ProductSection>
          <RecommendedProductSection
            title="이 제품들과 함께하면 좋아요"
            products={RECOMMENDED_PRODUCTS}
          />
        </S.ProductSection>

        <S.ButtonArea>
          <CareButton variant="black" onClick={handleMoveToHome}>
            홈으로
          </CareButton>
        </S.ButtonArea>
      </S.Content>
    </S.Page>
  );
}
