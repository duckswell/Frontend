import { useNavigate } from "react-router-dom";

import type { ProductCategory } from "../../api/product";

import * as S from "../../styles/FocusCare/RecommendedProductSection.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;

  /*
   * 해당 제품을 추천한 성분
   *
   * RecommendProduct의 성분 카드 구성에 사용
   */
  ingredientId?: number;
  ingredientName?: string;

  /*
   * 기존 코드 호환
   */
  categories?: string[];

  /*
   * RecommendProduct 제품 카테고리
   */
  category?: ProductCategory;

  imageUrl?: string | null;
  linkUrl?: string | null;
}

interface RecommendedProductSectionProps {
  title?: string;
  products?: Product[];
}

export default function RecommendedProductSection({
  title = "오늘의 추천 성분 제품",
  products = [],
}: RecommendedProductSectionProps) {
  const navigate = useNavigate();

  function handleMoveToRecommend() {
    /*
     * FinishRoutine에서 받은 추천 제품을
     * 제품 추천 페이지로 그대로 전달한다.
     *
     * RecommendProduct에서는
     * ingredientId + ingredientName을 기준으로
     * 성분 카드를 구성한다.
     */
    navigate("/recommend?from=care", {
      state: {
        recommendedProducts: products,
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
        {products.map((product) => (
          <S.ProductCard key={product.id}>
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
