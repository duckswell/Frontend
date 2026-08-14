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
      )}
    </S.Container>
  );
};
