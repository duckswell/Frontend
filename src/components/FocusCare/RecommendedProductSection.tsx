import { useNavigate } from "react-router-dom";

import type { ProductCategory } from "../../api/product";

import * as S from "../../styles/FocusCare/RecommendedProductSection.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;

  ingredientId?: number;
  ingredientName?: string;

  categories?: string[];

  category?: ProductCategory;

  imageUrl?: string | null;
  linkUrl?: string | null;
}

interface RecommendedProductSectionProps {
  title?: string;

  /*
   * 실제 섹션에 표시할 제품
   */
  products?: Product[];

  /*
   * 더보기 클릭 시 RecommendProduct로 넘길 데이터
   *
   * 지정하지 않으면 기존처럼 products를 사용한다.
   */
  moreProducts?: Product[];
}

export default function RecommendedProductSection({
  title = "오늘의 추천 성분 제품",
  products = [],
  moreProducts,
}: RecommendedProductSectionProps) {
  const navigate = useNavigate();

  function handleMoveToRecommend() {
    navigate("/recommend?from=care", {
      state: {
        recommendedProducts: moreProducts ?? products,
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
