import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/CourseHistories.styles";
import { Courses } from "../components/Mypage/Courses";
import { NavBar } from "../components/NavBar";
import {
  courseApi,
  type CurrentCourseResponse,
  type PastCourseHistoryItem,
} from "../api/course";

interface CourseViewItem {
  id: number;
  iconSrc: string;
  description: string;
  title: string;
}

const CourseHistories: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCourse, setCurrentCourse] = useState<CourseViewItem | null>(
    null,
  );
  const [pastCourses, setPastCourses] = useState<CourseViewItem[]>([]);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const [currentRes, historyRes] = await Promise.allSettled([
        courseApi.getCurrentCourse(),
        courseApi.getCourseHistory(),
      ]);

      if (currentRes.status === "fulfilled" && currentRes.value) {
        const cur: CurrentCourseResponse = currentRes.value;
        setCurrentCourse({
          id: cur.courseId,
          iconSrc:
            cur.courseType === "DAILY"
              ? "/assets/Home_Daily.png"
              : "/assets/Home_Focus.png",
          description:
            cur.label ||
            (cur.courseType === "DAILY" ? "데일리 코스" : "집중 코스"),
          title: `연속 ${cur.streakDays}일째`,
        });
      } else {
        setCurrentCourse(null);
      }

      if (
        historyRes.status === "fulfilled" &&
        Array.isArray(historyRes.value)
      ) {
        const list: PastCourseHistoryItem[] = historyRes.value;

        const completedList = list
          .filter((c) => Boolean(c.endedAt))
          .sort((a, b) => Number(b.id) - Number(a.id));

        setPastCourses(
          completedList.map((c) => {
            const start = c.startedAt
              ? `${c.startedAt.replace(/-/g, ".")} ~ `
              : "";
            const end = c.endedAt ? c.endedAt.replace(/-/g, ".") : "";

            return {
              id: c.id,
              iconSrc:
                c.courseType === "DAILY"
                  ? "/assets/Home_Daily.png"
                  : "/assets/Home_Focus.png",
              description: `${start}${end}`,
              title: c.routineTypeName
                ? `데일리 ${c.routineTypeName} 루틴 완료`
                : c.courseType === "DAILY"
                  ? "데일리 코스 완료"
                  : "집중 코스 완료",
            };
          }),
        );
      }
    } catch (error) {
      console.error("코스 기록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, [fetchHistory]);

  return (
    <>
      <NavBar title="코스 기록" />

      <S.Container>
        <S.Section>
          <S.SectionTitle1>현재 진행중인 코스</S.SectionTitle1>
          {isLoading ? (
            <Courses
              iconSrc="/assets/Home_Focus.png"
              description="코스 정보를 불러오는 중입니다"
              title="로딩 중..."
            />
          ) : currentCourse ? (
            <Courses
              iconSrc={currentCourse.iconSrc}
              description={currentCourse.description}
              title={currentCourse.title}
            />
          ) : (
            <Courses
              iconSrc="/assets/Home_Focus.png"
              description="진행 중인 코스가 없습니다"
              title="새 코스를 시작해보세요"
            />
          )}
        </S.Section>

        <S.Section>
          <S.SectionTitle>지난 코스 기록</S.SectionTitle>
          {isLoading ? (
            <Courses
              iconSrc="/assets/Home_Daily.png"
              description="지난 기록을 불러오는 중입니다"
              title="로딩 중..."
            />
          ) : pastCourses.length > 0 ? (
            pastCourses.map((course) => (
              <Courses
                key={course.id}
                iconSrc={course.iconSrc}
                description={course.description}
                title={course.title}
              />
            ))
          ) : (
            <Courses
              iconSrc="/assets/Home_Daily.png"
              description="완료된 코스 기록이 없습니다"
              title="코스를 완료해보세요"
            />
          )}
        </S.Section>

        <S.InfoNoticeCard>
          <div className="notice-header">
            <img src="/assets/WarningMark.svg" alt="관리 안내" /> 관리 안내
          </div>
          <p className="notice-desc">
            의료 진단이 아닙니다.
            <br />
            기록된 루틴 완료 현황은 자가 관리 습관 점검용입니다.
            <br />
            피부과 진료가 필요한 증상이 있으면 병원에 상담하세요.
          </p>
          <button
            type="button"
            className="safety-btn"
            onClick={() => navigate("/safety")}
          >
            이상 증상 안전 안내
          </button>
        </S.InfoNoticeCard>
      </S.Container>
    </>
  );
};

export default CourseHistories;
