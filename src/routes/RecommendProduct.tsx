import { useEffect, useRef, useState } from "react";
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

  /*
   * 자동 중앙 정렬 때문에 발생한 scroll 이벤트인지 구분
   */
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

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  /*
   * 맞춤 성분 조회
   */
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await productApi.getRecommendedIngredients();

        console.log("🔥 추천 성분 API 응답:", response);

        /*
         * 추천 성분이 하나도 없는 경우
         */
        if (response.length === 0) {
          /*
           * 일반 탭 진입이면 표시할 성분 없음
           */
          if (initialIngredientId === null || !requestedIngredientName) {
            setIngredients([]);
            setSelectedIngredientId(null);

            return;
          }

          /*
           * Third 페이지에서 넘어왔다면
           * URL의 성분을 최소 한 장 표시
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
         * Third 페이지에서 ingredientId가 넘어온 경우
         */
        if (initialIngredientId !== null) {
          const matchedIngredient = response.find(
            (ingredient) => ingredient.id === initialIngredientId
          );

          /*
           * TOP3 안에 이미 존재
           */
          if (matchedIngredient) {
            setIngredients(response);

            setSelectedIngredientId(matchedIngredient.id);

            return;
          }

          /*
           * TOP3에는 없지만
           * Third 페이지에서 이름까지 전달됨
           *
           * STEP 성분 + 추천 성분으로 최대 3개 구성
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
         * 일반 탭 진입
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
   * 선택 성분 + 제품 카테고리 기준 제품 조회
   */
  useEffect(() => {
    if (selectedIngredientId === null) {
      return;
    }

    async function fetchProducts() {
      try {
        const response = await productApi.getRecommendedProducts(
          selectedIngredientId,
          selectedProductCategory ?? undefined
        );

        console.log("🔥 추천 제품 API 응답:", {
          ingredientId: selectedIngredientId,
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

  /*
   * 처음 진입하거나 Third 페이지에서 넘어온 경우
   * 선택된 성분 카드만 중앙 정렬
   *
   * 자동 scroll 이벤트가 다시 성분 변경을 일으키지 않도록
   * isProgrammaticScrollRef 사용
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

    const targetCard = cards.find(
      (card) => Number(card.dataset.ingredientId) === selectedIngredientId
    );

    if (!targetCard) {
      return;
    }

    const targetScrollLeft =
      targetCard.offsetLeft +
      targetCard.offsetWidth / 2 -
      container.clientWidth / 2;

    isProgrammaticScrollRef.current = true;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "auto",
    });

    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 150);
  }, [ingredients, selectedIngredientId]);

  /*
   * 모달 열릴 때 페이지 스크롤 잠금
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
   * timer 정리
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
   * 스크롤이 멈췄을 때
   * 화면 중앙에 가장 가까운 성분 선택
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

    if (nextIngredientId !== selectedIngredientId) {
      setSelectedIngredientId(nextIngredientId);

      /*
       * 사용자가 직접 다른 성분으로 넘긴 경우
       * 제품 카테고리는 전체보기로
       */
      setSelectedProductCategory(null);
    }
  }

  function handleIngredientScroll() {
    /*
     * 자동 중앙 정렬에서 발생한 scroll은 무시
     */
    if (isProgrammaticScrollRef.current) {
      return;
    }

    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = setTimeout(() => {
      updateSelectedIngredient();
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
            {ingredients.map((ingredient, index) => (
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
