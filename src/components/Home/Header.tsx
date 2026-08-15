import React from "react";
import * as S from "../../styles/Header.styles";

interface HeaderProps {
  currentVersion: "focus" | "daily";
  onRestartFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentVersion,
  onRestartFocus,
}) => {
  return (
    <S.Container>
      <S.Logo>
        <img src="/icons.svg" alt="로고" />
      </S.Logo>
      {currentVersion === "daily" && (
        <S.SwitchToFocusButton type="button" onClick={onRestartFocus}>
          집중코스로 →
        </S.SwitchToFocusButton>
      )}{" "}
      {/* 해당 버튼은 해커톤 데모데이 때 원활한 진행을 돕기 위한 버튼으로, 실 서비스 배포시엔 없을 예정 */}
    </S.Container>
  );
};
