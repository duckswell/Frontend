import React, { useEffect, useState } from "react";
import * as S from "../styles/Home.styles";
import { useNavigate } from "react-router-dom";
import { TabBar, type TabType } from "../components/TabBar";
import { AITodos } from "../components/Home/AITodos";
import { Header } from "../components/Home/Header";
import {
  dashboardApi,
  type WeatherBannerData,
  type RecoveryBannerData,
  type ChecklistItem,
} from "../api/dashboard";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [currentVersion, setCurrentVersion] = useState<"focus" | "daily">(
    "focus",
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

  // 💡 데이터 조회 (위치 정보 취득 후 API 호출)
  useEffect(() => {
    const fetchDashboardData = async (coords?: {
      lat: number;
      lon: number;
    }) => {
      try {
        if (isFocus) {
          const recoveryRes = await dashboardApi.getRecoveryBanner();
          if (recoveryRes) setRecoveryData(recoveryRes);
        } else {
          const weatherRes = await dashboardApi.getWeatherBanner(coords);
          if (weatherRes) setWeatherData(weatherRes);
        }

        const checklistRes = await dashboardApi.getChecklist(coords);
        if (checklistRes && checklistRes.length > 0) {
          setTodos(checklistRes);
        }
      } catch (error) {
        console.error("대시보드 데이터 조회 실패:", error);
      }
    };

    // 브라우저 위치 정보 가져오기 (거부 시 서울 기본 좌표로 서버에서 처리됨)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchDashboardData({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          fetchDashboardData();
        },
        { timeout: 3000 },
      );
    } else {
      fetchDashboardData();
    }
  }, [isFocus]);

  const handleToggleVersion = () => {
    setCurrentVersion((prev) => (prev === "focus" ? "daily" : "focus"));
  };

  const handleToggleTodo = async (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo,
      ),
    );

    try {
      await dashboardApi.toggleChecklistItem(id);
    } catch (error) {
      console.error("체크리스트 토글 요청 실패:", error);
    }
  };

  const totalTodos = todos.length;
  const completedCount = todos.filter((todo) => todo.checked).length;

  // 💡 심각도(level)가 '양호'가 아니거나 '주의'/'심각'일 때 경고 아이콘 표시 함수
  const isWarning = (level?: string) => {
    if (!level) return false;
    return level === "주의" || level === "심각" || level !== "양호";
  };

  return (
    <>
      <Header
        currentVersion={currentVersion}
        onToggleVersion={handleToggleVersion}
      />
      <S.Container>
        <S.LeftColumn>
          <S.HeroCard $isFocus={isFocus}>
            <S.Badge $isFocus={isFocus}>
              {isFocus ? "다음 시술 D-3" : "수분 케어 D+7"}
            </S.Badge>

            <S.HeroTitle>
              {isFocus
                ? recoveryData?.summaryMessage ||
                  "시술 후 3일째\n안정기에 접어들고 있어요"
                : weatherData?.summaryMessage ||
                  "날씨가 건조하니\n오늘은 미스트를 종종 뿌려주세요"}
            </S.HeroTitle>

            <S.StatGrid>
              {isFocus ? (
                <>
                  <S.StatItem>
                    <span>붉은기</span>
                    <strong>
                      {recoveryData?.redness?.current ?? 28}
                      <S.Percent>%</S.Percent>
                      {(recoveryData?.redness?.delta ?? 1) >= 0 ? (
                        <S.Up>▴</S.Up>
                      ) : (
                        <S.Down>▾</S.Down>
                      )}
                    </strong>
                  </S.StatItem>
                  <S.StatItem>
                    <span>요철</span>
                    <strong>
                      {recoveryData?.texture?.current ?? 28}
                      <S.Percent>%</S.Percent>
                      {(recoveryData?.texture?.delta ?? -1) >= 0 ? (
                        <S.Up>▴</S.Up>
                      ) : (
                        <S.Down>▾</S.Down>
                      )}
                    </strong>
                  </S.StatItem>
                  <S.StatItem>
                    <span>잡티</span>
                    <strong>
                      {recoveryData?.blemish?.current ?? 28}
                      <S.Percent>%</S.Percent>
                      {(recoveryData?.blemish?.delta ?? -1) >= 0 ? (
                        <S.Up>▴</S.Up>
                      ) : (
                        <S.Down>▾</S.Down>
                      )}
                    </strong>
                  </S.StatItem>
                </>
              ) : (
                <>
                  {/* 자외선 */}
                  <S.DailyStatItem>
                    <div className="header">
                      <span>자외선</span>
                      {isWarning(weatherData?.uv?.level) && (
                        <img src="/assets/Warning.svg" alt="경고" />
                      )}
                    </div>
                    <p className="status-text">
                      {weatherData?.uv?.cardStatus || "색소침착주의"}
                    </p>
                  </S.DailyStatItem>

                  {/* 습도 */}
                  <S.DailyStatItem>
                    <div className="header">
                      <span>습도</span>
                      {isWarning(weatherData?.humidity?.level) && (
                        <img src="/assets/Warning.svg" alt="경고" />
                      )}
                    </div>
                    <p className="status-text">
                      {weatherData?.humidity?.cardStatus || "괜찮아요"}
                    </p>
                  </S.DailyStatItem>

                  {/* 미세먼지 */}
                  <S.DailyStatItem>
                    <div className="header">
                      <span>미세먼지</span>
                      {isWarning(weatherData?.dust?.level) && (
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
                src={"/assets/Home_Daily.png"}
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
              <img className="Go-toimg" src={"/assets/Goto.svg"} alt="이동" />
            </div>
          </S.BannerCard>

          <S.BannerCard onClick={() => navigate("/add")}>
            <div className="left">
              <img
                className="icon-img"
                src={"/assets/Home_Focus.png"}
                alt="집중 코스"
              />
              <div>
                <div className="desc">새로운 시술을 받으셨나요?</div>
                <div className="title">시술 정보 등록하기</div>
              </div>
            </div>
            <img className="GoToimg" src={"/assets/Goto.svg"} alt="이동" />
          </S.BannerCard>

          <S.SectionHeader>
            <h3>
              {`오늘 하루 신경 써야 하는 것 (${completedCount}/${totalTodos})`}
            </h3>
            <p>데이터를 바탕으로 AI가 추천한거라는 안내</p>
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
