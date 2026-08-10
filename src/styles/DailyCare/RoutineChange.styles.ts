import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  min-height: 100dvh;

  padding-top: 76px;
  padding-bottom: 104px;

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
  gap: 12px;

  width: 100%;
`;

export const RoutineCardWrapper = styled.div`
  position: relative;

  width: 100%;
  max-width: 370px;

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
  bottom: 0;
  left: 50%;

  z-index: 10;

  width: 100%;
  max-width: 402px;

  padding: 0 16px 18px;

  box-sizing: border-box;

  transform: translateX(-50%);
`;

export const SubmitButton = styled.button`
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
