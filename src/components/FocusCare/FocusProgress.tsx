import { useEffect, useState } from "react";

import * as S from "../../styles/FocusCare/FocusProgress.styles";

interface FocusProgressProps {
  currentStep: 1 | 2 | 3;
  variant?: "focus" | "daily";
}

export default function FocusProgress({
  currentStep,
  variant = "focus",
}: FocusProgressProps) {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsStarted(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <S.Container
      aria-label={`${
        variant === "daily" ? "데일리" : "집중"
      } 코스 ${currentStep}단계`}
    >
      {[1, 2, 3].map((step) => (
        <S.ProgressBar
          key={step}
          $completed={step < currentStep}
          $current={step === currentStep}
          $variant={variant}
          $isStarted={isStarted}
        />
      ))}
    </S.Container>
  );
}
