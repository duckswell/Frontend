import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  min-height: 100dvh;

  padding-top: 76px;

  /*
   * 그라데이션 25px
   * + 버튼 56px
   * + 버튼 아래 16px
   * + 마지막 콘텐츠 여유 16px
   */
  padding-bottom: 113px;

  box-sizing: border-box;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};
`;

export const Content = styled.main`
  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 16px 16px 0;

  box-sizing: border-box;
`;

export const IntroSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 100%;

  margin-bottom: 16px;
`;

export const Title = styled.h1`
  margin: 0;

  ${typography.H3};
  color: ${colorPalette.Black};
`;

export const Description = styled.p`
  margin: 0;

  ${typography.Body1};
  color: ${colorPalette.Black};
`;

export const RoutineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;

  width: 100%;
`;

export const RoutineCardWrapper = styled.div<{
  $isCurrentRoutine: boolean;
  $isFirst: boolean;
}>`
  position: relative;

  width: 100%;
  max-width: 370px;

  margin-top: ${({ $isCurrentRoutine, $isFirst }) =>
    $isCurrentRoutine && !$isFirst ? "14px" : "0"};

  box-sizing: border-box;

  > div {
    width: 100%;
    max-width: 370px;

    box-sizing: border-box;
  }
`;

export const CurrentRoutineBadge = styled.span`
  position: absolute;
  top: -12px;
  left: 16px;

  z-index: 2;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px 12px;

  border-radius: 999px;

  background-color: ${colorPalette.DailyTertiary};

  ${typography.Body2Bold};
  color: ${colorPalette.DailyPrimary};

  white-space: nowrap;
`;

export const BottomArea = styled.div`
  position: fixed;

  left: 50%;
  bottom: 0;

  z-index: 20;

  display: flex;
  justify-content: center;

  width: 100%;
  max-width: 402px;

  /* 좌우 16px / 버튼 아래 16px */
  padding: 0 16px 16px;

  box-sizing: border-box;

  transform: translateX(-50%);

  background-color: ${colorPalette.OffWhite};

  &::before {
    content: "";

    position: absolute;

    left: 0;
    right: 0;
    bottom: 72px;

    height: 25px;

    pointer-events: none;

    background: linear-gradient(
      to bottom,
      rgba(251, 251, 251, 0) 0%,
      rgba(251, 251, 251, 0.45) 30%,
      rgba(251, 251, 251, 0.75) 60%,
      rgba(251, 251, 251, 0.92) 100%
    );
  }
`;

export const SubmitButton = styled.button`
  position: relative;
  z-index: 1;

  width: 100%;
  height: 56px;

  padding: 0;

  border: none;
  border-radius: 12px;

  background-color: ${colorPalette.Black};

  ${typography.H3};
  color: ${colorPalette.OffWhite};

  font-family: inherit;

  cursor: pointer;

  &:active {
    opacity: 0.85;
  }
`;
