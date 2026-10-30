// [아카이빙용 목 데이터] 백엔드 서버 종료 후 데일리 코스·제품 추천 흐름을 프론트만으로 체험할 수 있도록 사용

import type {
  CurrentCourseResponse,
  RoutineTypeCode,
  RoutineTypeIngredient,
  StartCourseResponse,
  SymptomSummaryResponse,
} from "../api/course";
import type { DiagnosisResponse, Difficulty } from "../api/diagnosis";
import type { RecommendedIngredient } from "../api/product";
import type {
  RecommendedRoutineProduct,
  RoutineCompletionData,
  RoutineDifficultyResponse,
  RoutineStep,
} from "../api/routine";
import {
  MOCK_COMPLETION_DATA,
  MOCK_DIFFICULTY_OPTIONS,
  MOCK_FOCUS_COURSE,
} from "./focusCare";
import {
  MOCK_INGREDIENTS,
  getMockIngredient,
  getMockRoutineProducts,
} from "./products";

interface StoredDailyCourse {
  courseId: number;
  routineTypeCode: RoutineTypeCode;
}

const MOCK_DAILY_COURSE_ID = 2;

// 기획: 데일리 루틴 종류 (수분충전이 기본값)
export const DEFAULT_ROUTINE_TYPE_CODE: RoutineTypeCode = "HYDRATION";

const DAILY_ROUTINES: Record<
  RoutineTypeCode,
  { name: string; ingredients: string[] }
> = {
  COOLDOWN: { name: "쿨다운 루틴", ingredients: ["센텔라", "판테놀", "알로에"] },
  CLEAR_UP: {
    name: "클리어업 루틴",
    ingredients: ["나이아신아마이드", "비타민C"],
  },
  SEBUM_CONTROL: {
    name: "피지컨트롤 루틴",
    ingredients: ["나이아신아마이드", "징크"],
  },
  HYDRATION: {
    name: "수분충전 루틴",
    ingredients: ["히알루론산", "세라마이드", "판테놀"],
  },
};

const today = () => new Date().toISOString().slice(0, 10);

// FinishFocusCare에서 데일리 코스 시작 시 저장하는 값을 진행 중인 데일리 코스로 간주
export const getStoredMockDailyCourse = (): StoredDailyCourse | null => {
  try {
    const stored = sessionStorage.getItem("currentDailyCourse");

    return stored ? (JSON.parse(stored) as StoredDailyCourse) : null;
  } catch {
    return null;
  }
};

// GET /api/courses/current (데일리 코스 진행 중) 대체
export const getMockCurrentDailyCourse = (
  routineTypeCode: RoutineTypeCode = DEFAULT_ROUTINE_TYPE_CODE
): CurrentCourseResponse => ({
  courseId: getStoredMockDailyCourse()?.courseId ?? MOCK_DAILY_COURSE_ID,
  courseType: "DAILY",
  // 홈 배지가 "{label} 루틴 D+n" 형태라 "루틴"을 뺀 이름 사용 (예: 수분충전)
  label: DAILY_ROUTINES[routineTypeCode].name.replace(" 루틴", ""),
  startedAt: today(),
  streakDays: 1,
});

// GET /api/courses/current 대체
// 데일리 코스를 시작(저장)했으면 데일리, 아니면 체험 시작 상태인 집중 코스
export const getMockCurrentCourse = (): CurrentCourseResponse => {
  const dailyCourse = getStoredMockDailyCourse();

  return dailyCourse
    ? getMockCurrentDailyCourse(dailyCourse.routineTypeCode)
    : MOCK_FOCUS_COURSE;
};

// POST /api/courses/start 대체
export const createMockDailyCourse = (
  routineTypeCode: RoutineTypeCode
): StartCourseResponse => ({
  id: MOCK_DAILY_COURSE_ID,
  courseType: "DAILY",
  routineTypeCode,
  routineTypeName: DAILY_ROUTINES[routineTypeCode].name,
  startedAt: today(),
  endedAt: null,
  status: "IN_PROGRESS",
});

// GET /api/courses/{id}/symptom-summary 대체 (집중 코스 7일간 가장 많이 기록한 증상)
export const MOCK_SYMPTOM_SUMMARY: SymptomSummaryResponse = {
  topSymptoms: [
    { symptom: "REDNESS", count: 5 },
    { symptom: "HEAT", count: 3 },
  ],
  recommendedRoutineTypeCode: "COOLDOWN",
  recommendedRoutineTypeName: DAILY_ROUTINES.COOLDOWN.name,
};

// GET /api/products/recommendations/ingredients 대체
// 데일리 코스 진행 중이면 해당 루틴 성분, 아니면 집중 코스(초기 회복 단계) 추천 성분
export const getMockRecommendedIngredients = (): RecommendedIngredient[] => {
  const dailyCourse = getStoredMockDailyCourse();

  const ingredientNames = dailyCourse
    ? DAILY_ROUTINES[dailyCourse.routineTypeCode].ingredients
    : MOCK_COMPLETION_DATA.recommendedIngredients;

  return ingredientNames
    .map((name) => getMockIngredient(name))
    .filter(
      (ingredient): ingredient is RecommendedIngredient =>
        ingredient !== undefined
    );
};

// ===== 데일리 케어 1~3단계·완료 =====

const INGREDIENT_ID: Record<string, number> = Object.fromEntries(
  MOCK_INGREDIENTS.map(({ id, name }) => [name, id])
);

const ROUTINE_TYPE_CODES: RoutineTypeCode[] = [
  "COOLDOWN",
  "CLEAR_UP",
  "SEBUM_CONTROL",
  "HYDRATION",
];

const getDailyRoutineId = (routineTypeCode: RoutineTypeCode) =>
  10 + ROUTINE_TYPE_CODES.indexOf(routineTypeCode);

// 전달받은 루틴 코드 → 저장된 데일리 코스 → 기본값(수분충전) 순으로 결정
export const resolveMockRoutineTypeCode = (
  routineTypeCode?: RoutineTypeCode | null
): RoutineTypeCode =>
  routineTypeCode ??
  getStoredMockDailyCourse()?.routineTypeCode ??
  DEFAULT_ROUTINE_TYPE_CODE;

type StepInput = [
  stepName: string,
  category: RoutineStep["category"],
  productText: string,
  methodText: string,
  alternateText: string | null,
  ingredients: string[],
];

const DAILY_ROUTINE_DETAILS: Record<
  RoutineTypeCode,
  { reasonText: string; completionSummaryText: string; steps: StepInput[] }
> = {
  COOLDOWN: {
    reasonText:
      "쉽게 붉어지고 예민해진 피부를 위해 센텔라·판테놀·알로에 같은 진정 성분 위주로 구성했어요.",
    completionSummaryText:
      "붉은기와 열감이 느껴지는 피부라 진정 성분 위주의 쿨다운 루틴을 추천했어요",
    steps: [
      ["토너", "SKIN_TONER", "판테놀 성분의 토너", "화장솜 대신 손바닥으로 가볍게 눌러 흡수", "판테놀이 없다면 알로에 성분도 좋아요", ["판테놀", "알로에"]],
      ["세럼", "AMPOULE_SERUM", "센텔라 성분의 세럼", "붉은 부위를 문지르지 말고 부드럽게 눌러 흡수", "센텔라가 없다면 판테놀을 우선 사용해요", ["센텔라", "판테놀"]],
      ["크림", "CREAM", "알로에 성분의 수딩젤·크림", "열감이 느껴지는 부위에 도톰하게 덧발라요", null, ["알로에"]],
    ],
  },
  CLEAR_UP: {
    reasonText:
      "칙칙한 피부톤과 여드름 흔적을 위해 나이아신아마이드·비타민C를 낮은 농도부터 천천히 사용하도록 구성했어요.",
    completionSummaryText:
      "피부톤과 흔적이 신경 쓰이는 피부라 순한 미백 성분 위주의 클리어업 루틴을 추천했어요",
    steps: [
      ["토너", "SKIN_TONER", "나이아신아마이드 성분의 토너", "손바닥으로 얼굴 전체에 가볍게 눌러 흡수", null, ["나이아신아마이드"]],
      ["세럼", "AMPOULE_SERUM", "비타민C 성분의 세럼", "흔적이 신경 쓰이는 부위에 소량 덧발라요", "따갑게 느껴지면 나이아신아마이드 세럼으로 바꿔요", ["비타민C", "나이아신아마이드"]],
      ["크림", "CREAM", "나이아신아마이드 성분의 크림", "얇게 펴 발라 수분이 날아가지 않게 마무리해요", null, ["나이아신아마이드"]],
    ],
  },
  SEBUM_CONTROL: {
    reasonText:
      "피지와 트러블 재발을 막기 위해 나이아신아마이드·징크로 유수분 밸런스를 맞추도록 구성했어요.",
    completionSummaryText:
      "번들거림과 트러블이 고민인 피부라 피지 조절 성분 위주의 피지컨트롤 루틴을 추천했어요",
    steps: [
      ["토너", "SKIN_TONER", "나이아신아마이드 성분의 토너", "피지가 많은 T존 위주로 가볍게 흡수", null, ["나이아신아마이드"]],
      ["세럼", "AMPOULE_SERUM", "징크 성분의 세럼", "번들거리는 부위에 얇게 펴 발라요", "징크가 없다면 나이아신아마이드를 우선 사용해요", ["징크", "나이아신아마이드"]],
      ["크림", "CREAM", "징크 성분의 가벼운 크림", "유분이 적은 제형을 얇게 발라 마무리해요", null, ["징크"]],
    ],
  },
  HYDRATION: {
    reasonText:
      "건조하고 당기는 피부를 위해 히알루론산으로 수분을 채우고 세라마이드로 장벽을 지키도록 구성했어요.",
    completionSummaryText:
      "건조함과 당김이 느껴지는 피부라 수분과 장벽 강화 위주의 수분충전 루틴을 추천했어요",
    steps: [
      ["토너", "SKIN_TONER", "히알루론산 성분의 토너", "여러 번 나눠 레이어링해 수분을 채워요", null, ["히알루론산"]],
      ["세럼", "AMPOULE_SERUM", "판테놀·히알루론산 성분의 세럼", "건조한 부위에 가볍게 두드려 흡수", "두 성분 모두 없다면 판테놀을 우선 사용해요", ["판테놀", "히알루론산"]],
      ["크림", "CREAM", "세라마이드 성분의 크림", "건조함과 각질이 느껴지는 부위에 덧발라요", "세라마이드가 없다면 판테놀을 우선 사용해요", ["세라마이드", "판테놀"]],
    ],
  },
};

const getDailyRoutineSteps = (routineTypeCode: RoutineTypeCode): RoutineStep[] => {
  const baseStepId = getDailyRoutineId(routineTypeCode) * 10;

  const cleansingStep: RoutineStep = {
    stepId: baseStepId + 1,
    order: 1,
    stepName: "클렌징",
    category: "CLEANSER",
    productText: "순한 약산성 클렌저",
    methodText: "미온수로 충분히 적신 뒤 손끝으로 부드럽게 세안",
    alternateText: null,
    ingredients: [],
  };

  return [
    cleansingStep,
    ...DAILY_ROUTINE_DETAILS[routineTypeCode].steps.map(
      (
        [stepName, category, productText, methodText, alternateText, ingredients],
        index
      ): RoutineStep => ({
        stepId: baseStepId + index + 2,
        order: index + 2,
        stepName,
        category,
        productText,
        methodText,
        alternateText,
        ingredients: ingredients.map((name, ingredientIndex) => ({
          ingredientId: INGREDIENT_ID[name],
          role: ingredientIndex === 0 ? "PRIMARY" : "ALTERNATE",
        })),
      })
    ),
  ];
};

// POST /api/diagnoses (데일리) 대체
export const createMockDailyDiagnosis = (
  selectedConditions: string[],
  routineTypeCode?: RoutineTypeCode
): DiagnosisResponse => {
  const resolvedCode = resolveMockRoutineTypeCode(routineTypeCode);
  const routineName = DAILY_ROUTINES[resolvedCode].name;

  const conditions = selectedConditions.filter(
    (condition) => condition !== "해당없음"
  );

  const summaryText =
    conditions.length > 0
      ? `오늘은 ${conditions.join(", ")} 고민이 있어요. ${routineName}으로 피부 컨디션을 관리해 보세요`
      : `오늘 피부는 비교적 안정적인 상태예요. ${routineName}으로 지금 컨디션을 이어가 보세요`;

  return {
    diagnosisId: 2,
    routineId: getDailyRoutineId(resolvedCode),
    rednessScore: null,
    textureScore: null,
    blemishScore: null,
    summaryText,
    difficultyOptions: MOCK_DIFFICULTY_OPTIONS,
  };
};

// POST /api/routines/{id}/difficulty (데일리) 대체
export const getMockDailyRoutine = (
  routineTypeCode: RoutineTypeCode | undefined,
  difficulty: Difficulty
): RoutineDifficultyResponse => {
  const resolvedCode = resolveMockRoutineTypeCode(routineTypeCode);
  const option = MOCK_DIFFICULTY_OPTIONS.find(
    (difficultyOption) => difficultyOption.difficulty === difficulty
  );

  return {
    routineId: getDailyRoutineId(resolvedCode),
    difficulty,
    title: `${DAILY_ROUTINES[resolvedCode].name} · ${option?.title ?? ""}`,
    estimatedMinutes: option?.estimatedMinutes ?? 10,
    reasonText: DAILY_ROUTINE_DETAILS[resolvedCode].reasonText,
    steps: getDailyRoutineSteps(resolvedCode),
  };
};

// POST /api/routines/{id}/complete (데일리) 대체
export const createMockDailyCompletion = (
  routineTypeCode?: RoutineTypeCode
): RoutineCompletionData => {
  const resolvedCode = resolveMockRoutineTypeCode(routineTypeCode);

  return {
    completionSummaryText:
      DAILY_ROUTINE_DETAILS[resolvedCode].completionSummaryText,
    recommendedIngredients: DAILY_ROUTINES[resolvedCode].ingredients,
    completedAt: new Date().toISOString(),
  };
};

// GET /api/routines/{id}/recommended-products (데일리) 대체
export const getMockDailyRecommendedProducts = (
  routineTypeCode?: RoutineTypeCode
): RecommendedRoutineProduct[] =>
  getMockRoutineProducts(
    DAILY_ROUTINES[resolveMockRoutineTypeCode(routineTypeCode)].ingredients
  );

// GET /api/courses/routine-types/{code}/ingredients 대체
export const getMockRoutineTypeIngredients = (
  routineTypeCode: RoutineTypeCode
): RoutineTypeIngredient[] =>
  DAILY_ROUTINES[routineTypeCode].ingredients.map((ingredientName) => ({
    ingredientId: INGREDIENT_ID[ingredientName],
    ingredientName,
  }));
