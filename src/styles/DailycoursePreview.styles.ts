import styled, { css, keyframes } from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

const applyTypography = (type: keyof typeof typography) => css`
  font-size: ${typography[type].fontSize};
  font-weight: ${typography[type].fontWeight};
  line-height: ${typography[type].lineHeight};
  letter-spacing: ${typography[type].letterSpacing};
`;

const slideUpDown = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  85% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 402px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 64px 16px 16px 16px;
  box-sizing: border-box;
  position: relative;
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
      ? `0.5px solid ${colorPalette.Black}`
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
  margin-top: 30px;

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

export const ToastNotice = styled.div`
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  gap: 12px;

  width: calc(100% - 32px);
  max-width: 370px;
  padding: 16px;
  box-sizing: border-box;

  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  ${applyTypography("Body1Bold")}
  color: ${colorPalette.Black};

  pointer-events: none;
  z-index: 99;

  animation: ${slideUpDown} 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  .info-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colorPalette.Black};
    color: ${colorPalette.OffWhite};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const NowRoutine = styled.div`
  position: absolute;
  top: -15px;
  left: 16px;
  background-color: #eaf5ff;
  color: #0088ff;
  ${applyTypography("Body2Bold")}
  padding: 4px 12px;
  border-radius: 999px;
`;
