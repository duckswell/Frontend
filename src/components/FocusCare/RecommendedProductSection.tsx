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

  /*
   * RecommendProduct에서
   * Care 추천 성분 카드 생성에 사용
   */
  ingredientId?: number;
  ingredientName?: string;

  /*
   * 기존 코드 호환
   */
  categories?: string[];

  /*
   * 제품 카테고리
   */
  category?: ProductCategory;

  imageUrl?: string | null;
  linkUrl?: string | null;
}

/*
 * 실제 ingredientId를 이미 알고 있는
 * 루틴 성분 데이터.
 *
 * TodayRoutineSummary → 더보기에서 사용.
 */
export interface CareIngredient {
  id: number;
  name: string;
}

interface RecommendedProductSectionProps {
  title?: string;

  /*
   * 현재 섹션에 표시할 제품
   */
  products?: Product[];

  /*
   * 더보기 클릭 시
   * RecommendProduct로 넘길 제품 데이터.
   */
  moreProducts?: Product[];

  /*
   * FinishSelectRoutine 전용.
   *
   * 아직 ingredientId를 모르는 상태에서
   * 성분 이름만 전달한다.
   */
  moreIngredientNames?: string[];

  /*
   * TodayRoutineSummary 전용.
   *
   * 실제 ingredientId + ingredientName을
   * 이미 알고 있는 경우.
   */
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
        /*
         * FinishRoutine 등 기존 흐름.
         */
        recommendedProducts: moreProducts ?? products,

        /*
         * FinishSelectRoutine.
         */
        recommendedIngredientNames: moreIngredientNames,

        /*
         * TodayRoutineSummary.
         *
         * 실제 ingredientId가 포함된
         * 루틴 전체 성분.
         */
        recommendedIngredients: moreIngredients,
      },
    });
  }

  function handleMoveToProduct(linkUrl?: string | null) {
    /*
     * 제품 목록을 드래그하고 놓았을 때
     * 버튼 클릭으로 잘못 인식되는 것 방지.
     */
    if (hasDraggedRef.current) {
      return;
    }

    if (!linkUrl) {
      return;
    }

    window.open(linkUrl, "_blank", "noopener,noreferrer");
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    /*
     * 마우스일 때만 직접 드래그 처리.
     *
     * 모바일 터치 / 트랙패드는
     * 기존 브라우저 스크롤을 그대로 사용.
     */
    if (event.pointerType !== "mouse") {
      return;
    }

    const container = productScrollRef.current;

    if (!container) {
      return;
    }

    /*
     * 스크롤할 제품이 없는 경우
     * 드래그 처리하지 않음.
     */
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

    /*
     * 클릭과 실제 드래그 구분.
     */
    if (Math.abs(moveX) >= 5) {
      hasDraggedRef.current = true;
    }

    /*
     * 마우스를 왼쪽으로 끌면
     * 내용은 오른쪽 방향으로 진행.
     */
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

    /*
     * pointerUp 뒤 click 이벤트까지 처리된 다음
     * drag 여부 초기화.
     */
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
