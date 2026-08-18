import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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

  const productScrollRef = useRef<HTMLDivElement>(null);

  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const draggingPointerIdRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  function handleMoveToRecommend() {
    navigate("/recommend?from=care");
  }

  function handleMoveToProduct(linkUrl?: string) {
    if (!linkUrl) {
      return;
    }

    window.open(linkUrl, "_blank", "noopener,noreferrer");
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    /*
     * 모바일/태블릿 터치는 기존 브라우저 스크롤 사용
     */
    if (event.pointerType !== "mouse") {
      return;
    }

    /*
     * 제품 보러가기 버튼을 클릭한 경우에는
     * 드래그를 시작하지 않는다.
     */
    const target = event.target as HTMLElement;

    if (target.closest("button")) {
      return;
    }

    const container = productScrollRef.current;

    if (!container) {
      return;
    }

    draggingPointerIdRef.current = event.pointerId;

    dragStartXRef.current = event.clientX;

    dragStartScrollLeftRef.current = container.scrollLeft;

    setIsDragging(true);

    container.setPointerCapture(event.pointerId);

    event.preventDefault();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      !isDragging ||
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

    container.scrollLeft = dragStartScrollLeftRef.current - moveX;

    event.preventDefault();
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
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
  }

  function handlePointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    if (draggingPointerIdRef.current !== event.pointerId) {
      return;
    }

    draggingPointerIdRef.current = null;

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
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDragStart={(event) => event.preventDefault()}
      >
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
