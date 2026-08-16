import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { courseApi, type RoutineTypeCode } from "../api/course";

import * as S from "../styles/TabBar.styles";

export type TabType = "home" | "care" | "recommend" | "my";

interface TabBarProps {
  activeTab: TabType;
  onTabChange?: (tab: TabType) => void;
}

interface StoredDailyCourse {
  courseId: number;
  routineTypeCode: RoutineTypeCode;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const [isCheckingCareCourse, setIsCheckingCareCourse] = useState(false);

  const tabs: {
    id: TabType;
    label: string;
    path: string;
    activeIcon: string;
    inactiveIcon: string;
  }[] = [
    {
      id: "home",
      label: "홈",
      path: "/",
      activeIcon: "/assets/Home_active.svg",
      inactiveIcon: "/assets/Home.svg",
    },
    {
      id: "care",
      label: "케어",
      path: "/care",
      activeIcon: "/assets/Care_active.svg",
      inactiveIcon: "/assets/Care.svg",
    },
    {
      id: "recommend",
      label: "추천",
      path: "/recommend",
      activeIcon: "/assets/Recommend_active.svg",
      inactiveIcon: "/assets/Recommend.svg",
    },
    {
      id: "my",
      label: "마이",
      path: "/my",
      activeIcon: "/assets/My_active.svg",
      inactiveIcon: "/assets/My.svg",
    },
  ];

  function getStoredDailyCourse(): StoredDailyCourse | null {
    try {
      const stored = sessionStorage.getItem("currentDailyCourse");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored) as StoredDailyCourse;
    } catch (error) {
      console.error("저장된 데일리 코스 정보 확인 실패:", error);

      return null;
    }
  }

  async function handleCareTabClick() {
    if (isCheckingCareCourse) {
      return;
    }

    try {
      setIsCheckingCareCourse(true);

      const currentCourse = await courseApi.getCurrentCourse();

      console.log("케어 탭 - 현재 진행 중인 코스:", currentCourse);

      /*
       * 진행 중인 코스가 없는 경우
       * 기본 Care 페이지로 이동
       */
      if (!currentCourse) {
        navigate("/care");
        return;
      }

      /*
       * DAILY 코스를 진행 중이면
       * DailyCare로 바로 이동
       */
      if (currentCourse.courseType === "DAILY") {
        const storedDailyCourse = getStoredDailyCourse();

        /*
         * 저장된 코스와 현재 백엔드의 코스가 같으면
         * routineTypeCode도 같이 전달한다.
         */
        if (
          storedDailyCourse &&
          storedDailyCourse.courseId === currentCourse.courseId
        ) {
          navigate("/care/daily_care", {
            state: {
              courseId: currentCourse.courseId,
              routineTypeCode: storedDailyCourse.routineTypeCode,
            },
          });

          return;
        }

        /*
         * sessionStorage가 없는 경우에도
         * DailyCare 자체에서 현재 코스 조회 및
         * label fallback을 처리하므로 이동은 가능하다.
         */
        navigate("/care/daily_care", {
          state: {
            courseId: currentCourse.courseId,
          },
        });

        return;
      }

      /*
       * FOCUS 코스 진행 중이거나
       * 그 외의 경우에는 기존 Care 페이지
       */
      navigate("/care");
    } catch (error) {
      console.error("케어 탭 현재 코스 확인 실패:", error);

      /*
       * API 확인에 실패해도 사용자가
       * 케어 탭에 진입하지 못하는 일은 없도록
       * 기본 Care 페이지로 이동
       */
      navigate("/care");
    } finally {
      setIsCheckingCareCourse(false);
    }
  }

  const handleTabClick = async (tab: (typeof tabs)[number]) => {
    onTabChange?.(tab.id);

    /*
     * 케어 탭만 현재 진행 중인 코스를 확인해서
     * 목적지를 결정한다.
     */
    if (tab.id === "care") {
      await handleCareTabClick();
      return;
    }

    navigate(tab.path);
  };

  return (
    <S.Container>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <S.TabItem
            key={tab.id}
            $isActive={isActive}
            onClick={() => handleTabClick(tab)}
          >
            <S.Icon
              src={isActive ? tab.activeIcon : tab.inactiveIcon}
              alt={tab.label}
            />

            <span>{tab.label}</span>
          </S.TabItem>
        );
      })}
    </S.Container>
  );
};
