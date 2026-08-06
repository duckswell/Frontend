import React, { useState } from "react";
import * as S from "../styles/Home.styles";
import { TabBar, type TabType } from "../components/TabBar";

const CURRENT_VERSION: "focus" | "daily" = "focus";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [todoChecked1, setTodoChecked1] = useState(false);
  const [todoChecked2, setTodoChecked2] = useState(true);

  const isFocus = CURRENT_VERSION === "focus";

  return (
    <>
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
              <S.StatItem>
                <span>붉은기</span>
                <strong>
                  28<S.Percent>%</S.Percent> <S.Updown>▾</S.Updown>
                </strong>
              </S.StatItem>
              <S.StatItem>
                <span>요철</span>
                <strong>
                  28<S.Percent>%</S.Percent> <S.Updown>▾</S.Updown>
                </strong>
              </S.StatItem>
              <S.StatItem>
                <span>잡티</span>
                <strong>
                  28<S.Percent>%</S.Percent> <S.Updown>▾</S.Updown>
                </strong>
              </S.StatItem>
            </S.StatGrid>

            <S.RoutineButton $isFocus={isFocus}>
              오늘의 루틴 시작하기
            </S.RoutineButton>
          </S.HeroCard>
        </S.LeftColumn>

        <S.RightColumn>
          <S.BannerCard>
            <div className="left">
              <img
                className="icon-img"
                src={"/assets/DailyImg.svg"}
                alt="데일리 코스"
              />
              <div>
                <div className="desc">
                  {isFocus
                    ? "집중 코스가 끝나면 데일리로 이어가요"
                    : "다른 데일리 코스하고싶냐"}
                </div>
                <div className="title">데일리 코스 살펴보기</div>
              </div>
            </div>
            <div className="arrow">›</div>
          </S.BannerCard>

          <S.BannerCard>
            <div className="left">
              <img
                className="icon-img"
                src={"/assets/ConcImg.svg"}
                alt="집중 코스"
              />
              <div>
                <div className="desc">새로운 시술을 받으셨나요?</div>
                <div className="title">시술 정보 등록하기</div>
              </div>
            </div>
            <div className="arrow">›</div>
          </S.BannerCard>

          <S.SectionHeader>
            <h3>
              {isFocus
                ? "오늘 하루 신경 써야 하는 것 (1/2)"
                : "오늘 하루 신경 써야 하는 것"}
            </h3>
            <p>데이터를 바탕으로 AI가 추천한거라는 안내</p>
          </S.SectionHeader>

          <S.TodoCard
            $isChecked={todoChecked1}
            $isFocus={isFocus}
            onClick={() => setTodoChecked1(!todoChecked1)}
          >
            <div className="checkbox">{todoChecked1 && "✓"}</div>
            <div className="content">
              <h4>물 자주 마시기</h4>
              <p>
                물을 자주 마셔야하는 이유
                <br />
                하루동안 물을 얼마나 마셔야하는지
              </p>
            </div>
          </S.TodoCard>

          <S.TodoCard
            $isChecked={todoChecked2}
            $isFocus={isFocus}
            onClick={() => setTodoChecked2(!todoChecked2)}
          >
            <div className="checkbox">{todoChecked2 && "✓"}</div>
            <div className="content">
              <h4>물 자주 마시기</h4>
              <p>
                물을 자주 마셔야하는 이유
                <br />
                하루동안 물을 얼마나 마셔야하는지
              </p>
            </div>
          </S.TodoCard>
        </S.RightColumn>
      </S.Container>

      <TabBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
    </>
  );
};

export default Home;
