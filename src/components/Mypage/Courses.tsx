import React from "react";
import * as S from "../../styles/CourseHistories.styles";

interface CoursesProps {
  iconSrc: string;
  description: string;
  title: string;
}

export const Courses: React.FC<CoursesProps> = ({
  iconSrc,
  description,
  title,
}) => {
  return (
    <S.CourseCard>
      <img className="icon-img" src={iconSrc} alt={title} />
      <div className="content">
        <div className="desc">{description}</div>
        <div className="title">{title}</div>
      </div>
    </S.CourseCard>
  );
};
