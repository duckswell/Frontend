import React from "react";
import * as S from "../../styles/Home.styles";

interface AITodosProps {
  title: string;
  description: string;
  isChecked: boolean;
  isFocus: boolean;
  onToggle: () => void;
}

export const AITodos: React.FC<AITodosProps> = ({
  title,
  description,
  isChecked,
  isFocus,
  onToggle,
}) => {
  return (
    <S.TodoCard $isChecked={isChecked} $isFocus={isFocus} onClick={onToggle}>
      <div className="checkbox">✓</div>
      <div className="content">
        <h4>{title}</h4>
        <p style={{ whiteSpace: "pre-line" }}>{description}</p>
      </div>
    </S.TodoCard>
  );
};
