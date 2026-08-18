import { useEffect, useRef, useState } from "react";

import * as S from "../../styles/FocusCare/AnalysisLoading.styles";

interface AnalysisLoadingProps {
  onComplete: () => void;
  variant?: "focus" | "daily";
  type?: "routine" | "image" | "diagnosis";
  isComplete?: boolean;
}

export default function AnalysisLoading({
  onComplete,
  variant = "focus",
  type = "routine",
  isComplete,
}: AnalysisLoadingProps) {
  const [progress, setProgress] = useState(0);

  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (isComplete === undefined) {
      return;
    }

    if (!isComplete) {
      const interval = window.setInterval(() => {
        setProgress((previousProgress) => {
          if (previousProgress >= 85) {
            return 85;
          }

          if (previousProgress < 35) {
            return Math.min(previousProgress + 2, 85);
          }

          if (previousProgress < 65) {
            return Math.min(previousProgress + 1, 85);
          }

          return Math.min(previousProgress + 1, 85);
        });
      }, 90);

      return () => {
        window.clearInterval(interval);
      };
    }

    const completionInterval = window.setInterval(() => {
      setProgress((previousProgress) => {
        if (previousProgress >= 100) {
          window.clearInterval(completionInterval);

          return 100;
        }

        return Math.min(previousProgress + 5, 100);
      });
    }, 30);

    return () => {
      window.clearInterval(completionInterval);
    };
  }, [isComplete]);

  useEffect(() => {
    if (isComplete !== undefined) {
      return;
    }

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
  }, [isComplete]);

  useEffect(() => {
    if (progress !== 100 || hasCalledComplete.current) {
      return;
    }

    hasCalledComplete.current = true;

    onComplete();
  }, [progress, onComplete]);

  const getTitle = () => {
    if (type === "image") {
      return "사진을 확인 중이에요";
    }

    if (type === "diagnosis") {
      return "오늘의 피부를 분석하고 있어요";
    }

    return "오늘의 맞춤 루틴을 만들고 있어요";
  };

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
        <S.Title>{getTitle()}</S.Title>

        <S.Description>
          {type === "image" ? (
            <>
              조명이 너무 어둡거나 밝은 경우
              <br />
              정확한 분석을 위해
              <br />
              사진을 다시 요청할 수 있어요
            </>
          ) : type === "diagnosis" ? (
            <>
              AI 피부 분석 결과에 맞춰
              <br />
              지금 필요한 성분과
              <br />
              관리 순서를 조합 중이에요
            </>
          ) : (
            <>
              AI 피부 분석 결과에 맞춰
              <br />
              지금 필요한 성분과 관리 순서를 조합 중이에요
            </>
          )}
        </S.Description>
      </S.TextArea>
    </S.Container>
  );
}
