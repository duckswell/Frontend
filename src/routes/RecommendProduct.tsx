import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { TabBar } from "../components/TabBar";
import ProductCard from "../components/ProductCard";
import RecommendedIngredientCard from "../components/RecommendedIngredientCard";
import { createPortal } from "react-dom";
import * as S from "../styles/RecommendProduct.styles";

const INGREDIENTS = [
  {
    id: "hyaluronic-acid",
    category: "진정",
    ingredient: "히알루론산",
    description: "히알루론산이 어디에 어떻게 좋은지에 대한 설명",
    image: "/assets/Ingridient_pink.svg",
  },
  {
    id: "panthenol",
    category: ["진정", "진정"],
    ingredient: "판테놀",
    description: "판테놀이 어디에 어떻게 좋은지에 대한 설명",
    image: "/assets/Ingridient_clover.svg",
  },
  {
    id: "ceramide",
    category: "장벽",
    ingredient: "세라마이드",
    description: "세라마이드가 어디에 어떻게 좋은지에 대한 설명",
    image: "/assets/Ingridient_yellow.svg",
  },
];

const PRODUCT_CATEGORIES = [
  "전체보기",
  "클렌저",
  "스킨/토너",
  "앰플/세럼/에센스",
  "크림",
  "미스트/오일",
];

const PRODUCTS_BY_INGREDIENT = {
  "hyaluronic-acid": [
    {
      id: 1,
      brand: "Pith",
      name: "베리어 크림",
      categories: ["히알루론산"],
    },
    {
      id: 2,
      brand: "Pith",
      name: "수분 앰플",
      categories: ["히알루론산"],
    },
    {
      id: 3,
      brand: "Pith",
      name: "수분 세럼",
      categories: ["히알루론산"],
    },
    {
      id: 4,
      brand: "Pith",
      name: "수분 크림",
      categories: ["히알루론산"],
    },
    {
      id: 5,
      brand: "Pith",
      name: "수분 미스트",
      categories: ["히알루론산"],
    },
    {
      id: 6,
      brand: "Pith",
      name: "수분 토너",
      categories: ["히알루론산"],
    },
  ],

  panthenol: [
    {
      id: 7,
      brand: "Pith",
      name: "판테놀 크림",
      categories: ["판테놀"],
    },
    {
      id: 8,
      brand: "Pith",
      name: "진정 세럼",
      categories: ["판테놀"],
    },
    {
      id: 9,
      brand: "Pith",
      name: "진정 토너",
      categories: ["판테놀"],
    },
    {
      id: 10,
      brand: "Pith",
      name: "진정 미스트",
      categories: ["판테놀"],
    },
  ],

  ceramide: [
    {
      id: 11,
      brand: "Pith",
      name: "세라마이드 크림",
      categories: ["세라마이드"],
    },
    {
      id: 12,
      brand: "Pith",
      name: "장벽 세럼",
      categories: ["세라마이드"],
    },
    {
      id: 13,
      brand: "Pith",
      name: "장벽 토너",
      categories: ["세라마이드"],
    },
    {
      id: 14,
      brand: "Pith",
      name: "장벽 크림",
      categories: ["세라마이드"],
    },
  ],
};
const LOOPED_INGREDIENTS =
  INGREDIENTS.length >= 3
    ? [...INGREDIENTS, ...INGREDIENTS, ...INGREDIENTS]
    : INGREDIENTS;

export default function RecommendProduct() {
  const [searchParams] = useSearchParams();

  const pageRef = useRef<HTMLDivElement>(null);
  const ingredientScrollRef = useRef<HTMLDivElement>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedIngredientId, setSelectedIngredientId] = useState(
    INGREDIENTS[0].id
  );

  const [selectedProductCategory, setSelectedProductCategory] =
    useState("전체보기");

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const fromCare = searchParams.get("from") === "care";

  const products =
    PRODUCTS_BY_INGREDIENT[
      selectedIngredientId as keyof typeof PRODUCTS_BY_INGREDIENT
    ] ?? [];
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

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
    const container = ingredientScrollRef.current;

    if (!container || INGREDIENTS.length < 3) {
      return;
    }

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-ingredient-id]")
    );

    const firstMiddleCard = cards[INGREDIENTS.length];

    if (!firstMiddleCard) {
      return;
    }

    container.scrollLeft =
      firstMiddleCard.offsetLeft +
      firstMiddleCard.offsetWidth / 2 -
      container.clientWidth / 2;

    return () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);
  function handleProductCategoryClick(
    category: string,
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

    const ingredientId = closestCard?.dataset.ingredientId;

    if (ingredientId) {
      setSelectedIngredientId(ingredientId);
    }
  }

  function repositionIngredientLoop() {
    const container = ingredientScrollRef.current;

    if (!container || INGREDIENTS.length < 3) {
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

    if (closestIndex < INGREDIENTS.length) {
      targetIndex = closestIndex + INGREDIENTS.length;
    } else if (closestIndex >= INGREDIENTS.length * 2) {
      targetIndex = closestIndex - INGREDIENTS.length;
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
            {LOOPED_INGREDIENTS.map((ingredient, index) => (
              <S.IngredientCardWrapper
                key={`${ingredient.id}-${index}`}
                data-ingredient-id={ingredient.id}
              >
                <RecommendedIngredientCard
                  category={ingredient.category}
                  ingredient={ingredient.ingredient}
                  description={ingredient.description}
                  image={ingredient.image}
                />
              </S.IngredientCardWrapper>
            ))}
          </S.IngredientScroll>
        </S.IngredientSection>

        <S.ProductSection>
          <S.ProductCategoryScroll>
            {PRODUCT_CATEGORIES.map((category) => {
              const isSelected = selectedProductCategory === category;

              return (
                <S.ProductCategoryButton
                  key={category}
                  type="button"
                  $selected={isSelected}
                  onClick={(event) =>
                    handleProductCategoryClick(category, event)
                  }
                >
                  {category}
                </S.ProductCategoryButton>
              );
            })}
          </S.ProductCategoryScroll>

          <S.ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
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
                나중에 외부 웹사이트를 띄울 공간
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
