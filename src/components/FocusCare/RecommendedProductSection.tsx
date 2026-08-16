import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleMoveToRecommend() {
    navigate("/recommend?from=care");
  }

  function handleProductClick(product: Product) {
    if (!product.linkUrl) {
      return;
    }

    setSelectedProduct(product);
  }

  function handleCloseModal() {
    setSelectedProduct(null);
  }

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProduct]);

  return (
    <>
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
              type="button"
              onClick={() => handleProductClick(product)}
            >
              <S.ProductImagePlaceholder $imageUrl={product.imageUrl} />

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

      {selectedProduct?.linkUrl &&
        createPortal(
          <S.ProductModalOverlay onClick={handleCloseModal}>
            <S.ProductModalContainer
              onClick={(event) => event.stopPropagation()}
            >
              <S.ProductModalHeader>
                <S.ProductModalCloseButton
                  type="button"
                  onClick={handleCloseModal}
                >
                  닫기
                </S.ProductModalCloseButton>
              </S.ProductModalHeader>

              <S.ExternalWebsiteArea>
                <S.ExternalWebsiteFrame
                  src={selectedProduct.linkUrl}
                  title={`${selectedProduct.name} 외부 웹사이트`}
                />
              </S.ExternalWebsiteArea>
            </S.ProductModalContainer>
          </S.ProductModalOverlay>,
          document.body
        )}
    </>
  );
}
