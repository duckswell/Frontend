import * as S from "../../styles/FocusCare/RoutineRecordCard.styles";

interface RoutineRecordCardProps {
  completionSummaryText: string;
  ingredients: string[];
}

export default function RoutineRecordCard({
  completionSummaryText,
  ingredients,
}: RoutineRecordCardProps) {
  return (
    <S.Card>
      <S.Title>오늘의 루틴 기록</S.Title>

      <S.Description>{completionSummaryText}</S.Description>

      {ingredients.length > 0 && (
        <S.IngredientRow>
          <S.RecommendIcon
            src="/assets/Recommend.svg"
            alt=""
            aria-hidden="true"
          />

          <S.IngredientText>{ingredients.join(" · ")}</S.IngredientText>
        </S.IngredientRow>
      )}

      <S.GuideText>
        * 이 안내는 관리 목적 참고 정보이며 의료 진단을 대체하지 않아요
      </S.GuideText>
    </S.Card>
  );
}
