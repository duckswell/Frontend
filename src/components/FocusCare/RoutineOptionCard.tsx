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
  const isDaily = variant === "daily";

  return (
    <S.Card
      type="button"
      $selected={selected}
      $variant={variant}
      onClick={onClick}
    >
      <S.TopRow>
        <S.RoutineTitle $selected={selected} $variant={variant}>
          {title}
        </S.RoutineTitle>

        <S.TimeArea $selected={selected} $variant={variant}>
          <S.ClockIcon
            src={
              selected
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
