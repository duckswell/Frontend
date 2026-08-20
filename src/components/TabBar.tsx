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

      if (!currentCourse) {
        navigate("/care");
        return;
      }

      if (currentCourse.courseType === "DAILY") {
        const storedDailyCourse = getStoredDailyCourse();

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

        navigate("/care/daily_care", {
          state: {
            courseId: currentCourse.courseId,
          },
        });

        return;
      }

      navigate("/care");
    } catch (error) {
      console.error("케어 탭 현재 코스 확인 실패:", error);

      navigate("/care");
    } finally {
      setIsCheckingCareCourse(false);
    }
  }

  const handleTabClick = async (tab: (typeof tabs)[number]) => {
    onTabChange?.(tab.id);

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
