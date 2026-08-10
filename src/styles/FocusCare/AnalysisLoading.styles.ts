import styled, { keyframes } from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

const rotateSpinner = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

interface ProgressTextProps {
  $variant: "focus" | "daily";
}

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  margin: 50px 0 50px;
`;

export const ProgressCircle = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 150px;
  height: 150px;
`;

export const Spinner = styled.svg`
  position: absolute;
  inset: 0;

  width: 150px;
  height: 150px;

  transform-origin: center;
  animation: ${rotateSpinner} 1.1s linear infinite;
`;

export const ProgressText = styled.div<ProgressTextProps>`
  position: relative;
  z-index: 1;

  display: flex;
  align-items: baseline;
  justify-content: center;

  color: ${({ $variant }) =>
    $variant === "daily"
      ? colorPalette.DailyPrimary
      : colorPalette.FocusPrimary};
`;

export const ProgressNumber = styled.span`
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
`;

export const ProgressUnit = styled.span`
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
`;

export const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  margin-top: 34px;

  text-align: center;
`;

export const Title = styled.h2`
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const Description = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Secondary};

  text-align: center;
`;
