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

  function handleProductClick(linkUrl?: string) {
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
          <S.ProductCard
            key={`${product.id}-${index}`}
            onClick={() => handleProductClick(product.linkUrl)}
          >
            <S.ProductImagePlaceholder
              style={
                product.imageUrl
                  ? {
                      backgroundImage: `url("${product.imageUrl}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : undefined
              }
            />

            <S.ProductInfo>
              <S.Brand>{product.brand}</S.Brand>

              <S.ProductName>{product.name}</S.ProductName>

              <S.CategoryList>
                {product.categories.map((category) => (
                  <S.Category key={`${product.id}-${category}`}>
                    {category}
                  </S.Category>
                ))}
              </S.CategoryList>
            </S.ProductInfo>
          </S.ProductCard>
        ))}
      </S.ProductScroll>
    </S.Section>
  );
}
