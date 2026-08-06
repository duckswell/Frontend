import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/CourseHistories.styles";
import { Courses } from "../components/Mypage/Courses";
import { NavBar } from "../components/NavBar";

interface CourseItem {
  id: number;
  iconSrc: string;
  description: string;
  title: string;
}

const CourseHistories: React.FC = () => {
  const navigate = useNavigate();

  const currentCourse: CourseItem = {
    id: 0,
    iconSrc: "/assets/Home_Focus.png",
    description: "집중 코스 진행 중",
    title: "연속 3일째",
  };

  const pastCourses: CourseItem[] = [
    {
      id: 1,
      iconSrc: "/assets/Home_Focus.png",
      description: "2026년 7월 21일 ~ 2026년 7월 28일",
      title: "집중 코스 완료",
    },
    {
      id: 2,
      iconSrc: "/assets/Home_Daily.png",
      description: "2026년 7월 21일 ~ 2026년 7월 28일",
      title: "데일리 수분 코스 완료",
    },
    {
      id: 3,
      iconSrc: "/assets/Home_Daily.png",
      description: "2026년 7월 21일 ~ 2026년 7월 28일",
      title: "데일리 수분 코스 완료",
    },
    {
      id: 4,
      iconSrc: "/assets/Home_Focus.png",
      description: "2026년 7월 21일 ~ 2026년 7월 28일",
      title: "집중 코스 완료",
    },
    {
      id: 5,
      iconSrc: "/assets/Home_Daily.png",
      description: "2026년 7월 21일 ~ 2026년 7월 28일",
      title: "데일리 수분 코스 완료",
    },
  ];

  return (
    <>
      <NavBar title="코스 기록" />

      <S.Container>
        <S.Section>
          <S.SectionTitle>현재 진행중인 코스</S.SectionTitle>
          <Courses
            iconSrc={currentCourse.iconSrc}
            description={currentCourse.description}
            title={currentCourse.title}
          />
        </S.Section>

        <S.Section>
          <S.SectionTitle>지난 코스 기록</S.SectionTitle>
          {pastCourses.map((course) => (
            <Courses
              key={course.id}
              iconSrc={course.iconSrc}
              description={course.description}
              title={course.title}
            />
          ))}
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
