import React, { useEffect, useState } from "react";
import * as S from "../styles/Home.styles";
import { useNavigate } from "react-router-dom";
import { TabBar, type TabType } from "../components/TabBar";
import { AITodos } from "../components/Home/AITodos";
import { Header } from "../components/Home/Header";
// [백엔드 연동 주석처리] 아카이빙을 위해 API 대신 목 데이터 사용
// import { courseApi, type CurrentCourseResponse } from "../api/course";
// import { procedureApi, type ProcedureItem } from "../api/procedure";
import { type CurrentCourseResponse } from "../api/course";
import { type ProcedureItem } from "../api/procedure";
import {
  // dashboardApi,
  type WeatherBannerData,
  type RecoveryBannerData,
  type ChecklistItem,
  type WeatherFactor,
} from "../api/dashboard";
import { getMockCurrentCourse } from "../mocks/dailyCare";
import {
  MOCK_CURRENT_PROCEDURES,
  MOCK_RECOVERY_BANNER,
  getMockChecklist,
  getMockWeatherBanner,
} from "../mocks/home";

const formatDDay = (dateStr?: string): string | null => {
  if (!dateStr) return null;
  const targetDate = new Date(dateStr.replace(/\./g, "-"));
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `D${diffDays}`;
  } else {
    return `D+${diffDays + 1}`;
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [currentVersion, setCurrentVersion] = useState<"focus" | "daily">(
    "daily",
  );

  const [currentCourse, setCurrentCourse] =
    useState<CurrentCourseResponse | null>(null);

  const [currentProcedures, setCurrentProcedures] = useState<ProcedureItem[]>(
    [],
  );
  const [recoveryData, setRecoveryData] = useState<RecoveryBannerData | null>(
    null,
  );
  const [weatherData, setWeatherData] = useState<WeatherBannerData | null>(
    null,
  );
  const [todos, setTodos] = useState<ChecklistItem[]>([
    {
      id: 1,
      title: "-",
      description: "-",
      checked: false,
    },
    {
      id: 2,
      title: "-",
      description: "-",
      checked: false,
    },
  ]);

  const isFocus = currentVersion === "focus";

  useEffect(() => {
    let isMounted = true;

    const checkCurrentCourse = async () => {
      try {
        // [백엔드 연동 주석처리] 현재 코스 조회 대신 목 코스 사용 (데일리 코스를 시작했으면 데일리, 아니면 집중)
        // const course = await courseApi.getCurrentCourse();
        const course = await Promise.resolve(getMockCurrentCourse());
        if (!isMounted) return;

        if (course) {
          setCurrentCourse(course);
          if (course.courseType === "FOCUS") {
            setCurrentVersion("focus");
          } else {
            setCurrentVersion("daily");
          }
        } else {
          setCurrentCourse(null);
          setCurrentVersion("daily");
        }
      } catch (error) {
        console.error("현재 코스 상태 조회 실패:", error);
      }
    };

    checkCurrentCourse();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        if (isFocus) {
          // [백엔드 연동 주석처리] 회복 배너·현재 시술 API 대신 목 데이터 사용
          // const [recoveryRes, procRes] = await Promise.allSettled([
          //   dashboardApi.getRecoveryBanner(),
          //   procedureApi.getCurrentProcedures(),
          // ]);
          const [recoveryRes, procRes] = await Promise.allSettled([
            Promise.resolve(MOCK_RECOVERY_BANNER),
            Promise.resolve(MOCK_CURRENT_PROCEDURES),
          ]);

          if (isMounted) {
            if (recoveryRes.status === "fulfilled" && recoveryRes.value) {
              setRecoveryData(recoveryRes.value);
            }
            if (
              procRes.status === "fulfilled" &&
              Array.isArray(procRes.value)
            ) {
              setCurrentProcedures(procRes.value);
            }
          }
        } else {
          // [백엔드 연동 주석처리] 날씨 배너 API 대신 기획 기준표로 계산한 목 날씨 사용
          // const weatherRes = await dashboardApi.getWeatherBanner();
          const weatherRes = await Promise.resolve(getMockWeatherBanner());
          if (isMounted && weatherRes) setWeatherData(weatherRes);
        }

        // [백엔드 연동 주석처리] 체크리스트 API 대신 목 체크리스트 사용
        // const checklistRes = await dashboardApi.getChecklist();
        const checklistRes = await Promise.resolve(getMockChecklist(isFocus));
        if (isMounted && checklistRes && checklistRes.length > 0) {
          setTodos(checklistRes);
        }
      } catch (error) {
        console.error("대시보드 데이터 조회 실패:", error);
      }

      // [백엔드 연동 주석처리] 위치 기반 날씨·체크리스트 API 재조회 (목 데이터는 위치와 무관해 위치 권한도 요청하지 않음)
      // if (navigator.geolocation && !isFocus) {
      //   navigator.geolocation.getCurrentPosition(
      //     async (position) => {
      //       const coords = {
      //         lat: position.coords.latitude,
      //         lon: position.coords.longitude,
      //       };
      //       try {
      //         const [weatherRes, checklistRes] = await Promise.all([
      //           dashboardApi.getWeatherBanner(coords),
      //           dashboardApi.getChecklist(coords),
      //         ]);
      //         if (isMounted && weatherRes) setWeatherData(weatherRes);
      //         if (isMounted && checklistRes && checklistRes.length > 0) {
      //           setTodos(checklistRes);
      //         }
      //       } catch (error) {
      //         console.error("위치 기반 대시보드 데이터 조회 실패:", error);
      //       }
      //     },
      //     (err) => {
      //       console.warn("위치 정보 미제공 (기본 좌표 사용):", err.message);
      //     },
      //     { timeout: 5000 },
      //   );
      // }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isFocus]);

  const handleRestartFocus = async () => {
    try {
      // [백엔드 연동 주석처리] 집중 코스 재시작 API 대신 저장된 데일리 코스를 지워 집중 코스로 전환
      // await courseApi.restartFocusCourse();
      // const updatedProcedures = await procedureApi.getCurrentProcedures();
      sessionStorage.removeItem("currentDailyCourse");
      const updatedProcedures = await Promise.resolve(MOCK_CURRENT_PROCEDURES);
      if (Array.isArray(updatedProcedures)) {
        setCurrentProcedures(updatedProcedures);
      }
    } catch (error) {
      console.error("집중 코스 전환/재시작 요청 실패:", error);
    } finally {
      setCurrentVersion("focus");
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo,
      ),
    );

    // [백엔드 연동 주석처리] 체크리스트 토글 API (화면의 체크 상태만 바꿈)
    // try {
    //   const updatedItem = await dashboardApi.toggleChecklistItem(id);
    //   if (updatedItem) {
    //     setTodos((prev) =>
    //       prev.map((todo) => (todo.id === id ? updatedItem : todo)),
    //     );
    //   }
    // } catch (error) {
    //   console.error("체크리스트 토글 요청 실패:", error);
    //   setTodos((prev) =>
    //     prev.map((todo) =>
    //       todo.id === id ? { ...todo, checked: !todo.checked } : todo,
    //     ),
    //   );
    // }
  };

  const totalTodos = todos.length;
  const completedCount = todos.filter((todo) => todo.checked).length;

  const isWarning = (factor?: WeatherFactor & { siren?: boolean }) => {
    if (!factor) return false;
    if (typeof factor.siren === "boolean") {
      return factor.siren;
    }
    const { level = "", cardStatus = "" } = factor;
    return (
      level.includes("주의") ||
      level.includes("심각") ||
      level.includes("높음") ||
      level.includes("위험") ||
      cardStatus.includes("주의") ||
      cardStatus.includes("심각")
    );
  };

  const renderDeltaArrow = (delta?: number) => {
    if (delta === undefined || delta === null || delta === 0) return null;

    return (
      <img
        className="arrow-icon"
        src={delta > 0 ? "/assets/CaretUp.svg" : "/assets/CaretDown.svg"}
        alt={delta > 0 ? "증가" : "감소"}
      />
    );
  };

  const getDisplayValue = (item?: { current?: number; delta?: number }) => {
    if (item?.delta !== undefined && item.delta !== null) {
      return Math.abs(item.delta);
    }
    return item?.current ?? "-";
  };

  const latestProcedure = currentProcedures[0];

  const getFocusBadgeText = () => {
    if (latestProcedure?.procedureDate) {
      const calculated = formatDDay(latestProcedure.procedureDate);
      if (calculated) return `시술 ${calculated}`;
    }

    if (recoveryData?.dDay !== undefined && recoveryData.dDay !== null) {
      return recoveryData.dDay <= 0
        ? `D${recoveryData.dDay}`
        : `D+${recoveryData.dDay}`;
    }

    return "-";
  };

  const getDailyBadgeText = () => {
    if (currentCourse && currentCourse.courseType === "DAILY") {
      const label = currentCourse.label || "데일리 케어";
      const dDayText = formatDDay(currentCourse.startedAt) ?? "D+1";
      return `${label} 루틴 ${dDayText}`;
    }

    return weatherData?.triggerFactor || "-";
  };

  return (
    <>
      <Header
        currentVersion={currentVersion}
        onRestartFocus={handleRestartFocus}
      />
      <S.Container>
        <S.LeftColumn>
          <S.HeroCard $isFocus={isFocus}>
            <S.Badge $isFocus={isFocus}>
              {isFocus ? getFocusBadgeText() : getDailyBadgeText()}
            </S.Badge>

            <S.HeroTitle>
              {isFocus
                ? recoveryData?.summaryMessage || "-"
                : weatherData?.summaryMessage || "-"}
            </S.HeroTitle>

            <S.StatGrid>
              {isFocus ? (
                <>
                  <S.StatItem>
                    <span className="label">붉은기</span>
                    <div className="value-wrap">
                      <span className="number">
                        {getDisplayValue(recoveryData?.redness)}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.redness?.delta)}
                    </div>
                  </S.StatItem>

                  <S.StatItem>
                    <span className="label">요철</span>
                    <div className="value-wrap">
                      <span className="number">
                        {getDisplayValue(recoveryData?.texture)}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.texture?.delta)}
                    </div>
                  </S.StatItem>

                  <S.StatItem>
                    <span className="label">잡티</span>
                    <div className="value-wrap">
                      <span className="number">
                        {getDisplayValue(recoveryData?.blemish)}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.blemish?.delta)}
                    </div>
                  </S.StatItem>
                </>
              ) : (
                <>
                  <S.DailyStatItem>
                    <div className="header">
                      <span>자외선</span>
                      {isWarning(weatherData?.uv) && (
                        <img src="/assets/Warning.svg" alt="경고" />
                      )}
                    </div>
                    <p className="status-text">
                      {weatherData?.uv?.cardStatus || "-"}
                    </p>
                  </S.DailyStatItem>

                  <S.DailyStatItem>
                    <div className="header">
                      <span>습도</span>
                      {isWarning(weatherData?.humidity) && (
                        <img src="/assets/Warning.svg" alt="경고" />
                      )}
                    </div>
                    <p className="status-text">
                      {weatherData?.humidity?.cardStatus || "-"}
                    </p>
                  </S.DailyStatItem>

                  <S.DailyStatItem>
                    <div className="header">
                      <span>미세먼지</span>
                      {isWarning(weatherData?.dust) && (
                        <img src="/assets/Warning.svg" alt="경고" />
                      )}
                    </div>
                    <p className="status-text">
                      {weatherData?.dust?.cardStatus || "-"}
                    </p>
                  </S.DailyStatItem>
                </>
              )}
            </S.StatGrid>

            <S.RoutineButton
              $isFocus={isFocus}
              onClick={() => navigate(isFocus ? "/care" : "/care/daily_care")}
            >
              오늘의 루틴 시작하기
            </S.RoutineButton>
          </S.HeroCard>
        </S.LeftColumn>

        <S.RightColumn>
          <S.BannerCard onClick={() => navigate("/preview")}>
            <div className="left">
              <img
                className="icon-img"
                src="/assets/Home_Daily.png"
                alt="데일리 코스"
              />
              <div>
                <div className="desc">
                  {isFocus
                    ? "집중 코스가 끝나면 시작돼요"
                    : "피부 고민에 맞는 루틴을 선택해 보세요"}
                </div>
                <div className="title">
                  {isFocus ? "데일리 코스 미리보기" : "다른 루틴 둘러보기"}
                </div>
              </div>
            </div>
            <div className="arrow">
              <img className="Goto-img" src="/assets/Goto.svg" alt="이동" />
            </div>
          </S.BannerCard>

          <S.BannerCard onClick={() => navigate("/add")}>
            <div className="left">
              <img
                className="icon-img"
                src="/assets/Home_Focus.png"
                alt="집중 코스"
              />
              <div>
                <div className="desc">새로운 시술을 받으셨나요?</div>
                <div className="title">시술 내역 등록하기</div>
              </div>
            </div>
            <div className="arrow">
              <img className="Goto-img" src="/assets/Goto.svg" alt="이동" />
            </div>
          </S.BannerCard>

          <S.SectionHeader>
            <h3>{`오늘 챙기면 좋은 것 (${completedCount}/${totalTodos})`}</h3>
            <p>시술 및 루틴 내역을 바탕으로 AI가 추천해 드려요</p>
          </S.SectionHeader>

          {todos.map((todo) => (
            <AITodos
              key={todo.id}
              title={todo.title}
              description={todo.description}
              isChecked={todo.checked}
              isFocus={isFocus}
              onToggle={() => handleToggleTodo(todo.id)}
            />
          ))}
        </S.RightColumn>
      </S.Container>

      <TabBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
    </>
  );
};

export default Home;
