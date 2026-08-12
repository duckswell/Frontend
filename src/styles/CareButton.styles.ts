import styled from "styled-components";

import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

type ButtonVariant = "focus" | "daily" | "black";

interface ButtonStyleProps {
  $variant: ButtonVariant;
}

const getBackgroundColor = (variant: ButtonVariant) => {
  switch (variant) {
    case "daily":
      return colorPalette.DailyPrimary;

    case "black":
      return colorPalette.Black;

    case "focus":
    default:
      return colorPalette.FocusPrimary;
  }
};

const getSelectedColor = (variant: ButtonVariant) => {
  switch (variant) {
    case "daily":
      return colorPalette.DailySelected;

    case "black":
      return colorPalette.BlackSelected;

    case "focus":
    default:
      return colorPalette.FocusSelected;
  }
};

export const Button = styled.button<ButtonStyleProps>`
  ${typography.H3};

  width: 100%;
  max-width: 370px;
  height: 56px;

  padding: 12px;

  border: none;
  border-radius: 12px;

  background-color: ${({ $variant }) => getBackgroundColor($variant)};
  color: ${colorPalette.OffWhite};

  font-family: inherit;

  cursor: pointer;

  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    background-color: ${({ $variant }) => getSelectedColor($variant)};
    color: ${colorPalette.White};
  }
  &:disabled {
    background-color: ${colorPalette.White};
    color: ${colorPalette.Tertiary};

    cursor: not-allowed;
  }
`;
