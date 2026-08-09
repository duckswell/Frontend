import * as S from "../../styles/FocusCare/RecommendedProductSection.styles";

interface Product {
  id: number;
  brand: string;
  name: string;
  categories: string[];
}

interface RecommendedProductSectionProps {
  title?: string;
  products?: Product[];
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["히알루론산"],
  },
  {
    id: 2,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["히알루론산"],
  },
  {
    id: 3,
    brand: "Pith",
    name: "베리어 크림",
    categories: ["히알루론산", "세라마이드"],
  },
];

export default function RecommendedProductSection({
  title = "오늘의 추천 성분 제품",
  products = DEFAULT_PRODUCTS,
}: RecommendedProductSectionProps) {
  return (
    <S.Section>
      <S.Header>
        <S.Title>{title}</S.Title>

        <S.MoreButton type="button">
          <S.MoreText>더보기</S.MoreText>
          <S.MoreIcon src="/assets/GotoGray.svg" alt="" aria-hidden="true" />
        </S.MoreButton>
      </S.Header>

      <S.ProductScroll>
        {products.map((product) => (
          <S.ProductCard key={product.id}>
            <S.ProductImagePlaceholder />

            <S.ProductInfo>
              <S.Brand>{product.brand}</S.Brand>
              <S.ProductName>{product.name}</S.ProductName>

              <S.CategoryList>
                {product.categories.map((category) => (
                  <S.Category key={category}>{category}</S.Category>
                ))}
              </S.CategoryList>
            </S.ProductInfo>
          </S.ProductCard>
        ))}
      </S.ProductScroll>
    </S.Section>
  );
}
