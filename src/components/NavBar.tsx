import React from "react";
import * as S from "../styles/NavBar.styles";

interface NavBarProps {
  title: string;
  onBackClick?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ title, onBackClick }) => {
  return (
    <S.Container>
      <S.IconButton onClick={onBackClick} aria-label="뒤로가기">
        <img src="/assets/Back.svg" alt="뒤로가기" />
      </S.IconButton>
      <S.Title>{title}</S.Title>
      <S.EmptySpace />
    </S.Container>
  );
};
