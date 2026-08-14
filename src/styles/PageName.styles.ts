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
  justify-content: center;
  z-index: 1000;

  @media (min-width: 768px) {
    height: 64px;
  }
`;

export const Title = styled.h1`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0;
`;
