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
  position: relative;
  width: 100%;
  max-width: 402px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

export const BgLeft = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 70%;
  max-width: 280px;
  pointer-events: none;
  z-index: 1;
`;

export const BgRight = styled.img`
  position: absolute;
  bottom: 25px;
  right: 0;
  width: 70%;
  max-width: 280px;
  pointer-events: none;
  z-index: 1;
`;

export const CenterContent = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 30px;
  margin-bottom: 0px;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${colorPalette.Black};
  ${applyTypography("Body1")};
  word-break: keep-all;
`;

export const BrandLogoImg = styled.img`
  width: 232px;
  max-width: 60%;
  height: auto;
  object-fit: contain;
`;

export const BottomArea = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  margin-bottom: 30px;
`;

export const GuestButton = styled.button`
  width: 100%;
  height: 54px;
  border-radius: 12px;
  border: none;
  background-color: ${colorPalette.FocusPrimary};
  color: ${colorPalette.OffWhite};
  ${applyTypography("H3")};
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition:
    opacity 0.2s ease,
    transform 0.1s ease;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.92;
    }
  }

  &:active {
    transform: scale(0.98);
    opacity: 0.85;
  }
`;
