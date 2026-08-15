import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  display: flex;
  flex-direction: column;

  min-height: calc(100dvh - 64px);
  margin-top: 64px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  box-sizing: border-box;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 16px 16px 0;

  box-sizing: border-box;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  width: 100%;
`;

export const AnalysisCard = styled.section`
  width: 100%;
  max-width: 370px;

  margin-top: 16px;
  padding: 16px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const AnalysisHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

export const AnalysisTitle = styled.h2`
  margin: 0;

  ${typography.H3};
  color: ${colorPalette.Black};
`;

export const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 9999px;

  background-color: ${colorPalette.White};

  ${typography.Body2};
  color: ${colorPalette.Black};

  white-space: nowrap;
`;

export const Divider = styled.div`
  width: 100%;
  height: 0.5px;

  margin: 12px 0 16px;

  background-color: ${colorPalette.Tertiary};
`;

export const AnalysisContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StatusTitle = styled.h3`
  margin: 0;

  font-size: 14px;
  font-weight: 700;
  line-height: 150%;

  color: ${colorPalette.Black};
`;

export const AnalysisImage = styled.img`
  width: 120px;
  height: 80px;

  margin-top: 16px;

  border-radius: 4px;

  object-fit: cover;
  display: block;
`;

export const PhotoPlaceholder = styled.div`
  width: 120px;
  height: 80px;

  margin-top: 16px;

  border-radius: 4px;

  background-color: #d9d9d9;
`;

export const ConditionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  margin-top: 8px;
`;

export const ConditionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 30px;

  padding: 6px 12px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.FocusPrimary};
  border-radius: 999px;

  background-color: rgb(255 255 255 / 80%);

  ${typography.Body2Bold};
  color: ${colorPalette.FocusPrimary};
`;

export const SummaryArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: 100%;

  margin-top: 24px;
`;

export const SummaryTitle = styled.h3`
  margin: 0;

  font-size: 14px;
  font-weight: 700;
  line-height: 150%;

  color: ${colorPalette.Black};
`;

export const SummaryDescription = styled.p`
  margin: 0;

  ${typography.Body1};
  color: ${colorPalette.Black};

  word-break: keep-all;
`;
