import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/Mypage.styles";
import { PageName } from "../components/PageName";
import { TabBar, type TabType } from "../components/TabBar";

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const navigate = useNavigate();

  return (
    <>
      <PageName title="마이페이지" />

      <S.Container>
        <S.Section>
          <S.SectionTitle>등록된 시술</S.SectionTitle>
          <S.TreatmentCard>
            <div
              className="card-top"
              onClick={() => alert("시술 설정 클릭")}
              role="button"
              tabIndex={0}
            >
              <div className="info">
                <h4>여드름 압출</h4>
                <p>2025년 6월 10일 시작</p>
              </div>
              <img
                src="/assets/Setting.svg"
                alt="설정"
                className="setting-icon"
              />
            </div>

            <div className="card-bottom">
              <div className="stat-box">
                <span>현재 회차</span>
                <strong>1회</strong>
              </div>
              <div className="stat-box">
                <span>잔여 횟수</span>
                <strong>4회</strong>
              </div>
              <div className="stat-box">
                <span>총 횟수</span>
                <strong>5회</strong>
              </div>
            </div>
          </S.TreatmentCard>
        </S.Section>

        <S.Section>
          <S.SectionTitle>코스 기록</S.SectionTitle>
          <S.LinkCard onClick={() => navigate("/history")}>
            <div className="left">
              <img
                className="icon-img"
                src="/assets/Home_Focus.png"
                alt="코스 아이콘"
              />
              <div>
                <div className="desc">집중 코스 진행 중</div>
                <div className="title">연속 3일째</div>
              </div>
            </div>
            <div className="arrow">
              <img src="/assets/Goto.svg" alt="이동" />
            </div>
          </S.LinkCard>
        </S.Section>

        <S.Section>
          <S.SectionTitle>안전 안내</S.SectionTitle>
          <S.LinkCard onClick={() => alert("이상 증상 안내로 이동")}>
            <div className="left">
              <div>
                <div className="desc">심한 통증·급격한 악화 시 확인하세요</div>
                <div className="title">이상 증상 안내</div>
              </div>
            </div>
            <div className="arrow">
              <img src="/assets/Goto.svg" alt="이동" />
            </div>
          </S.LinkCard>
        </S.Section>
      </S.Container>

      <TabBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
    </>
  );
};

export default Mypage;
