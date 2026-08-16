import styled, { keyframes } from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const dotFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.85);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const slideUpFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Page = styled.div`
  width: 100%;
  min-height: 100dvh;

  background-color: ${colorPalette.OffWhite};
`;

export const FullScreenSection = styled.section`
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 402px;
  height: 100dvh;

  margin: 0 auto;
  padding: 0 16px;

  overflow: hidden;

  background-color: ${colorPalette.OffWhite};

  animation: ${fadeIn} 0.35s ease;
`;

/* =========================
   1. 축하 / 점 화면
========================= */

export const CompletionArea = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 420px;
`;

export const IntroTextArea = styled.div<{
  $showIndicator: boolean;
}>`
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  transform: ${({ $showIndicator }) =>
    $showIndicator ? "translateY(-32px)" : "translateY(0)"};

  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const CompleteText = styled.p`
  margin: 0 0 18px;

  color: #000000;

  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;

  text-align: center;
`;

export const MainTitle = styled.h1`
  ${typography.H1};

  margin: 0;

  color: #1f2937;

  text-align: center;
`;

export const IndicatorContainer = styled.div<{
  $isVisible: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  margin-top: 68px;

  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};

  transform: ${({ $isVisible }) =>
    $isVisible ? "translateY(0)" : "translateY(12px)"};

  transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  pointer-events: none;
`;

export const IndicatorDot = styled.span<{
  $type: "tertiary" | "secondary" | "primary";
}>`
  width: 8px;
  height: 8px;

  border-radius: 50%;

  opacity: 0;

  background-color: ${({ $type }) => {
    if ($type === "tertiary") {
      return colorPalette.FocusTertiary;
    }

    if ($type === "secondary") {
      return colorPalette.FocusSecondary;
    }

    return colorPalette.FocusPrimary;
  }};

  animation: ${dotFadeIn} 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;

  &:nth-child(1) {
    animation-delay: 0.2s;
  }

  &:nth-child(2) {
    animation-delay: 0.48s;
  }

  &:nth-child(3) {
    animation-delay: 0.76s;
  }
`;

/* =========================
   2. 피부 고민
========================= */

export const ConcernContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 370px;

  animation: ${slideUpFadeIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const SectionTitle = styled.h2`
  ${typography.H3};

  margin: 0 0 8px;

  color: ${colorPalette.Black};
`;

export const SectionDescription = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const ConcernArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;

  margin-top: 44px;
`;

export const PrimaryConcernList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 14px;

  width: 100%;
`;

export const PrimaryConcernChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  padding: 8px 17px;

  border: 1px solid ${colorPalette.FocusPrimary};
  border-radius: 999px;

  background-color: ${colorPalette.OffWhite};

  color: ${colorPalette.FocusPrimary};

  font-size: 17px;
  font-weight: 700;
  line-height: 150%;
`;

export const SecondaryConcernList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  gap: 14px 12px;

  width: 100%;
`;

export const SecondaryConcernChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  padding: 7px 14px;

  border: 0.6px solid ${colorPalette.Quaternary};
  border-radius: 999px;

  background-color: transparent;

  color: ${colorPalette.Quaternary};

  font-size: 14px;
  font-weight: 700;
  line-height: 150%;
`;

/* =========================
   3. 루틴 선택
========================= */

export const RoutineScreen = styled.section`
  box-sizing: border-box;

  width: 100%;
  height: 100dvh;

  overflow-y: auto;

  background-color: ${colorPalette.OffWhite};
`;

export const RoutineContent = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 56px 16px 16px;

  animation: ${slideUpFadeIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const RoutineHeader = styled.div`
  width: 100%;
  max-width: 370px;

  margin-bottom: 20px;
`;

export const RoutineList = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;

  width: 100%;
  max-width: 370px;
`;

export const RoutineCardWrapper = styled.div`
  position: relative;

  box-sizing: border-box;

  width: 100%;
  max-width: 370px;
`;

export const RecommendedBadge = styled.div`
  ${typography.Body2Bold};

  position: absolute;
  z-index: 3;

  top: -14px;
  left: 20px;

  width: fit-content;

  padding: 6px 12px;

  border-radius: 999px;

  background-color: ${colorPalette.FocusTertiary};
  color: ${colorPalette.FocusPrimary};

  white-space: nowrap;

  pointer-events: none;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 370px;

  margin-top: 86px;
`;
