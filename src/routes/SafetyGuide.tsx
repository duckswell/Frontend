import React from "react";
import * as S from "../styles/SafetyGuide.styles";
import { NavBar } from "../components/NavBar";

const SafetyGuide: React.FC = () => {
  const criteriaList = [
    "심한 통증 또는 압통이 있는 경우",
    "붓기나 붉은기가 급격히 악화된 경우",
    "진물이나 고름 등 분비물이 증가한 경우",
    "발열 또는 전신 이상 반응이 동반된 경우",
    "피부색이 비정상적으로 변하거나 감각 이상이 느껴지는 경우",
  ];

  return (
    <>
      <NavBar title="상담이 필요한 증상 확인" />

      <S.Container>
        <S.LeftColumn>
          <S.Section>
            <S.Title1>이상 증상 안전 안내</S.Title1>
            <S.SubDesc>
              아래 증상이 확인되면 오늘 루틴을 중단하고, <br></br> 시술 병원
              또는 의료기관에 상담하세요.
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
              HALE의 피부 분석 결과는 의료적 진단을 대체하지 않아요 <br />
              증상의 원인이나 치료 필요 여부는 의료진에게 확인해 주세요
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
