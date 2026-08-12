import styled, { css } from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

const applyTypography = (type: keyof typeof typography) => css`
  font-size: ${typography[type].fontSize};
  font-weight: ${typography[type].fontWeight};
  line-height: ${typography[type].lineHeight};
  letter-spacing: ${typography[type].letterSpacing};
`;

export const Container = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 64px 20px 40px 20px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 600px;
    padding: 80px 40px 60px 40px;
  }
`;

export const BannerCard = styled.div`
  background-color: ${colorPalette.White};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 28px;

  @media (min-width: 768px) {
    padding: 24px 28px;
    margin-bottom: 36px;
  }
`;

export const BannerTitle = styled.h3`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0 0 6px 0;

  @media (min-width: 768px) {
    ${applyTypography("H2")}
    margin-bottom: 8px;
  }
`;

export const BannerDesc = styled.p`
  ${applyTypography("Body1")}
  color: ${colorPalette.Black};
  margin: 0 0 16px 0;
`;

export const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;

  img {
    width: 20px;
    height: 20px;
  }

  span {
    ${applyTypography("Body2Bold")}
    color: ${colorPalette.Secondary};
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const Title = styled.h2`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0 0 8px 0;

  @media (min-width: 768px) {
    ${applyTypography("H2")}
  }
`;

export const SubDesc = styled.p`
  ${applyTypography("Body1")}
  color: ${colorPalette.Black};
  white-space: pre-line;
  margin: 0;
`;

export const CardContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? `${colorPalette.White}` : `${colorPalette.OffWhite}`};
  border: ${({ $isSelected }) =>
    $isSelected
      ? `0.5px solid ${colorPalette.Secondary}`
      : `0.5px solid ${colorPalette.Quaternary}`};
  border-radius: 12px;
  padding: 15px 16px;
  cursor: pointer;
  transition: all 0.15s ease;

  @media (min-width: 768px) {
    padding: 20px 24px;
    gap: 20px;
  }
`;

export const IconImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-top: 20px;

  @media (min-width: 768px) {
    width: 52px;
    height: 52px;
    margin-top: 8px;
  }
`;

export const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const CardTitle = styled.h4`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0 0 4px 0;
`;

export const CardDescription = styled.p`
  ${applyTypography("Body1")}
  color: #1f2937;
  margin: 0 0 12px 0;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  @media (min-width: 768px) {
    gap: 6px;
  }
`;

export const TagChip = styled.span`
  ${applyTypography("Body2")}
  color: ${colorPalette.Black};
  background-color: #fbfbfb;
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 999px;
  padding: 6px 12px;
`;

export const RoutineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    gap: 16px;
    margin-bottom: 40px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px 0;
  background-color: ${colorPalette.Black};
  border: none;
  border-radius: 12px;
  color: ${colorPalette.OffWhite};
  ${applyTypography("H3")}
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      background-color: ${colorPalette.BlackSelected};
    }
  }

  &:not(:disabled):active {
    background-color: ${colorPalette.BlackSelected};
  }
  @media (min-width: 768px) {
    padding: 18px 0;
  }
`;
