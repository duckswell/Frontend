import * as S from "../../styles/FocusCare/RoutineOptionCard.styles";

interface RoutineOptionCardProps {
  title: string;
  time: string;
  description: string;
  steps: string;
  selected: boolean;
  onClick: () => void;
}

export default function RoutineOptionCard({
  title,
  time,
  description,
  steps,
  selected,
  onClick,
}: RoutineOptionCardProps) {
  return (
    <S.Card type="button" $selected={selected} onClick={onClick}>
      <S.TopRow>
        <S.RoutineTitle $selected={selected}>{title}</S.RoutineTitle>

        <S.TimeArea $selected={selected}>
          <S.ClockIcon
            src={selected ? "/assets/BlueClock.svg" : "/assets/GrayClock.svg"}
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
