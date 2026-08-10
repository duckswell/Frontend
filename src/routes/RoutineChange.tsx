import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { RoutineCard } from "../components/DailycoursePreview/RoutineCard";

import * as S from "../styles/DailyCare/RoutineChange.styles";

const ROUTINES = [
  {
    id: "cooldown",
    title: "쿨다운 루틴",
    description: "쉽게 붉어지고 예민해지는 피부를 진정",
    tags: ["센텔라", "판테놀", "알로에"],
    iconSrc: "/assets/Daily_cooldown.png",
  },
  {
    id: "clearup",
    title: "클리어업 루틴",
    description: "칙칙한 피부톤과 눈에 띄는 피부 흔적에 집중",
    tags: ["나이아신아마이드", "비타민C"],
    iconSrc: "/assets/Daily_clearup.png",
  },
  {
    id: "sebum",
    title: "피지컨트롤 루틴",
    description: "과도한 피지가 고민인 피부를 산뜻하고 깨끗하게",
    tags: ["나이아신아마이드", "징크PCA"],
    iconSrc: "/assets/Daily_pore.png",
  },
  {
    id: "moisture",
    title: "수분충전 루틴",
    description: "건조하고 당기는 피부에 수분을 채워 촉촉하게",
    tags: ["히알루론산", "세라마이드", "판테놀"],
    iconSrc: "/assets/Daily_barrier.png",
  },
];

export default function RoutineChange() {
  const navigate = useNavigate();

  const currentRoutineId = "cooldown";
  const [selectedRoutineId, setSelectedRoutineId] = useState("clearup");

  const handleSelectRoutine = (routineId: string) => {
    setSelectedRoutineId(routineId);
  };

  const handleStartRoutine = () => {
    console.log({
      selectedRoutineId,
    });

    navigate("/care");
  };

  return (
    <S.Page>
      <NavBar title="데일리 코스 루틴 변경" />

      <S.Content>
        <S.IntroSection>
          <S.Title>쿨다운 루틴을 7일 동안 실천했어요</S.Title>

          <S.Description>
            다른 피부 고민도 관리하고 싶다면 새로운 루틴을 둘러보세요
          </S.Description>
        </S.IntroSection>

        <S.RoutineList>
          {ROUTINES.map((routine) => {
            const isCurrentRoutine = routine.id === currentRoutineId;
            const isSelected = routine.id === selectedRoutineId;

            return (
              <S.RoutineCardWrapper key={routine.id}>
                {isCurrentRoutine && (
                  <S.CurrentRoutineBadge>현재 루틴</S.CurrentRoutineBadge>
                )}

                <RoutineCard
                  id={routine.id}
                  title={routine.title}
                  description={routine.description}
                  tags={routine.tags}
                  iconSrc={routine.iconSrc}
                  isSelected={isSelected}
                  onClick={() => handleSelectRoutine(routine.id)}
                />
              </S.RoutineCardWrapper>
            );
          })}
        </S.RoutineList>
      </S.Content>

      <S.BottomArea>
        <S.SubmitButton type="button" onClick={handleStartRoutine}>
          이 루틴으로 시작하기
        </S.SubmitButton>
      </S.BottomArea>
    </S.Page>
  );
}
