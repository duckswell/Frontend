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
  max-width: 402px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 64px 16px 80px 16px;
  box-sizing: border-box;
`;

export const LeftColumn = styled.div`
  width: 100%;
`;

export const RightColumn = styled.div`
  width: 100%;
`;

export const HeroCard = styled.div<{ $isFocus: boolean }>`
  background-image: ${({ $isFocus }) =>
    $isFocus
      ? `url('/assets/Home_Focus.png')`
      : `url('/assets/Home_Daily.png')`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  padding: 24px 18px 20px 18px;
  box-sizing: border-box;
  margin-bottom: 24px;
`;

export const Badge = styled.div<{ $isFocus: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 999px;
  border: 0.5px solid
    ${({ $isFocus }) =>
      $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  background: rgba(255, 255, 255, 0.8);

  color: ${({ $isFocus }) =>
    $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  ${applyTypography("Body2Bold")}
  margin-bottom: 16px;
`;

export const HeroTitle = styled.h2`
  ${applyTypography("H2")}
  line-height: 1.35;
  color: ${colorPalette.Black};
  margin: 0 0 52px 0;
  white-space: pre-line;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

export const StatItem = styled.div`
  background-color: ${colorPalette.OffWhite};
  border-radius: 8px;
  padding: 10px 13px 12px 13px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
  box-sizing: border-box;

  .label {
    display: block;
    ${applyTypography("Body1")}
    color: ${colorPalette.Black};
    margin-bottom: 6px;
  }

  .value-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    width: 100%;

    .number {
      font-size: 32px;
      font-weight: 500;
      color: #000;
      letter-spacing: -0.5px;
    }

    .unit {
      font-size: 16px;
      font-weight: 900;
      color: ${colorPalette.Black};
      margin-left: 1px;
      margin-top: 10px;
    }

    .arrow-icon {
      width: 14px;
      height: 14px;
      object-fit: contain;
      margin-left: 5px;
      margin-bottom: 10px;
    }
  }
`;

export const DailyStatItem = styled.div`
  background-color: ${colorPalette.OffWhite};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 71px;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    gap: 4px;

    span {
      ${applyTypography("Body2")}
      color: ${colorPalette.Black};
    }

    img {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }
  }

  .status-text {
    ${applyTypography("Body1Bold")}
    color: ${colorPalette.Black};
    margin: 0;
    white-space: nowrap;
    letter-spacing: -0.3px;
  }
`;

export const RoutineButton = styled.button<{ $isFocus: boolean }>`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background-color: ${({ $isFocus }) =>
    $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  color: ${colorPalette.OffWhite};
  ${applyTypography("H3")}
  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      background-color: ${({ $isFocus }) =>
        $isFocus ? colorPalette.FocusSelected : colorPalette.DailySelected};
    }
  }

  &:active {
    background-color: ${({ $isFocus }) =>
      $isFocus ? colorPalette.FocusSelected : colorPalette.DailySelected};
  }
`;

export const BannerCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
    }

    .desc {
      ${applyTypography("Body1")}
      color: ${colorPalette.Secondary};
      margin-bottom: 2px;
    }

    .title {
      ${applyTypography("H3")}
      color: ${colorPalette.Black};
    }
  }

  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;

    .Goto-img {
      width: 10px;
      height: auto;
    }
  }
`;

export const SectionHeader = styled.div`
  margin: 45px 0 12px 0;

  h3 {
    ${applyTypography("H3")}
    color: ${colorPalette.Black};
    margin: 0 0 6px 0;
  }

  p {
    ${applyTypography("Body1")}
    color: ${colorPalette.grey700};
    margin: 0;
  }
`;

export const TodoCard = styled.div<{ $isChecked: boolean; $isFocus: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: pointer;

  border: 0.5px solid
    ${({ $isChecked, $isFocus }) =>
      $isChecked
        ? $isFocus
          ? colorPalette.FocusSecondary
          : colorPalette.DailySecondary
        : colorPalette.Quaternary};

  background-color: ${({ $isChecked, $isFocus }) =>
    $isChecked
      ? $isFocus
        ? colorPalette.FocusTertiary
        : colorPalette.DailyTertiary
      : colorPalette.OffWhite};

  .checkbox {
    min-width: 18px;
    min-height: 18px;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    background-color: ${({ $isChecked, $isFocus }) =>
      $isChecked
        ? $isFocus
          ? colorPalette.FocusPrimary
          : colorPalette.DailyPrimary
        : colorPalette.OffWhite};

    border: 1.5px solid
      ${({ $isChecked }) => ($isChecked ? "transparent" : colorPalette.grey200)};

    color: ${({ $isChecked }) =>
      $isChecked ? colorPalette.OffWhite : colorPalette.grey200};

    font-size: 15px;
  }

  .content {
    h4 {
      ${applyTypography("Body1Bold")}
      margin: 0 0 6px 0;
      color: ${({ $isFocus }) =>
        $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
    }

    p {
      ${applyTypography("Body1")}
      margin: 0;
      color: ${({ $isChecked, $isFocus }) =>
        $isChecked
          ? $isFocus
            ? colorPalette.FocusPrimary
            : colorPalette.DailyPrimary
          : colorPalette.Black};
    }
  }
`;
