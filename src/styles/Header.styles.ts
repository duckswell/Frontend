import styled, { css } from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

const applyTypography = (type: keyof typeof typography) => css`
  font-size: ${typography[type].fontSize};
  font-weight: ${typography[type].fontWeight};
  line-height: ${typography[type].lineHeight};
  letter-spacing: ${typography[type].letterSpacing};
`;

export const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 56px;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 1000;
  border-bottom: 1px solid ${colorPalette.grey50};

  @media (min-width: 768px) {
    height: 64px;
    padding: 0 32px;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  img {
    height: 20px;
    width: auto;
  }
`;

export const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colorPalette.grey50};
  border-radius: 999px;
  padding: 3px;
  cursor: pointer;
  user-select: none;
`;

export const ToggleOption = styled.div<{
  $isActive: boolean;
  $isFocusOption: boolean;
}>`
  padding: 6px 12px;
  border-radius: 999px;
  ${applyTypography("Body2Bold")}
  transition: all 0.2s ease;

  color: ${({ $isActive, $isFocusOption }) =>
    $isActive
      ? $isFocusOption
        ? colorPalette.FocusPrimary
        : colorPalette.DailyPrimary
      : colorPalette.grey400};

  background-color: ${({ $isActive }) =>
    $isActive ? colorPalette.White : "transparent"};

  box-shadow: ${({ $isActive }) =>
    $isActive ? "0 2px 6px rgba(0, 0, 0, 0.06)" : "none"};
`;
