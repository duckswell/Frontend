import React, { useState } from "react";
import * as S from "../../styles/Header.styles";
import { demoApi } from "../../api/demo";

interface HeaderProps {
  currentVersion: "focus" | "daily";
}

export const Header: React.FC<HeaderProps> = ({ currentVersion }) => {
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleReset = async () => {
    if (isResetting) return;

    try {
      setIsResetting(true);
      await demoApi.resetDemoData();

      sessionStorage.removeItem("currentDailyCourse");

      window.location.href = "/";
    } catch (error) {
      console.error("심사용 데모 데이터 리셋 실패:", error);
      alert("심사용 데이터 리셋에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
        {isResetting ? "리셋 중..." : "심사용 리셋"}
      </S.SwitchToFocusButton>
    </S.Container>
  );
};
