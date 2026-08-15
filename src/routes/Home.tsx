import React, { useEffect, useState } from "react";
import * as S from "../styles/Home.styles";
import { useNavigate } from "react-router-dom";
import { TabBar, type TabType } from "../components/TabBar";
import { AITodos } from "../components/Home/AITodos";
import { Header } from "../components/Home/Header";
import { courseApi, type CurrentCourseResponse } from "../api/course";
import { procedureApi, type ProcedureItem } from "../api/procedure";
import {
  dashboardApi,
  type WeatherBannerData,
  type RecoveryBannerData,
  type ChecklistItem,
  type WeatherFactor,
} from "../api/dashboard";

// 💡 시작 날짜(YYYY-MM-DD)로부터 D+N 일수를 계산하는 헬퍼 함수
const calculateDDay = (dateStr?: string): number | null => {
  if (!dateStr) return null;
  const targetDate = new Date(dateStr.replace(/\./g, "-"));
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays + 1 : 1;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [currentVersion, setCurrentVersion] = useState<"focus" | "daily">(
    "daily",
  );

  // 💡 현재 코스 정보 상태 추가
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
        const course = await courseApi.getCurrentCourse();
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
          const [recoveryRes, procRes] = await Promise.allSettled([
            dashboardApi.getRecoveryBanner(),
            procedureApi.getCurrentProcedures(),
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
          const weatherRes = await dashboardApi.getWeatherBanner();
          if (isMounted && weatherRes) setWeatherData(weatherRes);
        }

        const checklistRes = await dashboardApi.getChecklist();
        if (isMounted && checklistRes && checklistRes.length > 0) {
          setTodos(checklistRes);
        }
      } catch (error) {
        console.error("대시보드 데이터 조회 실패:", error);
      }

      if (navigator.geolocation && !isFocus) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const coords = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            try {
              const [weatherRes, checklistRes] = await Promise.all([
                dashboardApi.getWeatherBanner(coords),
                dashboardApi.getChecklist(coords),
              ]);
              if (isMounted && weatherRes) setWeatherData(weatherRes);
              if (isMounted && checklistRes && checklistRes.length > 0) {
                setTodos(checklistRes);
              }
            } catch (error) {
              console.error("위치 기반 대시보드 데이터 조회 실패:", error);
            }
          },
          (err) => {
            console.warn("위치 정보 미제공 (기본 좌표 사용):", err.message);
          },
          { timeout: 5000 },
        );
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isFocus]);

  const handleRestartFocus = async () => {
    try {
      await courseApi.restartFocusCourse();
      const updatedProcedures = await procedureApi.getCurrentProcedures();
      if (Array.isArray(updatedProcedures)) {
        setCurrentProcedures(updatedProcedures);
      }
    } catch (error) {
      console.error("집중 코스 전환/재시작 요청 실패:", error);
    } finally {
      setCurrentVersion("focus");
    }
  };

  const handleToggleTodo = async (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo,
      ),
    );

    try {
      const updatedItem = await dashboardApi.toggleChecklistItem(id);
      if (updatedItem) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedItem : todo)),
        );
      }
    } catch (error) {
      console.error("체크리스트 토글 요청 실패:", error);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo,
        ),
      );
    }
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
    if (delta === undefined || delta === 0) return null;

    return (
      <img
        className="arrow-icon"
        src={delta > 0 ? "/assets/CaretUp.svg" : "/assets/CaretDown.svg"}
        alt={delta > 0 ? "증가" : "감소"}
      />
    );
  };

  const latestProcedure = currentProcedures[0];

  // 💡 집중 코스 배지 텍스트
  const getFocusBadgeText = () => {
    if (recoveryData?.dDay !== undefined && recoveryData.dDay !== null) {
      return `D+${recoveryData.dDay}`;
    }

    const calculatedDay = calculateDDay(latestProcedure?.procedureDate);
    if (calculatedDay !== null) {
      return `D+${calculatedDay}`;
    }

    return "-";
  };

  // 💡 데일리 코스 배지 텍스트 (예: "쿨다운 케어 D+1")
  const getDailyBadgeText = () => {
    if (currentCourse && currentCourse.courseType === "DAILY") {
      const label = currentCourse.label || "데일리 케어";
      const dDay = calculateDDay(currentCourse.startedAt) ?? 1;
      return `${label} D+${dDay}`;
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
                        {recoveryData?.redness?.current ?? "-"}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.redness?.delta ?? 1)}
                    </div>
                  </S.StatItem>

                  <S.StatItem>
                    <span className="label">요철</span>
                    <div className="value-wrap">
                      <span className="number">
                        {recoveryData?.texture?.current ?? "-"}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.texture?.delta ?? -1)}
                    </div>
                  </S.StatItem>

                  <S.StatItem>
                    <span className="label">잡티</span>
                    <div className="value-wrap">
                      <span className="number">
                        {recoveryData?.blemish?.current ?? "-"}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.blemish?.delta ?? -1)}
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
            <h3>{`오늘 하루 신경 써야 하는 것 (${completedCount}/${totalTodos})`}</h3>
            <p>데이터를 바탕으로 AI가 추천한 안내</p>
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
