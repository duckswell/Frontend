import { useState } from "react";

import * as S from "../../styles/FocusCare/RoutineOptionCard.styles";

interface RoutineOptionCardProps {
  title: string;
  time: string;
  description: string;
  steps: string;
  selected: boolean;
  variant?: "focus" | "daily";
  onClick: () => void;
}

export default function RoutineOptionCard({
  title,
  time,
  description,
  steps,
  selected,
  variant = "focus",
  onClick,
}: RoutineOptionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isDaily = variant === "daily";
  const isHighlighted = selected || isHovered;

  return (
    <S.Card
      type="button"
      $selected={isHighlighted}
      $variant={variant}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <S.TopRow>
        <S.RoutineTitle $selected={isHighlighted} $variant={variant}>
          {title}
        </S.RoutineTitle>

        <S.TimeArea $selected={isHighlighted} $variant={variant}>
          <S.ClockIcon
            src={
              isHighlighted
                ? isDaily
                  ? "/assets/GreenClock.svg"
                  : "/assets/BlueClock.svg"
                : "/assets/GrayClock.svg"
            }
            alt=""
            aria-hidden="true"
          />

          <S.TimeText>{time}</S.TimeText>
        </S.TimeArea>
      </S.TopRow>

      <S.RoutineDescription>{description}</S.RoutineDescription>

      <S.RoutineSteps>{steps}</S.RoutineSteps>
    </S.Card>
  );
}
