import { useEffect, useState } from "react";

import * as S from "../../styles/FocusCare/AnalysisLoading.styles";

interface AnalysisLoadingProps {
  onComplete: () => void;
  variant?: "focus" | "daily";
}

export default function AnalysisLoading({
  onComplete,
  variant = "focus",
}: AnalysisLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((previousProgress) => {
        if (previousProgress >= 99) {
          window.clearInterval(interval);

          return 100;
        }

        return previousProgress + 1;
      });
    }, 40);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <S.Container>
      <S.ProgressCircle>
        {progress < 100 && (
          <S.Spinner viewBox="0 0 150 150">
            <defs>
              <linearGradient
                id="spinnerGradient"
                x1="27"
                y1="92"
                x2="62"
                y2="124"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="15%" stopColor="#90D9FF" />
                <stop offset="36%" stopColor="#B6F3FF" />
                <stop offset="100%" stopColor="#F5FCFF" />
              </linearGradient>

              <linearGradient
                id="dailySpinnerGradient"
                x1="27"
                y1="92"
                x2="62"
                y2="124"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="15%" stopColor="#CAE981" />
                <stop offset="52%" stopColor="#F7F9B2" />
                <stop offset="100%" stopColor="#F8FBEA" />
              </linearGradient>
            </defs>

            <path
              d="M 27 92 A 55 55 0 0 0 62 124"
              fill="none"
              stroke={
                variant === "daily"
                  ? "url(#dailySpinnerGradient)"
                  : "url(#spinnerGradient)"
              }
              strokeWidth="11"
              strokeLinecap="round"
            />
          </S.Spinner>
        )}

        <S.ProgressText $variant={variant}>
          <S.ProgressNumber>{progress}</S.ProgressNumber>
          <S.ProgressUnit>%</S.ProgressUnit>
        </S.ProgressText>
      </S.ProgressCircle>

      <S.TextArea>
        <S.Title>오늘의 맞춤 루틴을 만들고 있어요</S.Title>

        <S.Description>
          AI 피부 분석 결과에 맞춰
          <br />
          지금 필요한 성분과 관리 순서를 조합 중이에요
        </S.Description>
      </S.TextArea>
    </S.Container>
  );
}
