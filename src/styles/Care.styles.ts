import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

export const Page = styled.div`
  min-height: 100dvh;
  padding-top: 56px;
  padding-bottom: 92px;
  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  @media (min-width: 768px) {
    padding-top: 64px;
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 36px;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 12px 16px 0;
`;

export const StatusCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px 16px;
  border: 1px solid ${colorPalette.blue50};
  border-radius: 6px;
  background-image: url("/assets/Home_Focus.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

export const CourseBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 6px 12px;
  border: 0.5px solid ${colorPalette.FocusPrimary};
  border-radius: 999px;
  background-color: rgb(255 255 255 / 80%);
  color: ${colorPalette.FocusPrimary};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
`;

export const StatusTitle = styled.h1`
  margin: 13px 0 0;
  color: ${colorPalette.Black};
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
`;

export const StatusDescription = styled.p`
  margin: 7px 0 0;
  color: ${colorPalette.Black};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
`;

export const StatusNotice = styled.p`
  margin: 9px 0 0;
  color: ${colorPalette.FocusSecondary};
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
`;

export const CourseSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${colorPalette.Black};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
`;

export const CourseCard = styled.div`
  display: flex;
  flex-direction: column;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 6px 12px;
  border: 0.5px solid ${colorPalette.FocusPrimary};
  border-radius: 999px;
  background-color: rgb(255 255 255 / 80%);
  color: ${colorPalette.FocusPrimary};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
`;

export const StepTitle = styled.h3`
  margin: 13px 0 0;
  color: ${colorPalette.Black};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
`;

export const StepDescription = styled.p`
  margin: 8px 0 0;
  color: ${colorPalette.Black};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  word-break: keep-all;
`;

export const OutlinedButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 12px 16px;
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;

  &:active {
    background-color: ${colorPalette.grey50};
  }
`;

export const WarningCard = styled.section`
  display: flex;
  flex-direction: column;
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
  margin: 0;
  color: ${colorPalette.Black};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
`;

export const WarningDescription = styled.p`
  margin: 8px 0 0;
  color: ${colorPalette.Secondary};
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  word-break: keep-all;
`;

export const ConsultationButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;

  &:active {
    background-color: ${colorPalette.grey50};
  }
`;

export const BottomArea = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 68px auto 0;
  padding: 0 16px 18px;
`;

export const RoutineStartButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background-color: ${colorPalette.FocusPrimary};
  color: ${colorPalette.OffWhite};
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;

  &:active {
    background-color: ${colorPalette.FocusSelected};
  }
`;
