import styled, { css } from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

const applyTypography = (type: keyof typeof typography) => css`
  font-size: ${typography[type].fontSize};
  font-weight: ${typography[type].fontWeight};
  line-height: ${typography[type].lineHeight};
  letter-spacing: ${typography[type].letterSpacing};
`;

export const Container = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 402px;
  height: 64px;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  z-index: 1000;
`;

export const TabItem = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 100%;
  cursor: pointer;
  color: ${({ $isActive }) =>
    $isActive ? colorPalette.Black : colorPalette.grey300};
  ${({ $isActive }) =>
    $isActive ? applyTypography("Body2Bold") : applyTypography("Body2")};
  transition: color 0.2s ease;

  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      color: ${colorPalette.Black};

      img {
        filter: brightness(0);
      }
    }
  }
`;

export const Icon = styled.img`
  width: 24px;
  height: 24px;
  transition: filter 0.2s ease;
`;
