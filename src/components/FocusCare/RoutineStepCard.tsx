import type { ReactNode } from "react";

import * as S from "../../styles/FocusCare/RoutineStepCard.styles";

interface RoutineStepCardProps {
  step: number;
  title: string;
  product: string;
  method: ReactNode;
  alternative?: ReactNode;
  variant?: "focus" | "daily";
  productButtonText?: string;
  onProductButtonClick?: () => void;
}

export default function RoutineStepCard({
  step,
  title,
  product,
  method,
  alternative,
  variant = "focus",
  productButtonText = "추천 제품 보기",
  onProductButtonClick,
}: RoutineStepCardProps) {
  return (
    <S.Card $variant={variant}>
      <S.CardHeader>
        <S.StepBadge $variant={variant}>STEP {step}</S.StepBadge>
        <S.Title $variant={variant}>{title}</S.Title>
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

      {onProductButtonClick && (
        <S.ProductButton type="button" onClick={onProductButtonClick}>
          {productButtonText}
        </S.ProductButton>
      )}
    </S.Card>
  );
}
