import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/Mypage.styles";
import { PageName } from "../components/PageName";
import { TabBar, type TabType } from "../components/TabBar";
import { procedureApi, type ProcedureItem } from "../api/procedure";
import { courseApi, type CurrentCourseResponse } from "../api/course";

const formatKoreanDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  }
  return dateStr;
};

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const navigate = useNavigate();

  const [procedures, setProcedures] = useState<ProcedureItem[]>([]);
  const [currentCourse, setCurrentCourse] =
    useState<CurrentCourseResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMypageData = async () => {
      try {
        const [procRes, courseRes] = await Promise.allSettled([
          procedureApi.getCurrentProcedures(),
          courseApi.getCurrentCourse(),
        ]);

        if (isMounted) {
          if (procRes.status === "fulfilled" && Array.isArray(procRes.value)) {
            setProcedures(procRes.value);
          }
          if (courseRes.status === "fulfilled") {
            setCurrentCourse(courseRes.value);
          }
        }
      } catch (error) {
        console.error("마이페이지 데이터 조회 실패:", error);
      }
    };

    fetchMypageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const latestProcedure = procedures[0];
  const remainingCount = latestProcedure
    ? Math.max(0, latestProcedure.totalCount - latestProcedure.currentCount)
    : 0;

  return (
    <>
      <PageName title="마이페이지" />

      <S.Container>
        <S.Section>
          <S.SectionTitle1>등록된 시술</S.SectionTitle1>
          {latestProcedure ? (
            <S.TreatmentCard>
              <div
                className="card-top"
                onClick={() => navigate("/add")}
                role="button"
                tabIndex={0}
              >
                <div className="info">
                  <h4>{latestProcedure.procedureTypeName}</h4>
                  <p>{formatKoreanDate(latestProcedure.procedureDate)} 시작</p>
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
                  <strong>{latestProcedure.currentCount}회</strong>
                </div>
                <div className="stat-box">
                  <span>잔여 횟수</span>
                  <strong>{remainingCount}회</strong>
                </div>
                <div className="stat-box">
                  <span>총 횟수</span>
                  <strong>{latestProcedure.totalCount}회</strong>
                </div>
              </div>
            </S.TreatmentCard>
          ) : (
            <S.TreatmentCard onClick={() => navigate("/add")}>
              <div className="card-top">
                <div className="info">
                  <h4>-</h4>
                  <p>-</p>
                </div>
              </div>
            </S.TreatmentCard>
          )}
        </S.Section>

        <S.Section>
          <S.SectionTitle>코스 기록</S.SectionTitle>
          <S.LinkCard onClick={() => navigate("/history")}>
            <div className="left">
              <img
                className="icon-img"
                src={
                  currentCourse?.courseType === "DAILY"
                    ? "/assets/Home_Daily.png"
                    : "/assets/Home_Focus.png"
                }
                alt="코스 아이콘"
              />
              <div>
                <div className="desc">{currentCourse?.label || "-"}</div>
                <div className="title">
                  {currentCourse?.streakDays !== undefined
                    ? `연속 ${currentCourse.streakDays}일째`
                    : "-"}
                </div>
              </div>
            </div>
            <div className="arrow">
              <img src="/assets/Goto.svg" alt="이동" />
            </div>
          </S.LinkCard>
        </S.Section>

        <S.Section>
          <S.SectionTitle>안전 안내</S.SectionTitle>
          <S.LinkCard onClick={() => navigate("/safety")}>
            <div className="left">
              <div>
                <div className="desc">심한 통증·급격한 악화 시 확인하세요</div>
                <div className="title">상담이 필요한 증상 확인</div>
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
