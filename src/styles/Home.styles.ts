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
  padding: 76px 20px 80px 20px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 1024px;
    padding: 80px 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
    row-gap: 0;

    align-content: center;
    align-items: center;
  }
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
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    padding: 28px;
    margin-bottom: 0;
  }
`;

export const Badge = styled.div<{ $isFocus: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  border: 0.5px solid
    ${({ $isFocus }) =>
      $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  background-color: ${colorPalette.OffWhite};
  color: ${({ $isFocus }) =>
    $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  ${applyTypography("Body2Bold")}
  margin-bottom: 12px;
`;

export const HeroTitle = styled.h2`
  ${applyTypography("H2")}
  color: ${colorPalette.Black};
  margin: 10px 0 65px 0;
  white-space: pre-line;

  @media (min-width: 768px) {
    ${applyTypography("H1")}
  }
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
  padding: 12px 0px;

  span {
    display: block;
    ${applyTypography("Body1")}
    color: ${colorPalette.Black};
    margin-bottom: 6px;
    padding-left: 15px;
  }

  strong {
    font-size: 32px;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 0;
    color: ${colorPalette.Black};
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;
  }
`;

export const Percent = styled.div`
  ${applyTypography("H3")}
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
`;

export const Down = styled.div`
  font-size: 30px;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: 0;
  color: ${colorPalette.FocusPrimary};
`;

export const Up = styled.div`
  font-size: 30px;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: 0;
  color: ${colorPalette.Red};
`;

export const RoutineButton = styled.button<{ $isFocus: boolean }>`
  width: 100%;
  padding: 17px 0;
  border: none;
  border-radius: 12px;
  background-color: ${({ $isFocus }) =>
    $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  color: ${colorPalette.OffWhite};
  ${applyTypography("H3")}
  cursor: pointer;

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
  padding: 20px 16px;
  margin-bottom: 12px;
  cursor: pointer;

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
      color: ${colorPalette.grey400};
      margin-bottom: 2px;
    }

    .title {
      ${applyTypography("H3")}
      color: ${colorPalette.Black};
    }
  }
`;

export const GoToimg = styled.div`
  width: 7.5px;
  height: 7.5px;
`;

export const SectionHeader = styled.div`
  margin: 34px 0 12px 0;

  @media (min-width: 768px) {
    margin: 0 0 16px 0;
  }

  h3 {
    ${applyTypography("H3")}
    color: ${colorPalette.Black};
    margin: 0 0 4px 0;
  }

  p {
    ${applyTypography("Body2")}
    color: ${colorPalette.grey400};
    margin: 0;
  }
`;

export const TodoCard = styled.div<{ $isChecked: boolean; $isFocus: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
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
    width: 20px;
    height: 20px;
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
      font-size: 13px;
      margin: 0;
      color: ${({ $isChecked, $isFocus }) =>
        $isChecked
          ? $isFocus
            ? colorPalette.FocusPrimary
            : colorPalette.DailyPrimary
          : colorPalette.grey400};
    }
  }
`;

export const DailyStatItem = styled.div`
  background-color: ${colorPalette.OffWhite};
  border-radius: 12px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 72px;
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
      width: 14px;
      height: 14px;
    }
  }

  .status-text {
    ${applyTypography("Body1Bold")}
    color: ${colorPalette.Black};
    margin: 0;
    text-wrap: nowrap;
  }
`;
