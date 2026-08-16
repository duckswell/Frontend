import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  courseApi,
  type CurrentCourseResponse,
  type RoutineTypeCode,
} from "../api/course";

import { NavBar } from "../components/NavBar";
import { TabBar } from "../components/TabBar";
import CareButton from "../components/CareButton";

import * as S from "../styles/DailyCare/DailyCare.styles";

interface DailyCareLocationState {
  courseId?: number;
  routineTypeCode?: RoutineTypeCode;
}

interface StoredDailyCourse {
  courseId: number;
  routineTypeCode: RoutineTypeCode;
}

interface DailyRoutineInfo {
  title: string;
  description: string;
  categories: string[];
}

const DAILY_ROUTINE_INFO: Record<RoutineTypeCode, DailyRoutineInfo> = {
  COOLDOWN: {
    title: "쿨다운 루틴",
    description: "쉽게 붉어지고 예민해지는 피부를 편안하게 진정해요",
    categories: ["붉은기", "열감", "민감함"],
  },

  CLEAR_UP: {
    title: "클리어업 루틴",
    description: "칙칙한 피부톤과 눈에 띄는 피부 흔적에 집중해요",
    categories: ["피부톤", "흔적", "미백"],
  },

  SEBUM_CONTROL: {
    title: "피지컨트롤 루틴",
    description: "과도한 피지가 고민인 피부를 산뜻하게 관리해요",
    categories: ["트러블", "피지", "기름기"],
  },

  HYDRATION: {
    title: "수분충전 루틴",
    description: "건조하고 당기는 피부에 수분을 채워 촉촉하게 관리해요",
    categories: ["갈라짐", "각질", "건조"],
  },
};

function getStoredDailyCourse(): StoredDailyCourse | null {
  try {
    const stored = sessionStorage.getItem("currentDailyCourse");

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as StoredDailyCourse;
  } catch (error) {
    console.error("저장된 데일리 코스 정보 읽기 실패:", error);
    return null;
  }
}

const ROUTINE_STEPS = [
  {
    step: "STEP 1",
    title: "피부 상태 확인",
    description:
      "민낯 사진을 촬영하거나 피부 고민을 기록하면 AI가 오늘의 상태를 분석해요",
  },
  {
    step: "STEP 2",
    title: "관리 강도 선택",
    description: "오늘 내가 원하는 만큼 편하게 관리해요",
  },
  {
    step: "STEP 3",
    title: "맞춤 루틴 진행",
    description: "AI가 피부 상태에 최적화된 맞춤 루틴을 안내해요",
  },
];

export default function DailyCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as DailyCareLocationState | null;

  const [currentCourse, setCurrentCourse] =
    useState<CurrentCourseResponse | null>(null);

  const [currentRoutineTypeCode, setCurrentRoutineTypeCode] =
    useState<RoutineTypeCode | null>(
      state?.routineTypeCode ?? getStoredDailyCourse()?.routineTypeCode ?? null
    );

  const [isLoadingCourse, setIsLoadingCourse] = useState(true);

  useEffect(() => {
    async function fetchCurrentCourse() {
      try {
        setIsLoadingCourse(true);

        const course = await courseApi.getCurrentCourse();

        if (!course) {
          console.error("현재 진행 중인 코스가 없습니다.");

          setCurrentCourse(null);
          return;
        }

        if (course.courseType !== "DAILY") {
          console.error(
            "DailyCare 페이지인데 현재 진행 중인 코스가 DAILY가 아닙니다.",
            course
          );

          setCurrentCourse(null);
          return;
        }

        setCurrentCourse(course);

        /*
         * 중요:
         * 백엔드 label은 루틴 판별에 사용하지 않는다.
         *
         * 1. navigate state
         * 2. sessionStorage
         */
        const stored = getStoredDailyCourse();

        let routineTypeCode: RoutineTypeCode | null =
          state?.routineTypeCode ?? null;

        if (!routineTypeCode && stored && stored.courseId === course.courseId) {
          routineTypeCode = stored.routineTypeCode;
        }

        console.log("DailyCare 현재 course:", course);
        console.log("DailyCare 전달 state:", state);
        console.log("DailyCare 저장 정보:", stored);
        console.log("DailyCare 최종 routineTypeCode:", routineTypeCode);

        if (!routineTypeCode) {
          console.error("현재 데일리 루틴 코드를 확인할 수 없습니다.");
          return;
        }

        setCurrentRoutineTypeCode(routineTypeCode);

        sessionStorage.setItem(
          "currentDailyCourse",
          JSON.stringify({
            courseId: course.courseId,
            routineTypeCode,
          })
        );
      } catch (error) {
        console.error("현재 DAILY 코스 조회 실패:", error);

        setCurrentCourse(null);
      } finally {
        setIsLoadingCourse(false);
      }
    }

    fetchCurrentCourse();
  }, [state?.routineTypeCode]);

  const currentRoutine =
    currentRoutineTypeCode !== null
      ? DAILY_ROUTINE_INFO[currentRoutineTypeCode]
      : null;

  /*
   * 절대 currentCourse.label로 fallback하지 않는다.
   * 우리 서비스의 4개 루틴 이름만 보여준다.
   */
  const routineTitle = currentRoutine?.title ?? "데일리 루틴";

  const routineDescription =
    currentRoutine?.description ?? "오늘의 데일리 케어를 시작해보세요";

  const courseId = currentCourse?.courseId ?? state?.courseId;

  const canUseDailyCourse =
    !isLoadingCourse &&
    currentCourse?.courseType === "DAILY" &&
    courseId !== undefined &&
    currentRoutineTypeCode !== null;

  const handleMoveToIngredientRecommendation = () => {
    navigate("/recommend?from=care");
  };

  const handleOpenConsultationGuide = () => {
    navigate("/safety");
  };

  const handleMoveToRoutineChange = () => {
    if (
      !canUseDailyCourse ||
      courseId === undefined ||
      !currentRoutineTypeCode
    ) {
      console.error("루틴 변경에 필요한 DAILY 코스 정보가 없습니다.");
      return;
    }

    navigate("/care/routine_change", {
      state: {
        courseId,
        routineTypeCode: currentRoutineTypeCode,
      },
    });
  };

  const handleStartRoutine = () => {
    if (
      !canUseDailyCourse ||
      courseId === undefined ||
      !currentRoutineTypeCode
    ) {
      console.error("데일리 케어 시작에 필요한 코스 정보가 없습니다.");
      return;
    }

    navigate("/care/first_daily_care", {
      state: {
        courseId,
        routineTypeCode: currentRoutineTypeCode,
      },
    });
  };

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Content>
        <S.RoutineSection>
          <S.SectionTitle>오늘의 데일리 루틴</S.SectionTitle>

          <S.RoutineCard type="button" onClick={handleMoveToRoutineChange}>
            <S.RoutineBadge>현재 진행 중인 루틴</S.RoutineBadge>

            <S.RoutineTitleRow>
              <S.RoutineTitle>{routineTitle}</S.RoutineTitle>

              <S.SettingIcon
                src="/assets/SettingBlack.svg"
                alt=""
                aria-hidden="true"
              />
            </S.RoutineTitleRow>

            <S.RoutineDescription>{routineDescription}</S.RoutineDescription>

            {currentRoutine && (
              <S.CategoryList>
                {currentRoutine.categories.map((category) => (
                  <S.CategoryBadge key={category}>{category}</S.CategoryBadge>
                ))}
              </S.CategoryList>
            )}
          </S.RoutineCard>
        </S.RoutineSection>

        <S.CourseSection>
          <S.SectionTitle>루틴은 이렇게 진행돼요</S.SectionTitle>

          <S.CourseCard>
            <S.StepList>
              {ROUTINE_STEPS.map((routineStep) => (
                <S.StepItem key={routineStep.step}>
                  <S.StepBadge>{routineStep.step}</S.StepBadge>

                  <S.StepTitle>{routineStep.title}</S.StepTitle>

                  <S.StepDescription>
                    {routineStep.description}
                  </S.StepDescription>
                </S.StepItem>
              ))}
            </S.StepList>

            <S.OutlinedButton
              type="button"
              onClick={handleMoveToIngredientRecommendation}
            >
              추천 성분이 담긴 제품 보기
            </S.OutlinedButton>
          </S.CourseCard>
        </S.CourseSection>

        <S.WarningCard>
          <S.WarningTitleRow>
            <S.WarningIcon
              src="/assets/warning_icon.svg"
              alt=""
              aria-hidden="true"
            />

            <S.WarningTitle>잠깐, 이런 증상이 있나요?</S.WarningTitle>
          </S.WarningTitleRow>

          <S.WarningDescription>
            통증이 심하거나 붓기·붉은기가 갑자기 심해졌다면
            <br />
            루틴을 멈추고 시술 받은 병원에 상담 요청을 해 주세요
          </S.WarningDescription>

          <S.ConsultationButton
            type="button"
            onClick={handleOpenConsultationGuide}
          >
            상담이 필요한 증상 확인
          </S.ConsultationButton>
        </S.WarningCard>
      </S.Content>

      <S.BottomArea>
        <CareButton
          variant="daily"
          disabled={!canUseDailyCourse}
          onClick={handleStartRoutine}
        >
          루틴 시작하기
        </CareButton>
      </S.BottomArea>

      <TabBar activeTab="care" />
    </S.Page>
  );
}
