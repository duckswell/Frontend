import React from "react";
import * as S from "../styles/PageName.styles";

interface PageNameProps {
  title: string;
}

export const PageName: React.FC<PageNameProps> = ({ title }) => {
  return (
    <S.Container>
      <S.Title>{title}</S.Title>
    </S.Container>
  );
};
