import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/Onboarding.styles";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  const handleGuestStart = () => {
    navigate("/home", { replace: true });
  };

  return (
    <S.Container>
      <S.ContentArea>
        <S.Logo>
          <img src="/icons.svg" alt="HALE 로고" />
        </S.Logo>
        <S.TextGroup>
          <S.Title>HALE에 오신 것을 환영해요</S.Title>
          <S.Description>
            시술 후 달라지는 피부를 위한
            <br />
            AI 맞춤 회복 케어 루틴을 시작해보세요.
          </S.Description>
        </S.TextGroup>
      </S.ContentArea>

      <S.BottomArea>
        <S.GuestButton type="button" onClick={handleGuestStart}>
          게스트로 시작하기
        </S.GuestButton>
      </S.BottomArea>
    </S.Container>
  );
};

export default Onboarding;
