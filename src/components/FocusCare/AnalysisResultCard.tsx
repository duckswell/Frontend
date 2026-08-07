import * as S from "../../styles/FocusCare/AnalysisResultCard.styles";

const SKIN_CONDITIONS = ["건조함", "각질", "각질"];

export default function AnalysisResultCard() {
  return (
    <S.Card>
      <S.Header>
        <S.Title>AI 피부 분석 결과</S.Title>

        <S.DateBadge>2026년 8월 31일</S.DateBadge>
      </S.Header>

      <S.Divider />

      <S.Content>
        <S.StatusTitle>오늘 확인한 피부 상태</S.StatusTitle>

        <S.PhotoPlaceholder />

        <S.ConditionList>
          {SKIN_CONDITIONS.map((condition, index) => (
            <S.ConditionBadge key={`${condition}-${index}`}>
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
      </S.Content>
    </S.Card>
  );
}
