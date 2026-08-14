import React, { useEffect, useState } from "react";
import * as S from "../styles/Home.styles";
import { useNavigate } from "react-router-dom";
import { TabBar, type TabType } from "../components/TabBar";
import { AITodos } from "../components/Home/AITodos";
import { Header } from "../components/Home/Header";
import { courseApi } from "../api/course";
import {
  dashboardApi,
  type WeatherBannerData,
  type RecoveryBannerData,
  type ChecklistItem,
  type WeatherFactor,
} from "../api/dashboard";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [currentVersion, setCurrentVersion] = useState<"focus" | "daily">(
    "daily",
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
      title: "물 자주 마시기",
      description:
        "물을 자주 마셔야하는 이유\n하루동안 물을 얼마나 마셔야하는지",
      checked: false,
    },
    {
      id: 2,
      title: "자외선 차단제 바르기",
      description:
        "외출 전 반드시 꼼꼼히 도포하기\n실내에서도 3시간마다 덧발라주세요",
      checked: false,
    },
  ]);

  const isFocus = currentVersion === "focus";

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        if (isFocus) {
          const recoveryRes = await dashboardApi.getRecoveryBanner();
          if (isMounted && recoveryRes) setRecoveryData(recoveryRes);
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

  const isWarning = (factor?: WeatherFactor) => {
    if (!factor) return false;
    const { level = "", cardStatus = "" } = factor;
    return (
      level.includes("주의") ||
      level.includes("심각") ||
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
              {isFocus
                ? recoveryData?.dDay !== undefined
                  ? `시술 D+${recoveryData.dDay}`
                  : "시술 D+3"
                : weatherData?.triggerFactor || "쿨다운 루틴 D+1"}
            </S.Badge>

            <S.HeroTitle>
              {isFocus
                ? recoveryData?.summaryMessage ||
                  "지금은\n피부 회복에 집중할 때예요"
                : weatherData?.summaryMessage ||
                  "오늘은\n피부가 쉽게 건조해질 수 있어요"}
            </S.HeroTitle>

            <S.StatGrid>
              {isFocus ? (
                <>
                  <S.StatItem>
                    <span className="label">붉은기</span>
                    <div className="value-wrap">
                      <span className="number">
                        {recoveryData?.redness?.current ?? 28}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.redness?.delta ?? 1)}
                    </div>
                  </S.StatItem>

                  <S.StatItem>
                    <span className="label">요철</span>
                    <div className="value-wrap">
                      <span className="number">
                        {recoveryData?.texture?.current ?? 28}
                      </span>
                      <span className="unit">%</span>
                      {renderDeltaArrow(recoveryData?.texture?.delta ?? -1)}
                    </div>
                  </S.StatItem>

                  <S.StatItem>
                    <span className="label">잡티</span>
                    <div className="value-wrap">
                      <span className="number">
                        {recoveryData?.blemish?.current ?? 28}
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
                      {weatherData?.uv?.cardStatus || "색소침착주의"}
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
                      {weatherData?.humidity?.cardStatus || "괜찮아요"}
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
                      {weatherData?.dust?.cardStatus || "트러블주의"}
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
                <div className="title">시술 정보 등록하기</div>
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
