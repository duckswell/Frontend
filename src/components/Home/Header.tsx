import React, { useState } from "react";
import * as S from "../../styles/Header.styles";
// [백엔드 연동 주석처리] 아카이빙을 위해 데모 리셋 API 대신 브라우저에 저장된 진행 상태만 초기화
// import { demoApi } from "../../api/demo";

interface HeaderProps {
  currentVersion: "focus" | "daily";
  onRestartFocus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentVersion }) => {
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleReset = async () => {
    if (isResetting) return;

    try {
      setIsResetting(true);
      // await demoApi.resetDemoData();
      await Promise.resolve();

      sessionStorage.removeItem("currentDailyCourse");

      window.location.href = "/home";
    } catch (error) {
      console.error("데모 데이터 리셋 실패:", error);
      alert("데이터 리셋에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <S.Container>
      <S.Logo onClick={() => (window.location.href = "/")}>
        <img src="/icons.svg" alt="로고" />
      </S.Logo>

      <S.SwitchToFocusButton
        type="button"
        $currentVersion={currentVersion}
        onClick={handleReset}
        disabled={isResetting}
      >
        <S.ChangeImg $isFocus={currentVersion === "focus"} />
        {isResetting ? "리셋 중..." : "리셋"}
      </S.SwitchToFocusButton>
    </S.Container>
  );
};
