import { useNavigate } from "react-router-dom";

import type { ProductCategory } from "../../api/product";

import * as S from "../../styles/FocusCare/RecommendedProductSection.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;

  /*
   * 추천 성분 식별
   */
  ingredientId?: number;
  ingredientName?: string;

  /*
   * 기존 코드 호환
   */
  categories?: string[];

  /*
   * RecommendProduct 페이지에서 사용
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
