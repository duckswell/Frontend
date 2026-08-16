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

/*
 * API에서 내려오는 RecommendedIngredient의 category는
 * VITAMIN / MOISTURE / PLANT_EXTRACT만 존재한다.
 *
 * ThirdFocusCare / ThirdDailyCare에서 바로 넘어온 성분은
 * 화면 표시용으로 ROUTINE_STEP을 사용할 수 있도록
 * 별도의 타입을 만든다.
 */
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
      return "비타민";

    case "MOISTURE":
      return "보습";

    case "PLANT_EXTRACT":
      return "식물추출";

    case "ROUTINE_STEP":
      return "추천 성분";

    default:
      return category;
  }
}

function getIngredientImage(category: DisplayIngredientCategory) {
  switch (category) {
    case "VITAMIN":
      return "/assets/Ingridient_pink.svg";

    case "MOISTURE":
      return "/assets/Ingridient_yellow.svg";

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

  const fromCare = searchParams.get("from") === "care";

  /*
   * ThirdFocusCare / ThirdDailyCare에서 넘어오는 값
   *
   * 예:
   * /recommend
   * ?from=care
   * &category=SKIN_TONER
   * &ingredientId=6
   * &ingredientName=센텔라
   */
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
   * 성분 카드가 3개 이상이면
   * 무한 스크롤처럼 보이도록 3번 반복한다.
   */
  const loopedIngredients = useMemo(() => {
    if (ingredients.length >= 3) {
      return [...ingredients, ...ingredients, ...ingredients];
    }

    return ingredients;
  }, [ingredients]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  /*
   * 맞춤 성분 조회
   */
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await productApi.getRecommendedIngredients();

        /*
         * 추천 성분 자체가 하나도 없는 경우
         */
        if (response.length === 0) {
          /*
           * 일반 추천 페이지 진입이면
           * 보여줄 성분이 없음
           */
          if (initialIngredientId === null || !requestedIngredientName) {
            setIngredients([]);
            setSelectedIngredientId(null);

            return;
          }

          /*
           * Third 페이지 STEP 카드에서 넘어왔다면
           * ingredientId + ingredientName을 알고 있으므로
           * 해당 성분 카드 한 장은 표시
           */
          const stepIngredient: DisplayIngredient = {
            id: initialIngredientId,
            name: requestedIngredientName,
            category: "ROUTINE_STEP",
          };

          setIngredients([stepIngredient]);

          setSelectedIngredientId(initialIngredientId);

          return;
        }

        /*
         * STEP 카드에서 ingredientId가 전달된 경우
         */
        if (initialIngredientId !== null) {
          const matchedIngredient = response.find(
            (ingredient) => ingredient.id === initialIngredientId
          );

          /*
           * STEP 성분이 추천 TOP3 안에도 있으면
           * API 응답 그대로 사용
           */
          if (matchedIngredient) {
            setIngredients(response);

            setSelectedIngredientId(matchedIngredient.id);

            return;
          }

          /*
           * STEP 성분이 TOP3에는 없지만
           * ingredientName까지 전달받았다면
           *
           * STEP 성분을 첫 번째에 넣고
           * 나머지 추천 성분을 붙여 총 3개 유지
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

            return;
          }
        }

        /*
         * 일반 추천 페이지 진입
         *
         * 첫 번째 성분을 기본 선택
         */
        setIngredients(response);

        setSelectedIngredientId(response[0].id);
      } catch (error) {
        console.error("추천 성분 조회 실패:", error);

        setIngredients([]);
        setSelectedIngredientId(null);
      }
    }

    fetchIngredients();
  }, [initialIngredientId, requestedIngredientName]);

  /*
   * 선택된 성분 + 제품 카테고리 기준
   * 추천 제품 조회
   */
  useEffect(() => {
    /*
     * 여기서 setProducts([])를 바로 호출하면
     * set-state-in-effect 경고가 발생할 수 있으므로
     * 그냥 API 호출을 생략한다.
     */
    if (selectedIngredientId === null) {
      return;
    }

    async function fetchProducts() {
      try {
        const response = await productApi.getRecommendedProducts(
          selectedIngredientId,
          selectedProductCategory ?? undefined
        );

        setProducts(response);
      } catch (error) {
        console.error("추천 제품 조회 실패:", error);

        /*
         * await 이후 실행되는 비동기 처리이므로
         * 이 setState는 괜찮다.
         */
        setProducts([]);
      }
    }

    fetchProducts();
  }, [selectedIngredientId, selectedProductCategory]);

  /*
   * selectedIngredientId가 null이면
   * 기존 products state가 남아 있어도
   * 화면에는 노출하지 않는다.
   */
  const visibleProducts = selectedIngredientId === null ? [] : products;

  /*
   * 선택된 성분 카드를 가운데로 배치
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

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-ingredient-id]")
    );

    if (cards.length === 0) {
      return;
    }

    let targetCard: HTMLElement | undefined;

    /*
     * 3개 이상이면 가운데 반복 영역에서
     * 선택된 성분을 찾는다.
     */
    if (ingredients.length >= 3) {
      const middleCards = cards.slice(
        ingredients.length,
        ingredients.length * 2
      );

      targetCard = middleCards.find(
        (card) => Number(card.dataset.ingredientId) === selectedIngredientId
      );
    } else {
      targetCard = cards.find(
        (card) => Number(card.dataset.ingredientId) === selectedIngredientId
      );
    }

    if (!targetCard) {
      return;
    }

    const targetScrollLeft =
      targetCard.offsetLeft +
      targetCard.offsetWidth / 2 -
      container.clientWidth / 2;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "auto",
    });
  }, [ingredients, selectedIngredientId]);

  /*
   * 제품 상세 모달 오픈 중에는
   * 페이지 스크롤 잠금
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
   * debounce timer 정리
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
   * 현재 화면 중앙에 가장 가까운
   * 성분 카드를 selectedIngredient로 설정
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

    let closestDistance = Infinity;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();

      const cardCenter = cardRect.left + cardRect.width / 2;

      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;

        closestCard = card;
      }
    });

    const ingredientId = closestCard.dataset.ingredientId;

    if (!ingredientId) {
      return;
    }

    const nextIngredientId = Number(ingredientId);

    /*
     * 실제 사용자가 다른 성분으로 이동했을 때만
     * 선택 성분을 변경한다.
     *
     * 이때 제품 카테고리는 전체보기로 초기화.
     *
     * Third 페이지에서 처음 자동 중앙 정렬되는 경우
     * ingredientId가 이미 같으므로
     * category가 유지된다.
     */
    if (nextIngredientId !== selectedIngredientId) {
      setSelectedIngredientId(nextIngredientId);

      setSelectedProductCategory(null);
    }
  }

  /*
   * 3세트 반복된 성분 카드가
   * 양 끝 영역으로 이동했을 경우
   * 동일한 가운데 세트로 순간 이동
   */
  function repositionIngredientLoop() {
    const container = ingredientScrollRef.current;

    if (!container || ingredients.length < 3) {
      return;
    }

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-ingredient-id]")
    );

    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;

      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;

        closestIndex = index;
      }
    });

    let targetIndex: number;

    if (closestIndex < ingredients.length) {
      targetIndex = closestIndex + ingredients.length;
    } else if (closestIndex >= ingredients.length * 2) {
      targetIndex = closestIndex - ingredients.length;
    } else {
      return;
    }

    const targetCard = cards[targetIndex];

    if (!targetCard) {
      return;
    }

    const targetScrollLeft =
      targetCard.offsetLeft +
      targetCard.offsetWidth / 2 -
      container.clientWidth / 2;

    container.style.scrollSnapType = "none";

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "auto",
    });

    requestAnimationFrame(() => {
      container.style.scrollSnapType = "x mandatory";
    });
  }

  function handleIngredientScroll() {
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = setTimeout(() => {
      updateSelectedIngredient();
      repositionIngredientLoop();
    }, 120);
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
