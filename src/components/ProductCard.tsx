import * as S from "../styles/ProductCard.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;
  categories: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <S.Card>
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
    </S.Card>
  );
}