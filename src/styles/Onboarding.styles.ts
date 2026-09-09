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
  min-height: 100vh;
  margin: 0 auto;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 80px 24px 48px;
  box-sizing: border-box;
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 80px;
`;

export const Logo = styled.div`
  margin-bottom: 28px;

  img {
    height: 48px;
    width: auto;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${colorPalette.Black};
  ${applyTypography("H2")};
  word-break: keep-all;
`;

export const Description = styled.p`
  margin: 0;
  color: ${colorPalette.grey400};
  ${applyTypography("Body2")};
  word-break: keep-all;
`;

export const BottomArea = styled.div`
  width: 100%;
`;

export const GuestButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: none;
  background-color: ${colorPalette.FocusPrimary};
  color: ${colorPalette.White};
  ${applyTypography("Body1Bold")};
  cursor: pointer;
  outline: none;
  transition:
    opacity 0.2s ease,
    transform 0.1s ease;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
    }
  }

  &:active {
    transform: scale(0.98);
    opacity: 0.85;
  }
`;
