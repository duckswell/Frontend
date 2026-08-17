import * as S from "../styles/ProductCard.styles";

export interface Product {
  id: number;
  brand: string;
  name: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  function handleMoveToProduct() {
    if (!product.linkUrl) {
      return;
    }

    window.open(product.linkUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <S.Card>
      <S.ProductImagePlaceholder $imageUrl={product.imageUrl} />

      <S.ProductInfo>
        <S.Brand>{product.brand}</S.Brand>

        <S.ProductName>{product.name}</S.ProductName>

        <S.ProductLinkButton
          type="button"
          onClick={handleMoveToProduct}
          disabled={!product.linkUrl}
        >
          제품 보러가기
        </S.ProductLinkButton>
      </S.ProductInfo>
    </S.Card>
  );
}
