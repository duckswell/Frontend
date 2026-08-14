import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/Mypage.styles";
import { PageName } from "../components/PageName";
import { TabBar, type TabType } from "../components/TabBar";
import { procedureApi, type ProcedureItem } from "../api/procedure";
import { courseApi, type CourseDetail } from "../api/course";

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const navigate = useNavigate();

  const [procedures, setProcedures] = useState<ProcedureItem[]>([
    {
      id: 1,
      procedureType: "ACNE",
      procedureTypeName: "여드름 압출",
      procedureDate: "2026-06-10",
      currentCount: 1,
      totalCount: 5,
      areas: ["얼굴 전체"],
    },
  ]);
  const [currentCourse, setCurrentCourse] = useState<CourseDetail | null>({
    id: 1,
    courseType: "FOCUS",
    title: "집중 코스 진행 중",
    startDate: "2026-08-11",
    dayCount: 3,
  });

  useEffect(() => {
    const fetchMypageData = async () => {
      try {
        const [procRes, courseRes] = await Promise.allSettled([
          procedureApi.getCurrentProcedures(),
          courseApi.getCurrentCourse(),
        ]);

        if (procRes.status === "fulfilled" && procRes.value?.length > 0) {
          setProcedures(procRes.value);
        }
        if (courseRes.status === "fulfilled" && courseRes.value) {
          setCurrentCourse(courseRes.value);
        }
      } catch (error) {
        console.error("마이페이지 데이터 조회 실패:", error);
      }
    };

    fetchMypageData();
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
          <S.SectionTitle>등록된 시술</S.SectionTitle>
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
                  <p>{latestProcedure.procedureDate} 시작</p>
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
                  <h4>등록된 시술이 없습니다</h4>
                  <p>새 시술 정보를 등록해보세요</p>
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
                <div className="desc">
                  {currentCourse?.title || "집중 코스 진행 중"}
                </div>
                <div className="title">
                  {currentCourse?.dayCount
                    ? `연속 ${currentCourse.dayCount}일째`
                    : "진행 중인 코스 없음"}
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
