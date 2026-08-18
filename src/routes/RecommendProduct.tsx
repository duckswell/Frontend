import { useEffect, useMemo, useRef, useState } from "react";
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

interface IngredientCardInfo {
  categories: string[];
  description: string;
}

/*
 * 성분 카드에 표시할
 * 특징 태그 + 성분 설명
 */
const INGREDIENT_CARD_INFO: Record<string, IngredientCardInfo> = {
  센텔라: {
    categories: ["진정", "붉은기", "피부 보호"],
    description:
      "자극받아 붉어진 피부를 편안하게 진정하고 건강한 피부 컨디션을 유지하도록 도와줘요",
  },

  판테놀: {
    categories: ["보습", "장벽 강화", "진정"],
    description:
      "피부에 수분을 공급하고 외부 자극으로 약해진 피부 장벽을 편안하게 관리해 줘요",
  },

  알로에: {
    categories: ["진정", "수분 공급", "쿨링"],
    description:
      "자극받은 피부를 산뜻하게 진정하고 건조해진 피부에 촉촉함을 더해줘요",
  },

  알로에베라: {
    categories: ["진정", "수분 공급", "쿨링"],
    description:
      "자극받은 피부를 산뜻하게 진정하고 건조해진 피부에 촉촉함을 더해줘요",
  },

  세라마이드: {
    categories: ["장벽 강화", "수분 유지", "피부 보호"],
    description:
      "피부 장벽을 구성하는 성분으로, 수분이 빠져나가지 않도록 보호하고 보습을 유지해 줘요",
  },

  히알루론산: {
    categories: ["수분 공급", "보습 유지"],
    description:
      "피부에 수분을 끌어당겨 건조함을 줄이고 촉촉하고 유연한 피부로 관리해 줘요",
  },

  나이아신아마이드: {
    categories: ["피부톤 개선", "잡티 관리", "장벽 강화", "피지 조절"],
    description:
      "칙칙한 피부톤과 눈에 띄는 잡티를 맑고 균일하게 관리하고 피지 조절, 피부 장벽 강화에 도움을 줘요",
  },

  "비타민 C": {
    categories: ["피부톤 개선", "항산화", "잡티 관리"],
    description:
      "칙칙한 피부톤을 맑게 관리하고 외부 환경으로 인한 피부 산화를 방지하는 데 도움을 줘요",
  },

  비타민C: {
    categories: ["피부톤 개선", "항산화", "잡티 관리"],
    description:
      "칙칙한 피부톤을 맑게 관리하고 외부 환경으로 인한 피부 산화를 방지하는 데 도움을 줘요",
  },

  "징크 PCA": {
    categories: ["피지 조절", "번들거림 완화", "피부 청결"],
    description:
      "과도한 피지와 번들거림을 조절해 피부를 산뜻하고 깨끗한 상태로 유지하도록 도와줘요",
  },

  징크PCA: {
    categories: ["피지 조절", "번들거림 완화", "피부 청결"],
    description:
      "과도한 피지와 번들거림을 조절해 피부를 산뜻하고 깨끗한 상태로 유지하도록 도와줘요",
  },
};

function getIngredientCardInfo(name: string): IngredientCardInfo {
  const normalizedName = name.trim();

  const matchedInfo = INGREDIENT_CARD_INFO[normalizedName];

  if (matchedInfo) {
    return matchedInfo;
  }

  /*
   * 백엔드에서 이름에 공백 등이 다르게 내려오는 경우를 위한 fallback
   */
  const matchedEntry = Object.entries(INGREDIENT_CARD_INFO).find(
    ([ingredientName]) =>
      ingredientName.replace(/\s/g, "") === normalizedName.replace(/\s/g, "")
  );

  if (matchedEntry) {
    return matchedEntry[1];
  }

  /*
   * 아직 등록되지 않은 성분이 내려올 경우
   */
  return {
    categories: ["추천 성분"],
    description: `${name} 성분을 활용한 맞춤 제품을 확인해보세요.`,
  };
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
  const productCategoryScrollRef = useRef<HTMLDivElement>(null);

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

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  /*
   * 성분 카드 무한 스크롤을 위해
   * 같은 배열을 3번 반복
   */
  const loopedIngredients = useMemo(() => {
    if (ingredients.length <= 1) {
      return ingredients;
    }

    return [...ingredients, ...ingredients, ...ingredients];
  }, [ingredients]);

  /*
   * 선택된 제품 카테고리가 화면에서 잘 보이도록 중앙 정렬
   */
  useEffect(() => {
    const container = productCategoryScrollRef.current;

    if (!container) {
      return;
    }

    const selectedButton = container.querySelector<HTMLElement>(
      '[data-selected="true"]'
    );

    if (!selectedButton) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      selectedButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [selectedProductCategory]);

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
           * 추천 성분 안에 해당 성분이 존재하면
           * API 배열은 그대로 유지하고 해당 성분을 선택한다.
           */
          if (matchedIngredient) {
            setIngredients(response);
            setSelectedIngredientId(matchedIngredient.id);

            centeredIngredientIdRef.current = null;

            return;
          }

          /*
           * API 추천 성분에는 없지만
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

    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 250);
  }

  /*
   * 처음 진입했을 때 선택된 ingredientId의 카드를
   * 가운데 묶음에서 찾아 중앙 정렬
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
       * 성분이 하나뿐이면 해당 카드 중앙 정렬
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
      inline: "center",
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
   * 화면 중앙에 가장 가까운 카드를 선택
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

    centeredIngredientIdRef.current = nextIngredientId;

    if (nextIngredientId !== selectedIngredientId) {
      console.log("🔥 중앙 카드 성분 변경:", {
        이전: selectedIngredientId,
        현재: nextIngredientId,
      });

      setSelectedIngredientId(nextIngredientId);

      /*
       * 성분이 바뀌면 제품 종류 필터는 전체보기
       */
      setSelectedProductCategory(null);
    }

    if (ingredients.length <= 1) {
      return;
    }

    const ingredientCount = ingredients.length;

    /*
     * 첫 번째 묶음까지 이동하면
     * 같은 카드의 가운데 묶음으로 순간 이동
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
     * 세 번째 묶음까지 이동하면
     * 같은 카드의 가운데 묶음으로 순간 이동
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
    if (isProgrammaticScrollRef.current) {
      return;
    }

    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = setTimeout(() => {
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
            {loopedIngredients.map((ingredient, index) => {
              const cardInfo = getIngredientCardInfo(ingredient.name);

              return (
                <S.IngredientCardWrapper
                  key={`${ingredient.id}-${index}`}
                  data-ingredient-id={ingredient.id}
                  data-loop-index={index}
                >
                  <RecommendedIngredientCard
                    category={cardInfo.categories}
                    ingredient={ingredient.name}
                    description={cardInfo.description}
                    image={getIngredientImage(ingredient.category)}
                  />
                </S.IngredientCardWrapper>
              );
            })}
          </S.IngredientScroll>
        </S.IngredientSection>

        <S.ProductSection>
          <S.ProductCategoryScroll ref={productCategoryScrollRef}>
            {PRODUCT_CATEGORIES.map((category) => {
              const isSelected = selectedProductCategory === category.value;

              return (
                <S.ProductCategoryButton
                  key={category.label}
                  type="button"
                  $selected={isSelected}
                  data-selected={isSelected}
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
                  linkUrl: product.linkUrl,
                }}
              />
            ))}
          </S.ProductGrid>
        </S.ProductSection>
      </S.Content>

      {showScrollTopButton && (
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
