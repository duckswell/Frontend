import React from "react";
import * as S from "../../styles/Header.styles";

interface HeaderProps {
  currentVersion: "focus" | "daily";
  onToggleVersion: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentVersion,
  onToggleVersion,
}) => {
  return (
    <S.Container>
      <S.Logo>
        <img src="/icons.svg" alt="로고" />
      </S.Logo>

      <S.ToggleWrapper onClick={onToggleVersion}>
        <S.ToggleOption
          $isActive={currentVersion === "focus"}
          $isFocusOption={true}
        >
          집중
        </S.ToggleOption>
        <S.ToggleOption
          $isActive={currentVersion === "daily"}
          $isFocusOption={false}
        >
          데일리
        </S.ToggleOption>
      </S.ToggleWrapper>
    </S.Container>
  );
};
