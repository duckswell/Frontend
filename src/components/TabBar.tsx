import React from "react";
import * as S from "../styles/TabBar.styles";

export type TabType = "home" | "care" | "recommend" | "my";

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: {
    id: TabType;
    label: string;
    activeIcon: string;
    inactiveIcon: string;
  }[] = [
    {
      id: "home",
      label: "홈",
      activeIcon: "/assets/Home_active.svg",
      inactiveIcon: "/assets/Home.svg",
    },
    {
      id: "care",
      label: "케어",
      activeIcon: "/assets/Care_active.svg",
      inactiveIcon: "/assets/Care.svg",
    },
    {
      id: "recommend",
      label: "추천",
      activeIcon: "/assets/Recommend_active.svg",
      inactiveIcon: "/assets/Recommend.svg",
    },
    {
      id: "my",
      label: "마이",
      activeIcon: "/assets/My_active.svg",
      inactiveIcon: "/assets/My.svg",
    },
  ];

  return (
    <S.Container>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <S.TabItem
            key={tab.id}
            $isActive={isActive}
            onClick={() => onTabChange(tab.id)}
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
