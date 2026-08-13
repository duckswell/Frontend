import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

interface SelectedProps {
  $selected: boolean;
  $variant: "focus" | "daily";
}

const getPrimaryColor = (variant: "focus" | "daily") =>
  variant === "daily" ? colorPalette.DailyPrimary : colorPalette.FocusPrimary;

export const Card = styled.button<SelectedProps>`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  width: 100%;
  max-width: 370px;

  padding: 16px;

  box-sizing: border-box;

  border: ${({ $variant }) =>
    $variant === "daily"
      ? `0.5px solid ${colorPalette.DailySecondary}`
      : `0.5px solid ${colorPalette.FocusSecondary}`};

  border-radius: 6px;

  background-color: ${({ $selected, $variant }) => {
    if (!$selected) {
      return colorPalette.OffWhite;
    }

    return $variant === "daily"
      ? colorPalette.DailyTertiary
      : colorPalette.FocusTertiary;
  }};

  text-align: left;
  font-family: inherit;

  cursor: pointer;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

export const RoutineTitle = styled.span<SelectedProps>`
  font-size: 16px;
  font-weight: 700;
  line-height: 150%;

  color: ${({ $variant }) => getPrimaryColor($variant)};
`;

export const TimeArea = styled.div<SelectedProps>`
  display: flex;
  align-items: center;
  gap: 4px;

  color: ${({ $selected, $variant }) =>
    $selected ? getPrimaryColor($variant) : colorPalette.Tertiary};
`;

export const ClockIcon = styled.img`
  width: 16px;
  height: 16px;

  flex-shrink: 0;
`;

export const TimeText = styled.span`
  ${typography.Body1};

  color: inherit;
`;

export const RoutineDescription = styled.p`
  margin: 8px 0 0;

  font-size: 14px;
  font-weight: 700;
  line-height: 150%;

  color: ${colorPalette.Black};
`;

export const RoutineSteps = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Black};

  word-break: keep-all;
`;
