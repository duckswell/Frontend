import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

interface ButtonStyleProps {
  $backgroundColor?: string;
  $textColor?: string;
}

export const Button = styled.button<ButtonStyleProps>`
  ${typography.H3};

  width: 100%;
  max-width: 370px;
  height: 56px;

  padding: 12px;

  border: none;
  border-radius: 12px;

  background-color: ${({ $backgroundColor }) =>
    $backgroundColor ?? colorPalette.FocusPrimary};

  color: ${({ $textColor }) => $textColor ?? colorPalette.OffWhite};

  font-family: inherit;

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;
