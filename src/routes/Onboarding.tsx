import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/Onboarding.styles";
// [백엔드 연동 주석처리] 프론트 단독 실행을 위해 API 호출 제거
// import { authApi } from "../api/auth";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hasToken = Boolean(localStorage.getItem("guestToken"));

  useEffect(() => {
    if (hasToken) {
      navigate("/home", { replace: true });
    }
  }, [hasToken, navigate]);

  const handleGuestStart = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      // [백엔드 연동 주석처리] 게스트 로그인 API 대신 목(mock) 데이터 사용
      // const data = await authApi.loginGuest();
      const data = {
        guestToken: "mock-guest-token",
        memberId: 1,
        nickname: "게스트",
      };

      localStorage.setItem("guestToken", data.guestToken);
      localStorage.setItem("memberId", String(data.memberId));
      localStorage.setItem("nickname", data.nickname);

      navigate("/home", { replace: true });
    } catch (error) {
      console.error("게스트 로그인 실패:", error);
      alert("로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (hasToken) {
    return null;
  }

  return (
    <S.Container>
      <S.BgLeft src="/assets/OnboardingLeft.svg" alt="" />
      <S.BgRight src="/assets/OnboardingRight.svg" alt="" />

      <S.CenterContent>
        <S.Subtitle>
          시술 후 회복에서 시작해,
          <br />
          건강한 피부 관리가 일상이 될 때까지
        </S.Subtitle>
        <S.BrandLogoImg src="/icons.svg" alt="HALE" />
      </S.CenterContent>

      <S.BottomArea>
        <S.GuestButton
          type="button"
          onClick={handleGuestStart}
          disabled={isLoading}
        >
          {isLoading ? "시작하는 중..." : "게스트로 시작하기"}
        </S.GuestButton>
      </S.BottomArea>
    </S.Container>
  );
};

export default Onboarding;
