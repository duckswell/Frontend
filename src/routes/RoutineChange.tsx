import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  courseApi,
  type CurrentCourseResponse,
  type RoutineTypeCode,
} from "../api/course";

import { NavBar } from "../components/NavBar";
import { RoutineCard } from "../components/DailycoursePreview/RoutineCard";

import * as S from "../styles/DailyCare/RoutineChange.styles";

interface RoutineChangeLocationState {
  courseId?: number;
  routineTypeCode?: RoutineTypeCode;
}

interface RoutineOption {
  id: string;
  routineTypeCode: RoutineTypeCode;
  title: string;
  description: string;
  tags: string[];
  iconSrc: string;
}

const ROUTINES: RoutineOption[] = [
  {
    id: "cooldown",
    routineTypeCode: "COOLDOWN",
    title: "쿨다운 루틴",
    description: "쉽게 붉어지고 예민해지는 피부를 진정",
    tags: ["센텔라", "판테놀", "알로에"],
    iconSrc: "/assets/Daily_cooldown.png",
  },
  {
    id: "clearup",
    routineTypeCode: "CLEAR_UP",
    title: "클리어업 루틴",
    description: "칙칙한 피부톤과 눈에 띄는 피부 흔적에 집중",
    tags: ["나이아신아마이드", "비타민C"],
    iconSrc: "/assets/Daily_clearup.png",
  },
  {
    id: "sebum",
    routineTypeCode: "SEBUM_CONTROL",
    title: "피지컨트롤 루틴",
    description: "과도한 피지가 고민인 피부를 산뜻하고 깨끗하게",
    tags: ["나이아신아마이드", "징크PCA"],
    iconSrc: "/assets/Daily_pore.png",
  },
  {
    id: "moisture",
    routineTypeCode: "HYDRATION",
    title: "수분충전 루틴",
    description: "건조하고 당기는 피부에 수분을 채워 촉촉하게",
    tags: ["히알루론산", "세라마이드", "판테놀"],
    iconSrc: "/assets/Daily_barrier.png",
  },
];

function getRoutineTypeCodeFromLabel(label: string): RoutineTypeCode | null {
  const normalizedLabel = label.replace(/\s/g, "");

  if (normalizedLabel.includes("쿨다운") || normalizedLabel.includes("진정")) {
    return "COOLDOWN";
  }

  if (
    normalizedLabel.includes("클리어업") ||
    normalizedLabel.includes("피부톤") ||
    normalizedLabel.includes("흔적") ||
    normalizedLabel.includes("미백")
  ) {
    return "CLEAR_UP";
  }

  if (
    normalizedLabel.includes("피지") ||
    normalizedLabel.includes("트러블") ||
    normalizedLabel.includes("기름")
  ) {
    return "SEBUM_CONTROL";
  }

  if (
    normalizedLabel.includes("수분") ||
    normalizedLabel.includes("보습") ||
    normalizedLabel.includes("건조")
  ) {
    return "HYDRATION";
  }

  return null;
}

export default function RoutineChange() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as RoutineChangeLocationState | null;

  const [currentCourse, setCurrentCourse] =
    useState<CurrentCourseResponse | null>(null);

  const [currentRoutineTypeCode, setCurrentRoutineTypeCode] =
    useState<RoutineTypeCode | null>(state?.routineTypeCode ?? null);

  const [selectedRoutineTypeCode, setSelectedRoutineTypeCode] =
    useState<RoutineTypeCode | null>(state?.routineTypeCode ?? null);

  const [isChangingRoutine, setIsChangingRoutine] = useState(false);

  const [isLoadingCourse, setIsLoadingCourse] = useState(true);

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        setIsLoadingCourse(true);

        const course = await courseApi.getCurrentCourse();

        /*
         * 진행 중인 코스가 없으면
         * 백엔드에서 data가 빠질 수 있다.
         */
        if (!course) {
          console.error("현재 진행 중인 코스가 없습니다.");

          setCurrentCourse(null);
          setCurrentRoutineTypeCode(null);
          setSelectedRoutineTypeCode(null);

          return;
        }

        console.log("현재 진행 중인 코스 조회 성공:", course);

        if (course.courseType !== "DAILY") {
          console.error(
            "루틴 변경 페이지인데 현재 진행 중인 코스가 DAILY가 아닙니다.",
            course
          );

          setCurrentCourse(null);
          setCurrentRoutineTypeCode(null);
          setSelectedRoutineTypeCode(null);

          return;
        }

        setCurrentCourse(course);

        /*
         * state가 있으면 state 사용,
         * 새로고침으로 state가 사라졌다면 label에서 복구
         */
        const routineTypeCode =
          state?.routineTypeCode ?? getRoutineTypeCodeFromLabel(course.label);

        if (!routineTypeCode) {
          console.error(
            "현재 데일리 루틴 타입을 판단하지 못했습니다.",
            course.label
          );

          setCurrentRoutineTypeCode(null);
          setSelectedRoutineTypeCode(null);

          return;
        }

        setCurrentRoutineTypeCode(routineTypeCode);
        setSelectedRoutineTypeCode(routineTypeCode);
      } catch (error) {
        console.error("현재 진행 중인 코스 조회 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);
          console.error("API Error Response:", error.response?.data);
          console.error("요청 URL:", error.config?.url);
        }

        setCurrentCourse(null);
        setCurrentRoutineTypeCode(null);
        setSelectedRoutineTypeCode(null);
      } finally {
        setIsLoadingCourse(false);
      }
    };

    fetchCurrentCourse();
  }, [state?.routineTypeCode]);

  const currentRoutine = ROUTINES.find(
    (routine) => routine.routineTypeCode === currentRoutineTypeCode
  );

  const handleSelectRoutine = (routineTypeCode: RoutineTypeCode) => {
    if (isChangingRoutine) {
      return;
    }

    setSelectedRoutineTypeCode(routineTypeCode);
  };

  const handleStartRoutine = async () => {
    if (
      !currentCourse ||
      !currentRoutineTypeCode ||
      !selectedRoutineTypeCode ||
      isChangingRoutine
    ) {
      return;
    }

    /*
     * 현재 사용 중인 루틴을 다시 선택한 경우
     * 종료/재생성하지 않고 DailyCare로 복귀
     */
    if (selectedRoutineTypeCode === currentRoutineTypeCode) {
      navigate("/care/daily", {
        state: {
          courseId: currentCourse.courseId,
          routineTypeCode: currentRoutineTypeCode,
        },
      });

      return;
    }

    const previousRoutineTypeCode = currentRoutineTypeCode;

    try {
      setIsChangingRoutine(true);

      /*
       * 1. 현재 DAILY 코스 종료
       */
      const endedCourse = await courseApi.endCourse(currentCourse.courseId);

      console.log("기존 데일리 코스 종료 성공:", endedCourse);

      try {
        /*
         * 2. 선택한 루틴 타입으로
         *    새로운 DAILY 코스 시작
         */
        const newCourse = await courseApi.startCourse({
          courseType: "DAILY",
          routineTypeCode: selectedRoutineTypeCode,
        });

        console.log("새 데일리 코스 시작 성공:", newCourse);

        /*
         * 3. 새 courseId와 routineTypeCode로
         *    DailyCare 이동
         */
        navigate("/care/daily", {
          replace: true,
          state: {
            courseId: newCourse.id,
            routineTypeCode:
              newCourse.routineTypeCode ?? selectedRoutineTypeCode,
          },
        });
      } catch (startError) {
        console.error("새 데일리 코스 시작 실패:", startError);

        if (axios.isAxiosError(startError)) {
          console.error("HTTP Status:", startError.response?.status);
          console.error("API Error Response:", startError.response?.data);
          console.error("요청 URL:", startError.config?.url);
        }

        /*
         * 기존 코스는 이미 종료되었기 때문에
         * 새 코스 시작이 실제로 실패했다면
         * 기존 routineTypeCode로 DAILY 코스 복구를 시도한다.
         *
         * 만약 서버에서는 새 코스 시작에 성공했는데
         * 네트워크 응답만 실패한 상황이라면
         * 이 요청은 CO003(이미 진행 중인 코스)로 실패할 수 있다.
         * 그 경우 아래 getCurrentCourse로 실제 서버 상태를 다시 확인한다.
         */
        try {
          const restoredCourse = await courseApi.startCourse({
            courseType: "DAILY",
            routineTypeCode: previousRoutineTypeCode,
          });

          console.log("기존 데일리 코스 복구 성공:", restoredCourse);

          navigate("/care/daily", {
            replace: true,
            state: {
              courseId: restoredCourse.id,
              routineTypeCode:
                restoredCourse.routineTypeCode ?? previousRoutineTypeCode,
            },
          });

          return;
        } catch (restoreError) {
          console.error("기존 데일리 코스 복구 요청 실패:", restoreError);
        }

        /*
         * 새 start가 서버에서는 성공했지만
         * 클라이언트가 응답을 받지 못했을 수도 있으므로
         * 현재 서버 상태를 마지막으로 재확인한다.
         */
        try {
          const activeCourse = await courseApi.getCurrentCourse();

          if (activeCourse && activeCourse.courseType === "DAILY") {
            const activeRoutineTypeCode = getRoutineTypeCodeFromLabel(
              activeCourse.label
            );

            if (activeRoutineTypeCode) {
              navigate("/care/daily", {
                replace: true,
                state: {
                  courseId: activeCourse.courseId,
                  routineTypeCode: activeRoutineTypeCode,
                },
              });

              return;
            }
          }
        } catch (recheckError) {
          console.error(
            "루틴 변경 실패 후 현재 코스 재조회 실패:",
            recheckError
          );
        }
      }
    } catch (error) {
      /*
       * 이 catch는 기존 코스 end 자체가 실패했을 때
       * 주로 실행된다.
       */
      console.error("기존 데일리 코스 종료 실패:", error);

      if (axios.isAxiosError(error)) {
        console.error("HTTP Status:", error.response?.status);
        console.error("API Error Response:", error.response?.data);
        console.error("요청 URL:", error.config?.url);
      }
    } finally {
      setIsChangingRoutine(false);
    }
  };

  const isButtonDisabled =
    isLoadingCourse ||
    !currentCourse ||
    !currentRoutineTypeCode ||
    !selectedRoutineTypeCode ||
    isChangingRoutine;

  return (
    <S.Page>
      <NavBar title="데일리 코스 루틴 변경" />

      <S.Content>
        <S.IntroSection>
          <S.Title>
            {currentRoutine
              ? `${currentRoutine.title}을 ${
                  currentCourse?.streakDays ?? 0
                }일 동안 실천했어요`
              : "현재 데일리 루틴을 변경해보세요"}
          </S.Title>

          <S.Description>
            다른 피부 고민도 관리하고 싶다면 새로운 루틴을 둘러보세요
          </S.Description>
        </S.IntroSection>

        <S.RoutineList>
          {ROUTINES.map((routine) => {
            const isCurrentRoutine =
              routine.routineTypeCode === currentRoutineTypeCode;

            const isSelected =
              routine.routineTypeCode === selectedRoutineTypeCode;

            return (
              <S.RoutineCardWrapper key={routine.id}>
                {isCurrentRoutine && (
                  <S.CurrentRoutineBadge>현재 루틴</S.CurrentRoutineBadge>
                )}

                <RoutineCard
                  id={routine.id}
                  title={routine.title}
                  description={routine.description}
                  tags={routine.tags}
                  iconSrc={routine.iconSrc}
                  isSelected={isSelected}
                  onClick={() => handleSelectRoutine(routine.routineTypeCode)}
                />
              </S.RoutineCardWrapper>
            );
          })}
        </S.RoutineList>
      </S.Content>

      <S.BottomArea>
        <S.SubmitButton
          type="button"
          disabled={isButtonDisabled}
          onClick={handleStartRoutine}
        >
          {isChangingRoutine ? "루틴 변경 중..." : "이 루틴으로 시작하기"}
        </S.SubmitButton>
      </S.BottomArea>
    </S.Page>
  );
}
