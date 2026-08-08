import React from "react";
import * as S from "../../styles/DailycoursePreview.styles";

export interface RoutineCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  iconSrc: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  title,
  description,
  tags,
  iconSrc,
  isSelected = false,
  onClick,
}) => {
  return (
    <S.CardContainer $isSelected={isSelected} onClick={onClick}>
      <S.IconImage src={iconSrc} alt={title} />
      <S.ContentBox>
        <S.CardTitle>{title}</S.CardTitle>
        <S.CardDescription>{description}</S.CardDescription>
        <S.TagList>
          {tags.map((tag, index) => (
            <S.TagChip key={index}>{tag}</S.TagChip>
          ))}
        </S.TagList>
      </S.ContentBox>
    </S.CardContainer>
  );
};
