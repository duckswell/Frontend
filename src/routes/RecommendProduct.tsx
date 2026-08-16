import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";

import {
  productApi,
  type ProductCategory,
  type RecommendedIngredient,
  type RecommendedProduct,
} from "../api/product";

import { NavBar } from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import RecommendedIngredientCard from "../components/RecommendedIngredientCard";
import { TabBar } from "../components/TabBar";

import * as S from "../styles/RecommendProduct.styles";

const PRODUCT_CATEGORIES = [
  {
    label: "전체보기",
    value: null,
  },
  {
    label: "클렌저",
    value: "CLEANSER",
  },
  {
    label: "스킨/토너",
    value: "SKIN_TONER",
  },
  {
    label: "앰플/세럼/에센스",
    value: "AMPOULE_SERUM",
  },
  {
    label: "크림",
    value: "CREAM",
  },
  {
    label: "미스트/오일",
    value: "MIST_OIL",
  },
] as const;

type DisplayIngredientCategory =
  | RecommendedIngredient["category"]
  | "ROUTINE_STEP";

interface DisplayIngredient {
  id: number;
  name: string;
  category: DisplayIngredientCategory;
}

function getIngredientCategoryLabel(category: DisplayIngredientCategory) {
  switch (category) {
    case "VITAMIN":
      return "비타민계열";

    case "MOISTURE":
      return "수분계열";

    case "PLANT_EXTRACT":
      return "풀 추출물계열";

    case "ROUTINE_STEP":
      return "추천 성분";

    default:
      return category;
  }
}

function getIngredientImage(category: DisplayIngredientCategory) {
  switch (category) {
    case "VITAMIN":
      return "/assets/Ingridient_yellow.svg";

    case "MOISTURE":
      return "/assets/Ingridient_pink.svg";

    case "PLANT_EXTRACT":
      return "/assets/Ingridient_clover.svg";

    case "ROUTINE_STEP":
      return "/assets/Ingridient_clover.svg";

    default:
      return "/assets/Ingridient_pink.svg";
  }
}

function isProductCategory(value: string | null): value is ProductCategory {
  return (
    value === "CLEANSER" ||
    value === "SKIN_TONER" ||
    value === "AMPOULE_SERUM" ||
    value === "CREAM" ||
    value === "MIST_OIL"
  );
}

export default function RecommendProduct() {
  const [searchParams] = useSearchParams();

  const pageRef = useRef<HTMLDivElement>(null);
  const ingredientScrollRef = useRef<HTMLDivElement>(null);

  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * 코드에서 직접 카드를 이동시키는 동안
   * onScroll이 사용자 스크롤로 인식되지 않게 한다.
   */
  const isProgrammaticScrollRef = useRef(false);

  /*
   * URL ingredientId가 바뀌었을 때
   * 최초 중앙 정렬을 다시 실행하기 위한 ref
   */
  const centeredIngredientIdRef = useRef<number | null>(null);

  const fromCare = searchParams.get("from") === "care";

  const requestedIngredientIdText = searchParams.get("ingredientId");
  const requestedIngredientName = searchParams.get("ingredientName");
  const requestedCategory = searchParams.get("category");

  const parsedIngredientId =
    requestedIngredientIdText !== null
      ? Number(requestedIngredientIdText)
      : null;

  const initialIngredientId =
    parsedIngredientId !== null && Number.isFinite(parsedIngredientId)
      ? parsedIngredientId
      : null;

  const initialProductCategory = isProductCategory(requestedCategory)
    ? requestedCategory
    : null;

  const [ingredients, setIngredients] = useState<DisplayIngredient[]>([]);

  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | null
  >(initialIngredientId);

  const [selectedProductCategory, setSelectedProductCategory] =
    useState<ProductCategory | null>(initialProductCategory);

  const [products, setProducts] = useState<RecommendedProduct[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  /*
   * 무한 스크롤처럼 보이게
   * 1,2,3 / 1,2,3 / 1,2,3 형태로 렌더링
   */
  const loopedIngredients = useMemo(() => {
    if (ingredients.length <= 1) {
      return ingredients;
    }

    return [...ingredients, ...ingredients, ...ingredients];
  }, [ingredients]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  /*
   * 추천 성분 조회
   */
  useEffect(() => {
    let isCancelled = false;

    async function fetchIngredients() {
      try {
        const response = await productApi.getRecommendedIngredients();

        if (isCancelled) {
          return;
        }

        console.log("🔥 추천 성분 API 응답:", response);
        console.log("🔥 Third에서 전달받은 ingredientId:", initialIngredientId);
        console.log(
          "🔥 Third에서 전달받은 ingredientName:",
          requestedIngredientName
        );

        /*
         * 현재 코스 추천 성분 API가 비어 있어도
         * Third 페이지에서 ingredientId/name을 전달했다면
         * 해당 성분 하나는 화면에 표시한다.
         */
        if (response.length === 0) {
          if (initialIngredientId === null || !requestedIngredientName) {
            setIngredients([]);
            setSelectedIngredientId(null);

            return;
          }

          const stepIngredient: DisplayIngredient = {
            id: initialIngredientId,
            name: requestedIngredientName,
            category: "ROUTINE_STEP",
          };

          setIngredients([stepIngredient]);
          setSelectedIngredientId(initialIngredientId);

          centeredIngredientIdRef.current = null;

          return;
        }

        /*
         * Third 페이지에서 ingredientId를 넘겨받은 경우
         */
        if (initialIngredientId !== null) {
          const matchedIngredient = response.find(
            (ingredient) => ingredient.id === initialIngredientId
          );

          /*
           * 추천 성분 3개 안에 해당 성분이 존재하면
           * API 배열은 그대로 유지하고 해당 성분을 선택한다.
           */
          if (matchedIngredient) {
            setIngredients(response);
            setSelectedIngredientId(matchedIngredient.id);

            centeredIngredientIdRef.current = null;

            return;
          }

          /*
           * API 추천 성분 3개에는 없지만
           * Third에서 ingredientName까지 전달했다면
           * 해당 성분을 가장 앞에 추가한다.
           */
          if (requestedIngredientName) {
            const stepIngredient: DisplayIngredient = {
              id: initialIngredientId,
              name: requestedIngredientName,
              category: "ROUTINE_STEP",
            };

            const nextIngredients: DisplayIngredient[] = [
              stepIngredient,
              ...response.filter(
                (ingredient) => ingredient.id !== initialIngredientId
              ),
            ].slice(0, 3);

            setIngredients(nextIngredients);
            setSelectedIngredientId(initialIngredientId);

            centeredIngredientIdRef.current = null;

            return;
          }
        }

        /*
         * 탭바 등 일반 진입
         */
        setIngredients(response);
        setSelectedIngredientId(response[0].id);

        centeredIngredientIdRef.current = null;
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("추천 성분 조회 실패:", error);

        setIngredients([]);
        setSelectedIngredientId(null);
      }
    }

    fetchIngredients();

    return () => {
      isCancelled = true;
    };
  }, [initialIngredientId, requestedIngredientName]);

  /*
   * 선택된 성분 / 제품 카테고리가 바뀌면
   * 해당 조건의 제품 조회
   */
  useEffect(() => {
    if (selectedIngredientId === null) {
      return;
    }

    let isCancelled = false;

    const ingredientId = selectedIngredientId;

    async function fetchProducts() {
      try {
        const response = await productApi.getRecommendedProducts(
          ingredientId,
          selectedProductCategory ?? undefined
        );

        if (isCancelled) {
          return;
        }

        console.log("🔥 추천 제품 API 응답:", {
          ingredientId,
          productCategory: selectedProductCategory,
          products: response,
        });

        setProducts(response);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("추천 제품 조회 실패:", error);

        setProducts([]);
      }
    }

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [selectedIngredientId, selectedProductCategory]);

  const visibleProducts = selectedIngredientId === null ? [] : products;

  /*
   * 특정 성분 카드를 정확히 중앙으로 이동
   */
  function scrollCardToCenter(
    card: HTMLElement,
    behavior: ScrollBehavior = "auto"
  ) {
    const container = ingredientScrollRef.current;

    if (!container) {
      return;
    }

    /*
     * 이미 예약돼 있던 사용자 scroll-end 판정을 제거한다.
     *
     * 이게 남아 있으면 우리가 특정 카드를 중앙에 맞춘 직후
     * 이전 timer가 실행돼 옆 성분을 선택할 수 있다.
     */
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = null;
    }

    const targetScrollLeft =
      card.offsetLeft + card.offsetWidth / 2 - container.clientWidth / 2;

    isProgrammaticScrollRef.current = true;

    container.scrollTo({
      left: targetScrollLeft,
      behavior,
    });

    /*
     * 120ms은 기존 scroll-end debounce와 너무 가까워서
     * race condition이 생길 수 있으므로 조금 넉넉하게 둔다.
     */
    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 250);
  }

  /*
   * 처음 진입했을 때 선택된 ingredientId의 카드를
   * 정확히 가운데 묶음에서 찾은 뒤 중앙 정렬한다.
   */
  useEffect(() => {
    const container = ingredientScrollRef.current;

    if (
      !container ||
      ingredients.length === 0 ||
      selectedIngredientId === null
    ) {
      return;
    }

    /*
     * 같은 ingredientId에 대해 계속 강제 이동하지 않는다.
     */
    if (centeredIngredientIdRef.current === selectedIngredientId) {
      return;
    }

    const ingredientId = selectedIngredientId;

    const animationFrame = window.requestAnimationFrame(() => {
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>("[data-ingredient-id]")
      );

      if (cards.length === 0) {
        return;
      }

      /*
       * 성분이 하나뿐이면 그 카드만 중앙 배치
       */
      if (ingredients.length === 1) {
        const targetCard = cards.find(
          (card) => Number(card.dataset.ingredientId) === ingredientId
        );

        if (targetCard) {
          scrollCardToCenter(targetCard, "auto");
          centeredIngredientIdRef.current = ingredientId;
        }

        return;
      }

      /*
       * 3번 반복된 배열 중
       * 가운데 묶음만 대상으로 찾는다.
       *
       * 예)
       * [1,2,3] [1,2,3] [1,2,3]
       *          ^ 여기
       */
      const ingredientCount = ingredients.length;

      const middleStart = ingredientCount;
      const middleEnd = ingredientCount * 2;

      const targetCard = cards.find(
        (card, index) =>
          index >= middleStart &&
          index < middleEnd &&
          Number(card.dataset.ingredientId) === ingredientId
      );

      if (!targetCard) {
        console.error(
          "선택된 성분 카드를 가운데 묶음에서 찾지 못했습니다:",
          ingredientId
        );

        return;
      }

      scrollCardToCenter(targetCard, "auto");

      centeredIngredientIdRef.current = ingredientId;
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [ingredients, selectedIngredientId]);

  /*
   * 외부 제품 모달이 열렸을 때
   * 뒤 페이지 스크롤 방지
   */
  useEffect(() => {
    const page = pageRef.current;

    if (!page) {
      return;
    }

    if (selectedProduct) {
      page.style.overflowY = "hidden";
    } else {
      page.style.overflowY = "auto";
    }

    return () => {
      page.style.overflowY = "auto";
    };
  }, [selectedProduct]);

  /*
   * 컴포넌트 제거 시 예약 timer 정리
   */
  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  function handleProductCategoryClick(
    category: ProductCategory | null,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    setSelectedProductCategory(category);

    event.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }

  function handlePageScroll() {
    const page = pageRef.current;

    if (!page) {
      return;
    }

    setShowScrollTopButton(page.scrollTop > 10);
  }

  /*
   * 사용자가 성분 카드를 스크롤하고 멈추면
   * 화면 중앙에 가장 가까운 카드를 실제 선택 성분으로 변경
   */
  function updateSelectedIngredient() {
    const container = ingredientScrollRef.current;

    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const containerCenter = containerRect.left + containerRect.width / 2;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-ingredient-id]")
    );

    if (cards.length === 0) {
      return;
    }

    let closestCard = cards[0];
    let closestCardIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();

      const cardCenter = cardRect.left + cardRect.width / 2;

      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
        closestCardIndex = index;
      }
    });

    const ingredientIdText = closestCard.dataset.ingredientId;

    if (!ingredientIdText) {
      return;
    }

    const nextIngredientId = Number(ingredientIdText);

    /*
     * 실제 사용자 스크롤로 선택이 바뀐 것이므로
     * 자동 중앙 정렬 완료 표시를 갱신한다.
     */
    centeredIngredientIdRef.current = nextIngredientId;

    if (nextIngredientId !== selectedIngredientId) {
      console.log("🔥 중앙 카드 성분 변경:", {
        이전: selectedIngredientId,
        현재: nextIngredientId,
      });

      setSelectedIngredientId(nextIngredientId);

      /*
       * 다른 성분으로 넘어가면
       * 제품 종류 필터는 전체보기로 초기화
       */
      setSelectedProductCategory(null);
    }

    /*
     * 카드가 하나뿐이면 루프 위치 보정 필요 없음
     */
    if (ingredients.length <= 1) {
      return;
    }

    const ingredientCount = ingredients.length;

    /*
     * 첫 번째 묶음까지 스크롤했으면
     * 같은 카드의 가운데 묶음 위치로 순간 이동
     */
    if (closestCardIndex < ingredientCount) {
      const equivalentIndex = closestCardIndex + ingredientCount;

      const equivalentCard = cards[equivalentIndex];

      if (equivalentCard) {
        scrollCardToCenter(equivalentCard, "auto");
      }

      return;
    }

    /*
     * 세 번째 묶음까지 스크롤했으면
     * 같은 카드의 가운데 묶음 위치로 순간 이동
     */
    if (closestCardIndex >= ingredientCount * 2) {
      const equivalentIndex = closestCardIndex - ingredientCount;

      const equivalentCard = cards[equivalentIndex];

      if (equivalentCard) {
        scrollCardToCenter(equivalentCard, "auto");
      }
    }
  }

  function handleIngredientScroll() {
    /*
     * 프로그램이 카드를 중앙에 옮기는 중에는
     * 사용자가 카드를 변경한 것으로 처리하지 않는다.
     */
    if (isProgrammaticScrollRef.current) {
      return;
    }

    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = setTimeout(() => {
      /*
       * timer가 예약된 뒤 그 사이 프로그램 스크롤이 시작될 수도 있으므로
       * 실행 직전에도 한 번 더 확인한다.
       */
      if (isProgrammaticScrollRef.current) {
        return;
      }

      updateSelectedIngredient();

      scrollEndTimerRef.current = null;
    }, 150);
  }

  function handleScrollToTop() {
    const page = pageRef.current;

    if (!page) {
      return;
    }

    page.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <S.Page ref={pageRef} $hasTabBar={!fromCare} onScroll={handlePageScroll}>
      {fromCare ? (
        <NavBar title="제품" />
      ) : (
        <S.TitleHeader>
          <S.HeaderTitle>제품</S.HeaderTitle>
        </S.TitleHeader>
      )}

      <S.Content>
        <S.IngredientSection>
          <S.SectionTitle>나의 맞춤 성분</S.SectionTitle>

          <S.IngredientScroll
            ref={ingredientScrollRef}
            onScroll={handleIngredientScroll}
          >
            {loopedIngredients.map((ingredient, index) => (
              <S.IngredientCardWrapper
                key={`${ingredient.id}-${index}`}
                data-ingredient-id={ingredient.id}
                data-loop-index={index}
              >
                <RecommendedIngredientCard
                  category={getIngredientCategoryLabel(ingredient.category)}
                  ingredient={ingredient.name}
                  description={`${ingredient.name} 성분을 활용한 맞춤 제품을 확인해보세요.`}
                  image={getIngredientImage(ingredient.category)}
                />
              </S.IngredientCardWrapper>
            ))}
          </S.IngredientScroll>
        </S.IngredientSection>

        <S.ProductSection>
          <S.ProductCategoryScroll>
            {PRODUCT_CATEGORIES.map((category) => {
              const isSelected = selectedProductCategory === category.value;

              return (
                <S.ProductCategoryButton
                  key={category.label}
                  type="button"
                  $selected={isSelected}
                  onClick={(event) =>
                    handleProductCategoryClick(category.value, event)
                  }
                >
                  {category.label}
                </S.ProductCategoryButton>
              );
            })}
          </S.ProductCategoryScroll>

          <S.ProductGrid>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  brand: product.brand,
                  name: product.name,
                  imageUrl: product.imageUrl,
                }}
                onClick={() => setSelectedProductId(product.id)}
              />
            ))}
          </S.ProductGrid>
        </S.ProductSection>
      </S.Content>

      {selectedProduct &&
        createPortal(
          <S.ProductModalOverlay
            $hasTabBar={!fromCare}
            onClick={() => setSelectedProductId(null)}
          >
            <S.ProductModalContainer
              onClick={(event) => event.stopPropagation()}
            >
              <S.ProductModalHeader>
                <S.ProductModalCloseButton
                  type="button"
                  onClick={() => setSelectedProductId(null)}
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

      {showScrollTopButton && !selectedProduct && (
        <S.ScrollTopButton
          type="button"
          $hasTabBar={!fromCare}
          onClick={handleScrollToTop}
          aria-label="맨 위로 이동"
        >
          <S.ScrollTopIcon
            src="/assets/ArrowUp.svg"
            alt=""
            aria-hidden="true"
          />
        </S.ScrollTopButton>
      )}

      {!fromCare && <TabBar activeTab="recommend" />}
    </S.Page>
  );
}
