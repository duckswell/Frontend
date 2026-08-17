import { useNavigate } from "react-router-dom";

import * as S from "../../styles/FocusCare/RecommendedProductSection.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;
  categories: string[];
  imageUrl?: string;
  linkUrl?: string;
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
    navigate("/recommend?from=care");
  }

  function handleMoveToProduct(linkUrl?: string) {
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

          <S.MoreIcon src="/assets/GotoGray.svg" alt="" aria-hidden="true" />
        </S.MoreButton>
      </S.Header>

      <S.ProductScroll>
        {products.map((product, index) => (
          <S.ProductCard key={`${product.id}-${index}`}>
            <S.ProductImagePlaceholder $imageUrl={product.imageUrl} />

            <S.ProductInfo>
              <S.Brand>{product.brand}</S.Brand>

              <S.ProductName>{product.name}</S.ProductName>

              <S.ProductLinkButton
                type="button"
                onClick={() => handleMoveToProduct(product.linkUrl)}
                disabled={!product.linkUrl}
              >
                제품 보러가기
              </S.ProductLinkButton>
            </S.ProductInfo>
          </S.ProductCard>
        ))}
      </S.ProductScroll>
    </S.Section>
  );
}
