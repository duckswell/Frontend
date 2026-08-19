import { useNavigate } from "react-router-dom";

import type { ProductCategory } from "../../api/product";

import * as S from "../../styles/FocusCare/RecommendedProductSection.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;

  /*
   * RecommendProduct에서
   * Care 추천 성분 카드 생성에 사용
   */
  ingredientId?: number;
  ingredientName?: string;

  /*
   * 기존 코드 호환
   */
  categories?: string[];

  /*
   * 제품 카테고리
   */
  category?: ProductCategory;

  imageUrl?: string | null;
  linkUrl?: string | null;
}

/*
 * 실제 ingredientId를 이미 알고 있는
 * 루틴 성분 데이터.
 *
 * TodayRoutineSummary → 더보기에서 사용.
 */
export interface CareIngredient {
  id: number;
  name: string;
}

interface RecommendedProductSectionProps {
  title?: string;

  /*
   * 현재 섹션에 표시할 제품
   */
  products?: Product[];

  /*
   * 더보기 클릭 시
   * RecommendProduct로 넘길 제품 데이터.
   */
  moreProducts?: Product[];

  /*
   * FinishSelectRoutine 전용.
   *
   * 아직 ingredientId를 모르는 상태에서
   * 성분 이름만 전달한다.
   */
  moreIngredientNames?: string[];

  /*
   * TodayRoutineSummary 전용.
   *
   * 실제 ingredientId + ingredientName을
   * 이미 알고 있는 경우.
   */
  moreIngredients?: CareIngredient[];
}

export default function RecommendedProductSection({
  title = "오늘의 추천 성분 제품",
  products = [],
  moreProducts,
  moreIngredientNames,
  moreIngredients,
}: RecommendedProductSectionProps) {
  const navigate = useNavigate();

  function handleMoveToRecommend() {
    navigate("/recommend?from=care", {
      state: {
        /*
         * FinishRoutine 등 기존 흐름.
         */
        recommendedProducts: moreProducts ?? products,

        /*
         * FinishSelectRoutine.
         */
        recommendedIngredientNames: moreIngredientNames,

        /*
         * TodayRoutineSummary.
         *
         * 실제 ingredientId가 포함된
         * 루틴 전체 성분.
         */
        recommendedIngredients: moreIngredients,
      },
    });
  }

  function handleMoveToProduct(linkUrl?: string | null) {
    if (!linkUrl) {
      return;
    }

    window.open(linkUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <S.Section>
      <S.Header>
        <S.Title>{title}</S.Title>

        <S.MoreButton type="button" onClick={handleMoveToRecommend}>
          <S.MoreText>더보기</S.MoreText>

          <S.MoreIcon src="/assets/Goto.svg" alt="" aria-hidden="true" />
        </S.MoreButton>
      </S.Header>

      <S.ProductScroll $isDragging={false}>
        {products.map((product, index) => (
          <S.ProductCard
            key={`${product.id}-${product.ingredientId ?? "none"}-${index}`}
          >
            <S.ProductImagePlaceholder
              $imageUrl={product.imageUrl ?? undefined}
              role={product.imageUrl ? "img" : undefined}
              aria-label={product.imageUrl ? product.name : undefined}
            />

            <S.ProductInfo>
              <S.Brand>{product.brand}</S.Brand>

              <S.ProductName>{product.name}</S.ProductName>
            </S.ProductInfo>

            <S.ProductLinkButton
              type="button"
              disabled={!product.linkUrl}
              onClick={() => handleMoveToProduct(product.linkUrl)}
            >
              제품 보러가기
            </S.ProductLinkButton>
          </S.ProductCard>
        ))}
      </S.ProductScroll>
    </S.Section>
  );
}
