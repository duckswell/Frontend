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

  const isProgrammaticScrollRef = useRef(false);

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

  const loopedIngredients = useMemo(() => {
    if (ingredients.length <= 1) {
      return ingredients;
    }

    return [...ingredients, ...ingredients, ...ingredients];
  }, [ingredients]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await productApi.getRecommendedIngredients();

        console.log("🔥 추천 성분 API 응답:", response);

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

          return;
        }

        if (initialIngredientId !== null) {
          const matchedIngredient = response.find(
            (ingredient) => ingredient.id === initialIngredientId
          );

          if (matchedIngredient) {
            setIngredients(response);
            setSelectedIngredientId(matchedIngredient.id);

            return;
          }

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

  useEffect(() => {
    if (selectedIngredientId === null) {
      return;
    }

    const ingredientId: number = selectedIngredientId;

    async function fetchProducts() {
      try {
        const response = await productApi.getRecommendedProducts(
          ingredientId,
          selectedProductCategory ?? undefined
        );

        console.log("🔥 추천 제품 API 응답:", {
          ingredientId,
          productCategory: selectedProductCategory,
          products: response,
        });

        setProducts(response);
      } catch (error) {
        console.error("추천 제품 조회 실패:", error);

        setProducts([]);
      }
    }

    fetchProducts();
  }, [selectedIngredientId, selectedProductCategory]);
  const visibleProducts = selectedIngredientId === null ? [] : products;

  function scrollCardToCenter(
    card: HTMLElement,
    behavior: ScrollBehavior = "auto"
  ) {
    const container = ingredientScrollRef.current;

    if (!container) {
      return;
    }

    const targetScrollLeft =
      card.offsetLeft + card.offsetWidth / 2 - container.clientWidth / 2;

    isProgrammaticScrollRef.current = true;

    container.scrollTo({
      left: targetScrollLeft,
      behavior,
    });

    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 120);
  }

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

    if (ingredients.length === 1) {
      const targetCard = cards.find(
        (card) => Number(card.dataset.ingredientId) === selectedIngredientId
      );

      if (targetCard) {
        scrollCardToCenter(targetCard);
      }

      return;
    }

    const ingredientCount = ingredients.length;

    const middleStart = ingredientCount;
    const middleEnd = ingredientCount * 2;

    const targetCard = cards.find(
      (card, index) =>
        index >= middleStart &&
        index < middleEnd &&
        Number(card.dataset.ingredientId) === selectedIngredientId
    );

    if (!targetCard) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      scrollCardToCenter(targetCard);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [ingredients]);

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

    if (nextIngredientId !== selectedIngredientId) {
      setSelectedIngredientId(nextIngredientId);
      setSelectedProductCategory(null);
    }

    if (ingredients.length <= 1) {
      return;
    }

    const ingredientCount = ingredients.length;

    if (closestCardIndex < ingredientCount) {
      const equivalentIndex = closestCardIndex + ingredientCount;

      const equivalentCard = cards[equivalentIndex];

      if (equivalentCard) {
        scrollCardToCenter(equivalentCard);
      }

      return;
    }

    if (closestCardIndex >= ingredientCount * 2) {
      const equivalentIndex = closestCardIndex - ingredientCount;

      const equivalentCard = cards[equivalentIndex];

      if (equivalentCard) {
        scrollCardToCenter(equivalentCard);
      }
    }
  }

  function handleIngredientScroll() {
    if (isProgrammaticScrollRef.current) {
      return;
    }

    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = setTimeout(() => {
      updateSelectedIngredient();
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
