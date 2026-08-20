import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  min-height: 100dvh;

  padding-top: 56px;
  padding-bottom: 177px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  box-sizing: border-box;

  > header > button:first-child {
    visibility: hidden;
    pointer-events: none;
  }
`;
export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 8px 16px;

  box-sizing: border-box;
`;

export const RoutineSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;

  width: 100%;
  height: 40px;

  margin: 0;

  ${typography.H3};
  color: ${colorPalette.Black};
`;

export const RoutineCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  width: 100%;

  padding: 16px;

  box-sizing: border-box;

  border: 1px solid ${colorPalette.green50};
  border-radius: 6px;

  background-image: url("/assets/Home_Daily.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  font-family: inherit;
  text-align: left;

  cursor: pointer;
`;

export const RoutineBadge = styled.span`
  ${typography.Body2Bold};

  color: #1f2937;
`;

export const RoutineTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RoutineTitle = styled.h1`
  margin: 0;

  font-size: 20px;
  font-weight: 700;
  line-height: 150%;

  color: #1f2937;
`;

export const SettingIcon = styled.img`
  flex-shrink: 0;

  width: 24px;
  height: 24px;
`;

export const RoutineDescription = styled.p`
  margin: 0;

  ${typography.Body1};
  color: #1f2937;

  word-break: keep-all;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  margin: 0;
`;

export const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;

  border-radius: 999px;

  background-color: ${colorPalette.OffWhite};

  ${typography.Body2};
  color: ${colorPalette.Black};
`;

export const CourseSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;

  margin-top: 20px;
`;

export const CourseCard = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  padding: 24px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StepBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: fit-content;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.DailyPrimary};
  border-radius: 999px;

  background-color: rgb(255 255 255 / 80%);

  ${typography.Body2Bold};
  color: ${colorPalette.DailyPrimary};
`;

export const StepTitle = styled.h3`
  margin: 12px 0 0;

  ${typography.H3};
  color: ${colorPalette.Black};
`;

export const StepDescription = styled.p`
  margin: 9px 0 0;

  ${typography.Body1};
  color: ${colorPalette.Black};

  word-break: keep-all;
`;

export const WarningCard = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;

  padding: 20px 16px 16px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const WarningTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const WarningIcon = styled.img`
  flex-shrink: 0;

  width: 14px;
  height: 12.5px;

  object-fit: contain;
`;

export const WarningTitle = styled.h2`
  margin: 0;

  ${typography.H3};
  color: ${colorPalette.Black};
`;

export const WarningDescription = styled.p`
  margin: 8px 0 0;

  ${typography.Body2};
  color: ${colorPalette.Secondary};

  word-break: keep-all;
`;

export const ConsultationButton = styled.button`
  align-self: center;

  width: 100%;
  max-width: 322px;

  margin-top: 12px;
  padding: 12px 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};

  ${typography.Body1Bold};
  color: ${colorPalette.Black};

  font-family: inherit;

  cursor: pointer;

  &:active {
    background-color: ${colorPalette.grey50};
  }
`;

export const BottomArea = styled.div`
  position: fixed;

  left: 50%;
  bottom: 64px;

  z-index: 20;

  display: flex;
  justify-content: center;

  width: 100%;
  max-width: 402px;

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

  > button {
    position: relative;
    z-index: 1;
  }
`;
