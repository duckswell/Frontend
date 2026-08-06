import React from "react";
import * as S from "../styles/SafetyGuide.styles";
import { NavBar } from "../components/NavBar";

const SafetyGuide: React.FC = () => {
  const criteriaList = [
    "심한 통증 또는 압통이 있는 경우",
    "붓기나 발적이 급격히 악화된 경우",
    "진물·고름 등 분비물이 증가한 경우",
    "발열 또는 전신 이상 반응이 동반된 경우",
    "가려움증이나 두드러기가 심하게 발생하는 경우",
  ];

  return (
    <>
      <NavBar title="이상 증상 안전 안내" />

      <S.Container>
        <S.LeftColumn>
          <S.Section>
            <S.Title>이상 증상 안전 안내</S.Title>
            <S.SubDesc>
              아래 증상이 확인되면 오늘 루틴을 중단하고 시술 병원 또는
              의료기관에 상담하세요.
            </S.SubDesc>
          </S.Section>

          <S.Section>
            <S.SectionTitle>상담 권고 기준</S.SectionTitle>
            {criteriaList.map((item, index) => (
              <S.GuideCard key={index}>{item}</S.GuideCard>
            ))}
          </S.Section>
        </S.LeftColumn>

        <S.RightColumn>
          <S.InfoNoticeCard>
            <div className="notice-header">
              <img src="/assets/WarningMark.svg" alt="관리 안내" /> 서비스 이용
              안내
            </div>
            <p className="notice-desc">
              이 안내는 의료 진단을 대체하지 않습니다. 증상의 원인 판정, 치료
              필요성 결정, 응급 여부 판단은 의료 전문가만 할 수 있습니다. 본
              서비스는 일상 피부 관리 목적으로만 활용해 주세요.
            </p>
          </S.InfoNoticeCard>

          <S.ContactCard>
            <div className="title">상담 연결</div>
            <div className="time">
              <S.OperatingTime>운영시간</S.OperatingTime> 평일 09:00 - 18:00
              (점심시간 : 12:00 - 13:00)
            </div>
            <S.CallButton href="tel:02-3478-8970">전화 상담</S.CallButton>
          </S.ContactCard>
        </S.RightColumn>
      </S.Container>
    </>
  );
};

export default SafetyGuide;
