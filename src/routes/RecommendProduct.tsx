/* eslint-disable react-hooks/set-state-in-effect */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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

import type {
  CareIngredient,
  Product as CareRecommendedProduct,
} from "../components/FocusCare/RecommendedProductSection";

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

interface RecommendProductLocationState {
  /*
   * FinishRoutine 등.
   */
  recommendedProducts?: CareRecommendedProduct[];

  /*
   * FinishSelectRoutine.
   *
   * ingredientId를 아직 모르는 상태.
   */
  recommendedIngredientNames?: string[];

  /*
   * TodayRoutineSummary.
   *
   * 실제 ingredientId를 알고 있는
   * 루틴 전체 성분.
   */
  recommendedIngredients?: CareIngredient[];
}

interface DisplayProduct {
  id: number;
  brand: string;
  name: string;
  category?: ProductCategory;
  imageUrl?: string | null;
  linkUrl?: string | null;
}

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

  징크: {
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

function normalizeIngredientName(name: string) {
  return name.replace(/\s/g, "").trim();
}

function isSameIngredientName(firstName: string, secondName: string) {
  const first = normalizeIngredientName(firstName);

  const second = normalizeIngredientName(secondName);

  if (first === second) {
    return true;
  }

  const aliases = [
    ["징크", "징크PCA"],
    ["알로에", "알로에베라"],
  ];

  return aliases.some(
    ([firstAlias, secondAlias]) =>
      (first === firstAlias && second === secondAlias) ||
      (first === secondAlias && second === firstAlias)
  );
}

function getDisplayIngredientName(name: string) {
  const normalizedName = normalizeIngredientName(name);

  if (normalizedName === "징크PCA" || normalizedName === "징크") {
    return "징크";
  }

  return name;
}

function getCareIngredientName(product: CareRecommendedProduct) {
  return product.ingredientName ?? product.categories?.[0] ?? "";
}

function getIngredientCardInfo(name: string): IngredientCardInfo {
  const normalizedName = name.trim();

  const matchedInfo = INGREDIENT_CARD_INFO[normalizedName];

  if (matchedInfo) {
    return matchedInfo;
  }

  const matchedEntry = Object.entries(INGREDIENT_CARD_INFO).find(
    ([ingredientName]) =>
      normalizeIngredientName(ingredientName) ===
      normalizeIngredientName(normalizedName)
  );

  if (matchedEntry) {
    return matchedEntry[1];
  }

  return {
    categories: ["추천 성분"],
    description: `${name} 성분을 활용한 맞춤 제품을 확인해보세요.`,
  };
}

function getIngredientImage(
  category: DisplayIngredientCategory,
  ingredientName: string
) {
  const normalizedName = normalizeIngredientName(ingredientName);

  if (category === "ROUTINE_STEP") {
    if (normalizedName === "비타민C" || normalizedName === "나이아신아마이드") {
      return "/assets/Ingridient_yellow.svg";
    }

    if (
      normalizedName === "히알루론산" ||
      normalizedName === "판테놀" ||
      normalizedName === "세라마이드"
    ) {
      return "/assets/Ingridient_pink.svg";
    }

    if (
      normalizedName === "센텔라" ||
      normalizedName === "알로에" ||
      normalizedName === "알로에베라"
    ) {
      return "/assets/Ingridient_clover.svg";
    }
  }

  switch (category) {
    case "VITAMIN":
      return "/assets/Ingridient_yellow.svg";

    case "MOISTURE":
      return "/assets/Ingridient_pink.svg";

    case "PLANT_EXTRACT":
      return "/assets/Ingridient_clover.svg";

    default:
      return "/assets/Ingridient_pink.svg";
  }
}

function isProductCategory(
  value: string | null | undefined
): value is ProductCategory {
  return (
    value === "CLEANSER" ||
    value === "SKIN_TONER" ||
    value === "AMPOULE_SERUM" ||
    value === "CREAM" ||
    value === "MIST_OIL"
  );
}

export default function RecommendProduct() {
  const navigate = useNavigate();

  const location = useLocation();

  const [searchParams] = useSearchParams();

  const locationState = location.state as RecommendProductLocationState | null;

  const pageRef = useRef<HTMLDivElement>(null);

  const ingredientScrollRef = useRef<HTMLDivElement>(null);

  const productCategoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isProgrammaticScrollRef = useRef(false);

  const hasInitialCenteredRef = useRef(false);

  const dragStartXRef = useRef(0);

  const dragStartScrollLeftRef = useRef(0);

  const draggingPointerIdRef = useRef<number | null>(null);

  const [isDraggingIngredient, setIsDraggingIngredient] = useState(false);

  const fromCare = searchParams.get("from") === "care";

  const careRecommendedProducts = locationState?.recommendedProducts;

  const careRecommendedIngredientNames =
    locationState?.recommendedIngredientNames;

  /*
   * TodayRoutineSummary에서 전달되는
   * 실제 ID 포함 전체 루틴 성분.
   */
  const careRecommendedIngredients = locationState?.recommendedIngredients;

  const hasCareRecommendedIngredientsState =
    fromCare &&
    Array.isArray(careRecommendedIngredients) &&
    careRecommendedIngredients.length > 0;

  const hasCareRecommendedProductsState =
    fromCare &&
    Array.isArray(careRecommendedProducts) &&
    careRecommendedProducts.length > 0;

  const hasCareRecommendedIngredientNamesState =
    fromCare &&
    Array.isArray(careRecommendedIngredientNames) &&
    careRecommendedIngredientNames.length > 0;

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

  /*
   * FinishRoutine에서 전달된
   * recommendedProducts의 성분.
   */
  const careIngredients = useMemo<DisplayIngredient[]>(() => {
    if (!Array.isArray(careRecommendedProducts)) {
      return [];
    }

    const ingredientMap = new Map<number, DisplayIngredient>();

    careRecommendedProducts.forEach((product) => {
      const ingredientId = product.ingredientId;

      const ingredientName = getCareIngredientName(product);

      if (
        ingredientId === undefined ||
        ingredientId === null ||
        !ingredientName
      ) {
        return;
      }

      if (!ingredientMap.has(ingredientId)) {
        ingredientMap.set(ingredientId, {
          id: ingredientId,
          name: ingredientName,
          category: "ROUTINE_STEP",
        });
      }
    });

    return Array.from(ingredientMap.values());
  }, [careRecommendedProducts]);

  const [ingredients, setIngredients] = useState<DisplayIngredient[]>([]);

  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | null
  >(initialIngredientId);

  const [selectedProductCategory, setSelectedProductCategory] =
    useState<ProductCategory | null>(initialProductCategory);

  const [products, setProducts] = useState<DisplayProduct[]>([]);

  const [loadedProductKey, setLoadedProductKey] = useState<string | null>(null);

  const [isIngredientLoading, setIsIngredientLoading] = useState(true);

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const displayedIngredients = useMemo(() => {
    if (fromCare || ingredients.length <= 1) {
      return ingredients;
    }

    return [...ingredients, ...ingredients, ...ingredients];
  }, [fromCare, ingredients]);

  const currentProductKey =
    selectedIngredientId === null
      ? null
      : `${selectedIngredientId}-${selectedProductCategory ?? "ALL"}`;

  const isProductLoading =
    currentProductKey !== null && loadedProductKey !== currentProductKey;

  const visibleProducts =
    selectedIngredientId === null || isProductLoading ? [] : products;

  const hasNoRoutine =
    !fromCare && !isIngredientLoading && ingredients.length === 0;

  const hasNoCareRecommendations =
    fromCare && !isIngredientLoading && ingredients.length === 0;

  const hasNoProducts =
    !hasNoRoutine &&
    !hasNoCareRecommendations &&
    !isIngredientLoading &&
    !isProductLoading &&
    selectedIngredientId !== null &&
    visibleProducts.length === 0;

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
   * ==========================
   * 성분 조회
   * ==========================
   */
  useEffect(() => {
    let isCancelled = false;

    hasInitialCenteredRef.current = false;

    async function fetchIngredients() {
      setIsIngredientLoading(true);

      /*
       * ==================================
       * 1.
       * TodayRoutineSummary → 더보기
       * ==================================
       *
       * 실제 ingredientId를 이미 알고 있으므로
       * 어떤 추가 성분 API도 호출하지 않는다.
       */
      if (
        hasCareRecommendedIngredientsState &&
        Array.isArray(careRecommendedIngredients)
      ) {
        const routineIngredients: DisplayIngredient[] =
          careRecommendedIngredients.map((ingredient) => ({
            id: ingredient.id,

            name: ingredient.name,

            category: "ROUTINE_STEP",
          }));

        console.log(
          "🔥 TodayRoutineSummary 전체 루틴 성분카드:",
          routineIngredients
        );

        setIngredients(routineIngredients);

        if (routineIngredients.length > 0) {
          setSelectedIngredientId(routineIngredients[0].id);
        } else {
          setSelectedIngredientId(null);
        }

        setSelectedProductCategory(initialProductCategory);

        setIsIngredientLoading(false);

        return;
      }

      /*
       * ==================================
       * 2.
       * FinishSelectRoutine → 더보기
       * ==================================
       *
       * 현재는 ingredientId를 별도 API로
       * 찾아야 하는 기존 구조 유지.
       */
      if (
        hasCareRecommendedIngredientNamesState &&
        Array.isArray(careRecommendedIngredientNames)
      ) {
        try {
          const availableIngredients =
            await productApi.getRecommendedIngredients();

          if (isCancelled) {
            return;
          }

          console.log("🔥 실제 추천 성분 목록:", availableIngredients);

          console.log(
            "🔥 선택 루틴 성분 이름:",
            careRecommendedIngredientNames
          );

          const matchedIngredients: DisplayIngredient[] = [];

          careRecommendedIngredientNames.forEach((ingredientName) => {
            const matchedIngredient = availableIngredients.find((ingredient) =>
              isSameIngredientName(ingredient.name, ingredientName)
            );

            if (!matchedIngredient) {
              console.warn("⚠️ 실제 ingredientId 매칭 실패:", ingredientName);

              return;
            }

            matchedIngredients.push({
              id: matchedIngredient.id,

              name: ingredientName,

              category: "ROUTINE_STEP",
            });
          });

          setIngredients(matchedIngredients);

          if (matchedIngredients.length > 0) {
            setSelectedIngredientId(matchedIngredients[0].id);
          } else {
            setSelectedIngredientId(null);
          }

          setSelectedProductCategory(initialProductCategory);
        } catch (error) {
          if (isCancelled) {
            return;
          }

          console.error("선택 루틴 성분 조회 실패:", error);

          setIngredients([]);
          setSelectedIngredientId(null);
        } finally {
          if (!isCancelled) {
            setIsIngredientLoading(false);
          }
        }

        return;
      }

      /*
       * ==================================
       * 3.
       * FinishRoutine
       * ==================================
       */
      if (hasCareRecommendedProductsState) {
        setIngredients(careIngredients);

        if (careIngredients.length > 0) {
          setSelectedIngredientId(careIngredients[0].id);
        } else {
          setSelectedIngredientId(null);
        }

        setSelectedProductCategory(initialProductCategory);

        setIsIngredientLoading(false);

        return;
      }

      /*
       * ==================================
       * 4.
       * ThirdFocusCare / ThirdDailyCare
       * 개별 성분 버튼
       * ==================================
       */
      if (fromCare && initialIngredientId !== null && requestedIngredientName) {
        const stepIngredient: DisplayIngredient = {
          id: initialIngredientId,

          name: requestedIngredientName,

          category: "ROUTINE_STEP",
        };

        setIngredients([stepIngredient]);

        setSelectedIngredientId(initialIngredientId);

        setSelectedProductCategory(initialProductCategory);

        setIsIngredientLoading(false);

        return;
      }

      /*
       * ==================================
       * 5.
       * 일반 제품 탭
       * ==================================
       */
      try {
        const response = await productApi.getRecommendedIngredients();

        if (isCancelled) {
          return;
        }

        setIngredients(response);

        if (response.length > 0) {
          setSelectedIngredientId(response[0].id);
        } else {
          setSelectedIngredientId(null);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("추천 성분 조회 실패:", error);

        setIngredients([]);
        setSelectedIngredientId(null);
      } finally {
        if (!isCancelled) {
          setIsIngredientLoading(false);
        }
      }
    }

    void fetchIngredients();

    return () => {
      isCancelled = true;
    };
  }, [
    fromCare,

    hasCareRecommendedIngredientsState,
    careRecommendedIngredients,

    hasCareRecommendedIngredientNamesState,
    careRecommendedIngredientNames,

    hasCareRecommendedProductsState,
    careIngredients,

    initialIngredientId,
    initialProductCategory,
    requestedIngredientName,
  ]);

  /*
   * ==========================
   * 제품 조회
   * ==========================
   *
   * 실제 ingredientId 기준으로
   * 해당 성분의 모든 추천 제품 조회.
   */
  useEffect(() => {
    if (selectedIngredientId === null) {
      return;
    }

    let isCancelled = false;

    const ingredientId = selectedIngredientId;

    const productKey = `${ingredientId}-${selectedProductCategory ?? "ALL"}`;

    async function fetchProducts() {
      try {
        console.log("🔥 성분 전체 제품 요청:", {
          ingredientId,
          productCategory: selectedProductCategory,
        });

        const response: RecommendedProduct[] =
          await productApi.getRecommendedProducts(
            ingredientId,
            selectedProductCategory ?? undefined
          );

        if (isCancelled) {
          return;
        }

        console.log("🔥 성분 전체 제품 응답:", {
          ingredientId,
          productCategory: selectedProductCategory,
          products: response,
        });

        setProducts(response);

        setLoadedProductKey(productKey);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("추천 제품 조회 실패:", error);

        setProducts([]);

        setLoadedProductKey(productKey);
      }
    }

    void fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [selectedIngredientId, selectedProductCategory]);

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

    window.setTimeout(
      () => {
        isProgrammaticScrollRef.current = false;
      },
      behavior === "smooth" ? 350 : 50
    );
  }

  useEffect(() => {
    const container = ingredientScrollRef.current;

    if (
      !container ||
      ingredients.length === 0 ||
      selectedIngredientId === null ||
      hasInitialCenteredRef.current
    ) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>("[data-ingredient-id]")
      );

      if (cards.length === 0) {
        return;
      }

      let targetCard: HTMLElement | undefined;

      if (fromCare || ingredients.length === 1) {
        targetCard = cards.find(
          (card) => Number(card.dataset.ingredientId) === selectedIngredientId
        );
      } else {
        const ingredientCount = ingredients.length;

        targetCard = cards.find(
          (card, index) =>
            index >= ingredientCount &&
            index < ingredientCount * 2 &&
            Number(card.dataset.ingredientId) === selectedIngredientId
        );
      }

      if (!targetCard) {
        return;
      }

      scrollCardToCenter(targetCard, "auto");

      hasInitialCenteredRef.current = true;
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [fromCare, ingredients, selectedIngredientId, displayedIngredients]);

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

  function getClosestIngredientCard() {
    const container = ingredientScrollRef.current;

    if (!container) {
      return null;
    }

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-ingredient-id]")
    );

    if (cards.length === 0) {
      return null;
    }

    const containerRect = container.getBoundingClientRect();

    const containerCenter = containerRect.left + containerRect.width / 2;

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

    return {
      cards,
      closestCard,
      closestCardIndex,
    };
  }

  function updateSelectedIngredient() {
    const result = getClosestIngredientCard();

    if (!result) {
      return;
    }

    const { cards, closestCard, closestCardIndex } = result;

    const ingredientIdText = closestCard.dataset.ingredientId;

    if (!ingredientIdText) {
      return;
    }

    const nextIngredientId = Number(ingredientIdText);

    if (nextIngredientId !== selectedIngredientId) {
      setSelectedIngredientId(nextIngredientId);

      setSelectedProductCategory(null);
    }

    if (fromCare || ingredients.length <= 1) {
      return;
    }

    const ingredientCount = ingredients.length;

    if (closestCardIndex < ingredientCount) {
      const equivalentIndex = closestCardIndex + ingredientCount;

      const equivalentCard = cards[equivalentIndex];

      if (equivalentCard) {
        const container = ingredientScrollRef.current;

        if (!container) {
          return;
        }

        const targetScrollLeft =
          equivalentCard.offsetLeft +
          equivalentCard.offsetWidth / 2 -
          container.clientWidth / 2;

        isProgrammaticScrollRef.current = true;

        container.scrollLeft = targetScrollLeft;

        requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      }

      return;
    }

    if (closestCardIndex >= ingredientCount * 2) {
      const equivalentIndex = closestCardIndex - ingredientCount;

      const equivalentCard = cards[equivalentIndex];

      if (equivalentCard) {
        const container = ingredientScrollRef.current;

        if (!container) {
          return;
        }

        const targetScrollLeft =
          equivalentCard.offsetLeft +
          equivalentCard.offsetWidth / 2 -
          container.clientWidth / 2;

        isProgrammaticScrollRef.current = true;

        container.scrollLeft = targetScrollLeft;

        requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      }
    }
  }

  function handleIngredientScroll() {
    if (isProgrammaticScrollRef.current || isDraggingIngredient) {
      return;
    }

    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = window.setTimeout(() => {
      if (isProgrammaticScrollRef.current || isDraggingIngredient) {
        return;
      }

      updateSelectedIngredient();

      scrollEndTimerRef.current = null;
    }, 100);
  }

  function handleIngredientPointerDown(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (ingredients.length <= 1 || event.pointerType !== "mouse") {
      return;
    }

    const container = ingredientScrollRef.current;

    if (!container) {
      return;
    }

    draggingPointerIdRef.current = event.pointerId;

    dragStartXRef.current = event.clientX;

    dragStartScrollLeftRef.current = container.scrollLeft;

    setIsDraggingIngredient(true);

    container.setPointerCapture(event.pointerId);

    event.preventDefault();
  }

  function handleIngredientPointerMove(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (
      !isDraggingIngredient ||
      event.pointerType !== "mouse" ||
      draggingPointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const container = ingredientScrollRef.current;

    if (!container) {
      return;
    }

    const moveX = event.clientX - dragStartXRef.current;

    container.scrollLeft = dragStartScrollLeftRef.current - moveX;

    event.preventDefault();
  }

  function finishIngredientDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      draggingPointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const container = ingredientScrollRef.current;

    if (container?.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }

    draggingPointerIdRef.current = null;

    setIsDraggingIngredient(false);

    window.setTimeout(() => {
      updateSelectedIngredient();
    }, 80);
  }

  function handleIngredientPointerCancel(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (draggingPointerIdRef.current !== event.pointerId) {
      return;
    }

    draggingPointerIdRef.current = null;

    setIsDraggingIngredient(false);
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

  function handleStartDailyRoutine() {
    navigate("/care/daily_care");
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

          {hasNoRoutine ? (
            <S.EmptyIngredientCardArea>
              <S.EmptyIngredientCard>
                <S.EmptyIngredientLogo
                  src="/assets/HALE.svg"
                  alt=""
                  aria-hidden="true"
                />

                <S.EmptyIngredientInfo>
                  <S.EmptyIngredientTitle>
                    오늘의 맞춤 성분
                  </S.EmptyIngredientTitle>

                  <S.EmptyIngredientDescription>
                    루틴을 시작하고 찾아보세요
                  </S.EmptyIngredientDescription>
                </S.EmptyIngredientInfo>
              </S.EmptyIngredientCard>
            </S.EmptyIngredientCardArea>
          ) : hasNoCareRecommendations ? (
            <S.EmptyIngredientCardArea>
              <S.EmptyIngredientCard>
                <S.EmptyIngredientLogo
                  src="/assets/HALE.svg"
                  alt=""
                  aria-hidden="true"
                />

                <S.EmptyIngredientInfo>
                  <S.EmptyIngredientTitle>
                    추천 성분이 없어요
                  </S.EmptyIngredientTitle>

                  <S.EmptyIngredientDescription>
                    현재 추천 가능한 성분을 찾지 못했어요
                  </S.EmptyIngredientDescription>
                </S.EmptyIngredientInfo>
              </S.EmptyIngredientCard>
            </S.EmptyIngredientCardArea>
          ) : (
            <S.IngredientScroll
              ref={ingredientScrollRef}
              $isDragging={isDraggingIngredient}
              $isScrollable={ingredients.length > 1}
              onScroll={handleIngredientScroll}
              onPointerDown={handleIngredientPointerDown}
              onPointerMove={handleIngredientPointerMove}
              onPointerUp={finishIngredientDrag}
              onPointerCancel={handleIngredientPointerCancel}
              onDragStart={(event) => event.preventDefault()}
            >
              {displayedIngredients.map((ingredient, index) => {
                const cardInfo = getIngredientCardInfo(ingredient.name);

                const displayIngredientName = getDisplayIngredientName(
                  ingredient.name
                );

                return (
                  <S.IngredientCardWrapper
                    key={`${ingredient.id}-${index}`}
                    data-ingredient-id={ingredient.id}
                  >
                    <RecommendedIngredientCard
                      category={cardInfo.categories}
                      ingredient={displayIngredientName}
                      description={cardInfo.description}
                      image={getIngredientImage(
                        ingredient.category,
                        ingredient.name
                      )}
                    />
                  </S.IngredientCardWrapper>
                );
              })}
            </S.IngredientScroll>
          )}
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

          {hasNoRoutine ? (
            <S.NoRoutineArea>
              <S.NoRoutineContent>
                <S.NoRoutineDescription>
                  오늘의 루틴을 시작하고
                  <br />
                  추천 성분의 제품을 받아보세요.
                </S.NoRoutineDescription>

                <S.StartRoutineButton
                  type="button"
                  onClick={handleStartDailyRoutine}
                >
                  오늘의 루틴 시작하기
                </S.StartRoutineButton>
              </S.NoRoutineContent>
            </S.NoRoutineArea>
          ) : hasNoCareRecommendations ? (
            <S.EmptyProductArea>
              <S.EmptyProductContent>
                <S.EmptyProductTitle>추천 제품이 없어요</S.EmptyProductTitle>

                <S.EmptyProductDescription>
                  현재 신규 상품을 검수 및 업데이트하고 있습니다.
                  <br />
                  빠른 시일 내에 찾아뵙겠습니다.
                </S.EmptyProductDescription>
              </S.EmptyProductContent>
            </S.EmptyProductArea>
          ) : hasNoProducts ? (
            <S.EmptyProductArea>
              <S.EmptyProductContent>
                <S.EmptyProductTitle>
                  해당하는 성분의 제품이 없어요
                </S.EmptyProductTitle>

                <S.EmptyProductDescription>
                  현재 신규 상품을 검수 및 업데이트하고 있습니다.
                  <br />
                  빠른 시일 내에 찾아뵙겠습니다.
                </S.EmptyProductDescription>
              </S.EmptyProductContent>
            </S.EmptyProductArea>
          ) : (
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
          )}
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
