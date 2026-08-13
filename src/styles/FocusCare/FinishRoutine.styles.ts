import styled from "styled-components";
import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  width: 100%;
  min-height: 100dvh;

  background-color: ${colorPalette.OffWhite};
`;

export const Content = styled.main`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 402px;
  min-height: 100dvh;

  margin: 0 auto;
  padding: 0 16px 24px;

  overflow: hidden;
`;
export const CompletionSection = styled.section`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 420px;
`;

export const CompletionTitle = styled.h1`
  ${typography.H1};

  position: relative;
  z-index: 2;

  margin: 0;

  color: #1f2937;
  text-align: center;
`;

export const InformationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;

  width: 100%;

  margin-bottom: 44px;
`;
export const DailyCard = styled.button`
  box-sizing: border-box;

  display: flex;
  align-items: center;

  width: 100%;
  max-width: 370px;
  min-height: 78px;

  padding: 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: transparent;

  font-family: inherit;
  text-align: left;

  cursor: pointer;
`;

export const DailyImage = styled.img`
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  margin-right: 16px;

  border-radius: 50%;

  object-fit: cover;
`;

export const DailyTextArea = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  min-width: 0;
`;

export const DailyDescription = styled.span`
  ${typography.Body1};

  color: ${colorPalette.Secondary};
`;

export const DailyTitle = styled.span`
  ${typography.H3};

  color: ${colorPalette.Black};
`;

export const GotoIcon = styled.img`
  flex-shrink: 0;

  width: 24px;
  height: 24px;

  margin-left: 12px;
`;

export const ButtonWrapper = styled.div`
  width: 100%;

  margin-top: 20px;
`;
