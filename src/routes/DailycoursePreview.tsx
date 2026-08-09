import React, { useState } from "react";
import * as S from "../styles/DailycoursePreview.styles";
import { NavBar } from "../components/NavBar";
import { RoutineCard } from "../components/DailycoursePreview/RoutineCard";
import type { RoutineCardProps } from "../components/DailycoursePreview/RoutineCard";

const ROUTINE_DATA: RoutineCardProps[] = [
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
    tags: ["나이아신아마이드", "징크 PCA"],
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

const DailycoursePreview: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedId) return;
  };

  return (
    <>
      <NavBar title="데일리 코스 루틴" />

      <S.Container>
        <S.BannerCard>
          <S.BannerTitle>내 피부 고민에 맞는 관리를 꾸준히</S.BannerTitle>
          <S.BannerDesc>
            네 가지 데일리 루틴 중 하나를 선택해 매일 꾸준히 관리해요
          </S.BannerDesc>
          <S.TimeInfo>
            <img src="/assets/Clock.svg" alt="시계" />
            <span>최소 하루 약 5분</span>
          </S.TimeInfo>
        </S.BannerCard>

        <S.SectionHeader>
          <S.Title>어떤 관리에 집중하고 싶으세요?</S.Title>
          <S.SubDesc>
            지금 가장 신경 쓰이는 피부 고민에 맞춰 루틴을 선택해 주세요
            {"\n"}선택한 루틴은 언제든 변경할 수 있어요
          </S.SubDesc>
        </S.SectionHeader>

        <S.RoutineList>
          {ROUTINE_DATA.map((item) => (
            <RoutineCard
              key={item.id}
              {...item}
              isSelected={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </S.RoutineList>

        <S.SubmitButton
          type="button"
          disabled={!selectedId}
          onClick={handleSubmit}
        >
          이 루틴으로 시작하기
        </S.SubmitButton>
      </S.Container>
    </>
  );
};

export default DailycoursePreview;
