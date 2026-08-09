import React, { useState } from "react";
import * as S from "../styles/Home.styles";
import { useNavigate } from "react-router-dom";
import { TabBar, type TabType } from "../components/TabBar";
import { AITodos } from "../components/Home/AITodos";
import { Header } from "../components/Home/Header";

interface TodoItem {
  id: number;
  title: string;
  description: string;
  isChecked: boolean;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [currentVersion, setCurrentVersion] = useState<"focus" | "daily">(
    "focus",
  );

  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: 1,
      title: "물 자주 마시기",
      description:
        "물을 자주 마셔야하는 이유\n하루동안 물을 얼마나 마셔야하는지",
      isChecked: false,
    },
    {
      id: 2,
      title: "물 자주 마시기",
      description:
        "물을 자주 마셔야하는 이유\n하루동안 물을 얼마나 마셔야하는지",
      isChecked: false,
    },
  ]);

  const isFocus = currentVersion === "focus";

  const handleToggleVersion = () => {
    setCurrentVersion((prev) => (prev === "focus" ? "daily" : "focus"));
    setTodos((prev) => prev.map((todo) => ({ ...todo, isChecked: false })));
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo,
      ),
    );
  };

  const totalTodos = todos.length;
  const completedCount = todos.filter((todo) => todo.isChecked).length;

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
                ? "시술 후 3일째\n안정기에 접어들고 있어요"
                : "날씨가 건조하니\n오늘은 미스트를 종종 뿌려주세요"}
            </S.HeroTitle>
            <S.StatGrid>
              {isFocus ? (
                <>
                  <S.StatItem>
                    <span>붉은기</span>
                    <strong>
                      28<S.Percent>%</S.Percent> <S.Up>▴</S.Up>
                    </strong>
                  </S.StatItem>
                  <S.StatItem>
                    <span>요철</span>
                    <strong>
                      28<S.Percent>%</S.Percent> <S.Down>▾</S.Down>
                    </strong>
                  </S.StatItem>
                  <S.StatItem>
                    <span>잡티</span>
                    <strong>
                      28<S.Percent>%</S.Percent> <S.Down>▾</S.Down>
                    </strong>
                  </S.StatItem>
                </>
              ) : (
                <>
                  <S.DailyStatItem>
                    <div className="header">
                      <span>자외선</span>
                      <img src="/assets/Warning.svg" alt="경고" />
                    </div>
                    <p className="status-text">색소침착주의</p>
                  </S.DailyStatItem>

                  <S.DailyStatItem>
                    <div className="header">
                      <span>습도</span>
                    </div>
                    <p className="status-text">괜찮아요</p>
                  </S.DailyStatItem>

                  <S.DailyStatItem>
                    <div className="header">
                      <span>미세먼지</span>
                      <img src="/assets/Warning.svg" alt="경고" />
                    </div>
                    <p className="status-text">트러블주의</p>
                  </S.DailyStatItem>
                </>
              )}
            </S.StatGrid>
            <S.RoutineButton $isFocus={isFocus}>
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
              isChecked={todo.isChecked}
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
