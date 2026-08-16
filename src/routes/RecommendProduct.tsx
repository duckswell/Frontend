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

function getIngredientCategoryLabel(category: string) {
  switch (category) {
    case "VITAMIN":
      return "비타민";

    case "MOISTURE":
      return "보습";

    case "PLANT_EXTRACT":
      return "식물추출";

    default:
      return category;
  }
}

function getIngredientImage(category: string) {
  switch (category) {
    case "VITAMIN":
      return "/assets/Ingridient_pink.svg";

    case "MOISTURE":
      return "/assets/Ingridient_yellow.svg";

    case "PLANT_EXTRACT":
      return "/assets/Ingridient_clover.svg";

    default:
      return "/assets/Ingridient_pink.svg";
  }
}

export default function RecommendProduct() {
  const [searchParams] = useSearchParams();

  const pageRef = useRef<HTMLDivElement>(null);
  const ingredientScrollRef = useRef<HTMLDivElement>(null);

  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fromCare = searchParams.get("from") === "care";

  const requestedIngredientId = searchParams.get("ingredientId");
  const requestedCategory = searchParams.get("category");

  const initialIngredientId = requestedIngredientId
    ? Number(requestedIngredientId)
    : null;

  const [ingredients, setIngredients] = useState<RecommendedIngredient[]>([]);

  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | null
  >(initialIngredientId);

  const [selectedProductCategory, setSelectedProductCategory] =
    useState<ProductCategory | null>(
      requestedCategory ? (requestedCategory as ProductCategory) : null
    );

  const [products, setProducts] = useState<RecommendedProduct[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const loopedIngredients = useMemo(() => {
    if (ingredients.length >= 3) {
      return [...ingredients, ...ingredients, ...ingredients];
    }

    return ingredients;
  }, [ingredients]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await productApi.getRecommendedIngredients();

        setIngredients(response);

        if (response.length === 0) {
          setSelectedIngredientId(null);
          return;
        }

        // ThirdFocusCare에서 ingredientId를 넘겨온 경우
        if (initialIngredientId !== null) {
          const matchedIngredient = response.find(
            (ingredient) => ingredient.id === initialIngredientId
          );

          if (matchedIngredient) {
            setSelectedIngredientId(matchedIngredient.id);
            return;
          }
        }

        // ingredientId가 없거나 목록에 없는 경우
        setSelectedIngredientId(response[0].id);
      } catch (error) {
        console.error("추천 성분 조회 실패:", error);
      }
    }

    fetchIngredients();
  }, [initialIngredientId]);

  useEffect(() => {
    if (selectedIngredientId === null) {
      setProducts([]);
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

        setProducts([]);
      }
    }

    fetchProducts();
  }, [selectedIngredientId, selectedProductCategory]);

  /*
   * API 성분 목록이 로딩된 뒤
   * 현재 선택된 ingredientId 카드를 중앙으로 이동
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

    /*
     * 무한루프용 3묶음 중 가운데 묶음에서
     * ingredientId가 같은 카드 찾기
     */
    let targetCard: HTMLElement | undefined;

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

    if (ingredientId) {
      setSelectedIngredientId(Number(ingredientId));

      /*
       * 성분 변경 시 상품 카테고리는
       * 전체보기로 초기화
       */
      setSelectedProductCategory(null);
    }
  }

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
            {products.map((product) => (
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
