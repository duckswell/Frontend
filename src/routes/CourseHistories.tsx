import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/CourseHistories.styles";
import { Courses } from "../components/Mypage/Courses";
import { NavBar } from "../components/NavBar";
// [백엔드 연동 주석처리] 아카이빙을 위해 API 대신 목 데이터 사용
// import {
//   courseApi,
//   type CurrentCourseResponse,
//   type PastCourseHistoryItem,
// } from "../api/course";
import {
  type CurrentCourseResponse,
  type PastCourseHistoryItem,
} from "../api/course";
import { getMockCurrentCourse } from "../mocks/dailyCare";

type ExtendedCurrentCourse = CurrentCourseResponse & {
  routineTypeName?: string;
  routineType?: string;
  label?: string;
  id?: number;
};

type ExtendedPastCourse = PastCourseHistoryItem & {
  routineType?: string;
  label?: string;
};

interface CourseViewItem {
  id: number;
  iconSrc: string;
  description: string;
  title: string;
}

// 기본 완료 코스 목 데이터 목록
const BASE_PAST_COURSES: ExtendedPastCourse[] = [
  {
    id: 102,
    courseType: "DAILY",
    routineTypeCode: "HYDRATION",
    routineTypeName: "수분 보충 루틴",
    startedAt: "2026-08-17",
    endedAt: "2026-08-25",
    status: "COMPLETED",
  },
  {
    id: 101,
    courseType: "FOCUS",
    routineTypeCode: null,
    routineTypeName: "진정·재생 집중 코스",
    startedAt: "2026-08-10",
    endedAt: "2026-08-16",
    status: "COMPLETED",
  },
];

const CourseHistories: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCourse, setCurrentCourse] = useState<CourseViewItem | null>(
    null,
  );
  const [pastCourses, setPastCourses] = useState<CourseViewItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        // [백엔드 연동 주석처리] API 대신 목 데이터 매핑
        // const [currentRes, historyRes] = await Promise.allSettled([
        //   courseApi.getCurrentCourse(),
        //   courseApi.getCourseHistory(),
        // ]);

        const cur = getMockCurrentCourse() as ExtendedCurrentCourse | null;

        if (!isMounted) return;

        if (cur) {
          const routineName =
            cur.routineTypeName || cur.routineType || cur.label;

          setCurrentCourse({
            id: cur.courseId ?? cur.id ?? 0,
            iconSrc:
              cur.courseType === "DAILY"
                ? "/assets/Home_Daily.png"
                : "/assets/Home_Focus.png",
            description: routineName
              ? cur.courseType === "DAILY"
                ? `데일리 ${routineName} 루틴 진행 중`
                : "집중 코스 진행 중"
              : cur.courseType === "DAILY"
                ? "데일리 코스 진행 중"
                : "집중 코스 진행 중",
            title: `연속 ${cur.streakDays ?? 0}일째`,
          });
        } else {
          setCurrentCourse(null);
        }

        // 데일리 코스 진행 중일 때, 직전에 마친 집중 코스를 지난 내역의 최상단에 동적 추가
        let list = [...BASE_PAST_COURSES];

        if (cur && cur.courseType === "DAILY") {
          const hasRecentFocus = list.some((item) => item.id === 201);
          if (!hasRecentFocus) {
            const completedFocusItem: ExtendedPastCourse = {
              id: 201,
              courseType: "FOCUS",
              routineTypeCode: null,
              routineTypeName: "진정·재생 집중 코스",
              startedAt: "2026-08-26",
              endedAt: "2026-09-01",
              status: "COMPLETED",
            };
            list = [completedFocusItem, ...list];
          }
        }

        const completedList = list
          .filter((c) => Boolean(c.endedAt))
          .sort((a, b) => Number(b.id) - Number(a.id));

        setPastCourses(
          completedList.map((c) => {
            const start = c.startedAt
              ? `${c.startedAt.replace(/-/g, ".")} ~ `
              : "";
            const end = c.endedAt ? c.endedAt.replace(/-/g, ".") : "";
            const routineName = c.routineTypeName || c.routineType || c.label;

            return {
              id: c.id,
              iconSrc:
                c.courseType === "DAILY"
                  ? "/assets/Home_Daily.png"
                  : "/assets/Home_Focus.png",
              description: `${start}${end}`,
              title: routineName
                ? c.courseType === "DAILY"
                  ? `데일리 ${routineName} 완료`
                  : `${routineName} 완료`
                : c.courseType === "DAILY"
                  ? "데일리 코스 완료"
                  : "집중 코스 완료",
            };
          }),
        );
      } catch (error) {
        console.error("코스 기록 조회 실패:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

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
            상담이 필요한 증상 확인
          </button>
        </S.InfoNoticeCard>
      </S.Container>
    </>
  );
};

export default CourseHistories;
