import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

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

export interface CareIngredient {
  id: number;
  name: string;
}

interface RecommendedProductSectionProps {
  title?: string;
  products?: Product[];
  moreProducts?: Product[];
  moreIngredientNames?: string[];
  moreIngredients?: CareIngredient[];
}

export default function RecommendedProductSection({
  title = "오늘의 추천 성분 제품",
  products = [],
  moreProducts,
  moreIngredientNames,
  moreIngredients,
}: RecommendedProductSectionProps) {
  const navigate = useNavigate();

  const productScrollRef = useRef<HTMLDivElement>(null);

  const dragStartXRef = useRef(0);

  const dragStartScrollLeftRef = useRef(0);

  const draggingPointerIdRef = useRef<number | null>(null);

  const hasDraggedRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  function handleMoveToRecommend() {
    navigate("/recommend?from=care", {
      state: {
        recommendedProducts: moreProducts ?? products,

        recommendedIngredientNames: moreIngredientNames,

        recommendedIngredients: moreIngredients,
      },
    });
  }

  function handleMoveToProduct(linkUrl?: string | null) {
    if (hasDraggedRef.current) {
      return;
    }

    if (!linkUrl) {
      console.warn("제품 링크가 없습니다.");

      return;
    }

    const normalizedUrl =
      linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
        ? linkUrl
        : `https://${linkUrl}`;

    console.log("🔥 제품 외부 링크 이동:", normalizedUrl);

    window.open(normalizedUrl, "_blank", "noopener,noreferrer");
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (target.closest("button, a")) {
      return;
    }

    if (event.pointerType !== "mouse") {
      return;
    }

    const container = productScrollRef.current;

    if (!container) {
      return;
    }

    if (container.scrollWidth <= container.clientWidth) {
      return;
    }

    draggingPointerIdRef.current = event.pointerId;

    dragStartXRef.current = event.clientX;

    dragStartScrollLeftRef.current = container.scrollLeft;

    hasDraggedRef.current = false;

    setIsDragging(true);

    container.setPointerCapture(event.pointerId);

    event.preventDefault();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      draggingPointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const container = productScrollRef.current;

    if (!container) {
      return;
    }

    const moveX = event.clientX - dragStartXRef.current;

    if (Math.abs(moveX) >= 5) {
      hasDraggedRef.current = true;
    }

    container.scrollLeft = dragStartScrollLeftRef.current - moveX;

    event.preventDefault();
  }

  function finishPointerDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      draggingPointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const container = productScrollRef.current;

    if (container?.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }

    draggingPointerIdRef.current = null;

    setIsDragging(false);

    window.setTimeout(() => {
      hasDraggedRef.current = false;
    }, 0);
  }

  function handlePointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    if (draggingPointerIdRef.current !== event.pointerId) {
      return;
    }

    draggingPointerIdRef.current = null;

    hasDraggedRef.current = false;

    setIsDragging(false);
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

      <S.ProductScroll
        ref={productScrollRef}
        $isDragging={isDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onPointerCancel={handlePointerCancel}
        onDragStart={(event) => event.preventDefault()}
      >
        {products.map((product, index) => (
          <S.ProductCard
            key={`${product.id}-${product.ingredientId ?? "none"}-${index}`}
          >
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
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
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
