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

      <S.SwitchToFocusButton
        type="button"
        $currentVersion={currentVersion}
        onClick={onRestartFocus}
      >
        <S.ChangeImg $isFocus={currentVersion === "focus"} />
        심사용 리셋
      </S.SwitchToFocusButton>
    </S.Container>
  );
};
