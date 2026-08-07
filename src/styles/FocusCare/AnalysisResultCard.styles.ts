import styled from "styled-components";
import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Card = styled.section`
  width: 100%;
  max-width: 370px;

  margin-top: 16px;
  padding: 16px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

export const Title = styled.h2`
  ${typography.H3};

  margin: 0;
  color: ${colorPalette.Black};
`;

export const DateBadge = styled.span`
  ${typography.Body2};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 9999px;

  color: ${colorPalette.Black};
  background-color: ${colorPalette.White};

  white-space: nowrap;
`;

export const Divider = styled.div`
  width: 100%;
  height: 0.5px;

  margin: 12px 0 16px;

  background-color: ${colorPalette.Tertiary};
`;

export const Content = styled.div`
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
  ${typography.Body2Bold};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 30px;
  padding: 6px 12px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.FocusPrimary};
  border-radius: 999px;

  background-color: rgb(255 255 255 / 80%);
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
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Black};
  word-break: keep-all;
`;