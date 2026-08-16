import * as S from "../styles/ProductCard.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;
  imageUrl?: string | null;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <S.Card>
      <S.ProductImageButton
        type="button"
        onClick={onClick}
        aria-label={`${product.name} 상세보기`}
      >
        <S.ProductImagePlaceholder $imageUrl={product.imageUrl} />
      </S.ProductImageButton>

      <S.ProductInfo>
        <S.ProductTextButton type="button" onClick={onClick}>
          <S.Brand>{product.brand}</S.Brand>

          <S.ProductName>{product.name}</S.ProductName>
        </S.ProductTextButton>
      </S.ProductInfo>
    </S.Card>
  );
}
