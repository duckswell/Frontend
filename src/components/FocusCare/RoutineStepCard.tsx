import * as S from "../../styles/FocusCare/RoutineStepCard.styles";

interface RoutineStepCardProps {
  step: 1 | 2 | 3 | 4;
  title: string;
  product: string;
  method: string;
  alternative?: string;
}

export default function RoutineStepCard({
  step,
  title,
  product,
  method,
  alternative,
}: RoutineStepCardProps) {
  return (
    <S.Card>
      <S.CardHeader>
        <S.StepBadge>STEP {step}</S.StepBadge>
        <S.Title>{title}</S.Title>
      </S.CardHeader>

      <S.InfoList>
        <S.InfoRow>
          <S.Icon src="/assets/Product.svg" alt="" aria-hidden="true" />

          <S.InfoContent>
            <S.InfoLabel>제품</S.InfoLabel>
            <S.InfoText>{product}</S.InfoText>
          </S.InfoContent>
        </S.InfoRow>

        <S.InfoRow>
          <S.Icon src="/assets/Hands.svg" alt="" aria-hidden="true" />

          <S.InfoContent>
            <S.InfoLabel>방법</S.InfoLabel>
            <S.InfoText>{method}</S.InfoText>
          </S.InfoContent>
        </S.InfoRow>

        {alternative && (
          <S.InfoRow $secondary>
            <S.Icon src="/assets/Change.svg" alt="" aria-hidden="true" />

            <S.InfoContent>
              <S.InfoLabel $secondary>대체성분</S.InfoLabel>
              <S.InfoText $secondary>{alternative}</S.InfoText>
            </S.InfoContent>
          </S.InfoRow>
        )}
      </S.InfoList>

      <S.ProductButton type="button">추천 제품 보기</S.ProductButton>
    </S.Card>
  );
}
