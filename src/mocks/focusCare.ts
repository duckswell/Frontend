// [아카이빙용 목 데이터] 백엔드 서버 종료 후 집중 케어 흐름을 프론트만으로 체험할 수 있도록 사용
// 실제 서비스 데이터가 아닌 예시 데이터입니다.

import type { CurrentCourseResponse } from "../api/course";
import type {
  DiagnosisResponse,
  Difficulty,
  DifficultyOption,
} from "../api/diagnosis";
import type {
  RecommendedRoutineProduct,
  RoutineCompletionData,
  RoutineDifficultyResponse,
  RoutineStep,
  RoutineStepSummary,
} from "../api/routine";
import { MOCK_INGREDIENTS, getMockRoutineProducts } from "./products";

// 로딩 애니메이션이 자연스럽게 보이도록 API 응답 대기 시간을 흉내냄
export const mockDelay = (ms = 1500) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const MOCK_FOCUS_COURSE: CurrentCourseResponse = {
  courseId: 1,
  courseType: "FOCUS",
  label: "집중 코스",
  startedAt: new Date().toISOString().slice(0, 10),
  streakDays: 7,
};

// 기획: 집중 코스 7일 고정, 회복 단계 초기(1-3일차)·중기(4-6일차)·후기(6-7일 이후)
// 체험용으로 집중 코스 마지막 날인 7일차 기준 (루틴 완료 후 집중 코스 완료 화면으로 이어짐)
export const MOCK_RECOVERY_DAY_TEXT = "시술 후 7일째";

export const MOCK_RECOVERY_SUMMARY =
  "붉은기와 각질이 거의 가라앉았어요. 마지막 날까지 자극 없이 관리해 주세요.";

export const MOCK_PHOTO_ID = "mock-photo-id";

const MOCK_ROUTINE_ID = 1;

// 디자인 시안의 집중 루틴 4단계 (STEP 1 클렌징은 추천 성분이 없어 제품 버튼 미노출)
const MOCK_ROUTINE_STEPS: RoutineStep[] = [
  {
    stepId: 1,
    order: 1,
    stepName: "클렌징",
    category: "CLEANSER",
    productText: "순한 약산성 클렌저",
    methodText: "미온수로 충분히 적신 뒤 손끝으로 부드럽게 세안",
    alternateText: null,
    ingredients: [],
  },
  {
    stepId: 2,
    order: 2,
    stepName: "토너",
    category: "SKIN_TONER",
    productText: "히알루론산·판테놀 성분의 토너",
    methodText: "화장솜 대신 손바닥으로 가볍게 눌러 흡수",
    alternateText: "두 성분이 모두 없다면 OOO 성분도 좋아요",
    ingredients: [
      { ingredientId: 4, role: "PRIMARY" },
      { ingredientId: 1, role: "ALTERNATE" },
    ],
  },
  {
    stepId: 3,
    order: 3,
    stepName: "세럼",
    category: "AMPOULE_SERUM",
    productText: "센텔라·판테놀 성분의 세럼",
    methodText: "붉은 부위를 문지르지 말고 부드럽게 눌러 흡수",
    alternateText: "두 성분 모두 없다면 센텔라를 우선 사용해요",
    ingredients: [
      { ingredientId: 2, role: "PRIMARY" },
      { ingredientId: 1, role: "ALTERNATE" },
    ],
  },
  {
    stepId: 4,
    order: 4,
    stepName: "크림",
    category: "CREAM",
    productText: "세라마이드·판테놀 성분의 크림",
    methodText: "건조함과 각질이 느껴지는 부위에 덧발라요",
    alternateText: "세라마이드가 없다면 판테놀을 우선 사용해요",
    ingredients: [
      { ingredientId: 3, role: "PRIMARY" },
      { ingredientId: 1, role: "ALTERNATE" },
    ],
  },
];

export const MOCK_DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    difficulty: "LIGHT",
    title: "가벼운 관리",
    subtitle: "꼭 필요한 단계만 빠르게",
    stepPreview: "예) 진정 클렌징 → 토너 → 진정 세럼 → 크림",
    estimatedMinutes: 5,
  },
  {
    difficulty: "BASIC",
    title: "기본 관리",
    subtitle: "피부 상태에 필요한 관리를 균형 있게",
    stepPreview: "예) 진정 클렌징 → 토너 → 추천 세럼 → 마스크팩 → 크림",
    estimatedMinutes: 10,
  },
  {
    difficulty: "INTENSIVE",
    title: "꼼꼼한 관리",
    subtitle: "오늘 추천된 관리 단계를 빠짐없이",
    stepPreview:
      "예) 진정 클렌징 → 토너 → 추천 세럼 → 마스크팩 → 크림 → 추가 관리",
    estimatedMinutes: 15,
  },
];

export const MOCK_ROUTINES: Record<Difficulty, RoutineDifficultyResponse> = {
  LIGHT: {
    routineId: MOCK_ROUTINE_ID,
    difficulty: "LIGHT",
    title: "가벼운 진정 루틴",
    estimatedMinutes: 5,
    reasonText:
      "오늘은 피부가 예민할 수 있어 꼭 필요한 단계만 담았어요. 자극을 최소화하고 장벽을 지켜 주세요.",
    steps: MOCK_ROUTINE_STEPS,
  },
  BASIC: {
    routineId: MOCK_ROUTINE_ID,
    difficulty: "BASIC",
    title: "기본 진정 루틴",
    estimatedMinutes: 10,
    reasonText:
      "붉은기와 열감을 가라앉히는 진정 성분과 장벽 회복 성분을 함께 사용하는 루틴이에요.",
    steps: MOCK_ROUTINE_STEPS,
  },
  INTENSIVE: {
    routineId: MOCK_ROUTINE_ID,
    difficulty: "INTENSIVE",
    title: "집중 회복 루틴",
    estimatedMinutes: 15,
    reasonText:
      "진정 단계에 수분 공급을 더해 시술 후 건조해진 피부를 꼼꼼하게 채워 주는 루틴이에요.",
    steps: MOCK_ROUTINE_STEPS,
  },
};

export const createMockDiagnosis = (
  selectedConditions: string[]
): DiagnosisResponse => {
  // 기획 2.2.2: 홍조·트러블 2개 축을 전일 대비 자연어 한 줄로 요약
  const hasRedness = selectedConditions.some((condition) =>
    ["붉은기", "열감", "따가움"].includes(condition)
  );

  const summaryText = hasRedness
    ? "어제보다 붉은 기가 조금 가라앉았고, 트러블은 비슷한 수준이에요"
    : "어제보다 붉은 기가 많이 가라앉았고, 트러블은 비슷한 수준이에요";

  return {
    diagnosisId: 1,
    routineId: MOCK_ROUTINE_ID,
    rednessScore: null,
    textureScore: null,
    blemishScore: null,
    summaryText,
    difficultyOptions: MOCK_DIFFICULTY_OPTIONS,
  };
};

export const getMockRoutineStepSummaries = (
  routine: RoutineDifficultyResponse
): RoutineStepSummary[] =>
  routine.steps.map((step) => {
    const ingredientId = step.ingredients[0]?.ingredientId ?? null;

    return {
      stepId: step.stepId,
      stepName: step.stepName,
      category: step.category,
      ingredientId,
      ingredientName:
        MOCK_INGREDIENTS.find(({ id }) => id === ingredientId)?.name ?? null,
    };
  });

export const MOCK_COMPLETION_DATA: RoutineCompletionData = {
  // 기획 2.4.1: 분석 결과 → 루틴 추천 이유 한 줄
  completionSummaryText:
    "아직 붉은 기가 남아 있는 초기 회복 단계라 자극 없이 진정과 보습에 집중하는 루틴을 추천했어요",
  // 기획: 초기(1-3일차) 권장 성분
  recommendedIngredients: ["센텔라", "판테놀", "알로에"],
  completedAt: new Date().toISOString(),
};

// 초기 회복 단계 권장 성분(센텔라·판테놀·알로에)별 제품
export const MOCK_RECOMMENDED_PRODUCTS: RecommendedRoutineProduct[] =
  getMockRoutineProducts(MOCK_COMPLETION_DATA.recommendedIngredients);
