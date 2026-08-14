import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  min-height: 100dvh;

  padding-top: 56px;

  padding-bottom: 184px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  box-sizing: border-box;

  > header > button:first-child {
    visibility: hidden;
    pointer-events: none;
  }

  @media (min-width: 768px) {
    padding-top: 64px;
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 36px;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 12px 16px 0;

  box-sizing: border-box;
`;

export const StatusCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 100%;
  box-sizing: border-box;

  padding: 18px 16px;

  border: 1px solid ${colorPalette.blue50};
  border-radius: 6px;

  background-image: url("/assets/Home_Focus.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

export const CourseBadge = styled.span`
  ${typography.Body2Bold};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: fit-content;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.FocusPrimary};
  border-radius: 999px;

  background-color: rgb(255 255 255 / 80%);
  color: ${colorPalette.FocusPrimary};
`;

export const StatusTitle = styled.h1`
  ${typography.H2};

  margin: 13px 0 0;

  color: ${colorPalette.Black};
`;

export const StatusDescription = styled.p`
  ${typography.Body1};

  margin: 7px 0 0;

  color: ${colorPalette.Black};
`;

export const StatusNotice = styled.p`
  ${typography.Body2};

  margin: 9px 0 0;

  color: ${colorPalette.FocusSecondary};
`;

export const CourseSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;

  width: 100%;
`;

export const SectionTitle = styled.h2`
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const CourseCard = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  box-sizing: border-box;

  padding: 24px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StepBadge = styled.span`
  ${typography.Body2Bold};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: fit-content;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.FocusPrimary};
  border-radius: 999px;

  background-color: rgb(255 255 255 / 80%);
  color: ${colorPalette.FocusPrimary};
`;

export const StepTitle = styled.h3`
  ${typography.H3};

  margin: 13px 0 0;

  color: ${colorPalette.Black};
`;

export const StepDescription = styled.p`
  ${typography.Body1};

  margin: 8px 0 0;

  color: ${colorPalette.Black};

  word-break: keep-all;
`;

export const OutlinedButton = styled.button`
  ${typography.Body1Bold};

  width: 100%;

  margin-top: 16px;
  padding: 12px 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  font-family: inherit;

  cursor: pointer;

  &:active {
    background-color: ${colorPalette.grey50};
  }
`;

export const WarningCard = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;

  box-sizing: border-box;

  padding: 20px 16px 16px;

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
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const WarningDescription = styled.p`
  ${typography.Body2};

  margin: 8px 0 0;

  color: ${colorPalette.Secondary};

  word-break: keep-all;
`;

export const ConsultationButton = styled.button`
  ${typography.Body1Bold};

  width: 100%;
  max-width: 322px;

  align-self: center;

  margin-top: 12px;

  padding: 12px 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  color: ${colorPalette.Black};
  background-color: ${colorPalette.White};

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
