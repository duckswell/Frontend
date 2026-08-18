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
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 402px;
  height: 56px;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  z-index: 1000;
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

export const SwitchToFocusButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${colorPalette.FocusPrimary};
  background-color: ${colorPalette.White};
  color: ${colorPalette.FocusPrimary};
  ${applyTypography("Body2Bold")};
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colorPalette.FocusPrimary};
    color: ${colorPalette.White};
  }

  &:active {
    transform: scale(0.96);
  }
`;
