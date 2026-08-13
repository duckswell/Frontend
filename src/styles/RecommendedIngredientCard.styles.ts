import styled from "styled-components";

import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

export const Card = styled.article`
  position: relative;

  box-sizing: border-box;

  width: 282px;
  height: 218px;

  padding: 12px 16px;

  overflow: hidden;

  border: none;
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};

  &::after {
    content: "";

    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;

    box-sizing: border-box;

    width: 200%;
    height: 200%;

    border: 1px solid ${colorPalette.Tertiary};
    border-radius: 24px;

    transform: scale(0.5);
    transform-origin: top left;

    pointer-events: none;
  }
`;

export const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  pointer-events: none;
`;
export const Content = styled.div`
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

export const CategoryList = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  width: fit-content;
`;

export const Category = styled.span`
  ${typography.Body2};

  position: relative;

  box-sizing: border-box;

  width: fit-content;

  padding: 6px 12px;

  overflow: hidden;

  border: 0.5px solid rgba(255, 255, 255, 0.38);
  border-radius: 9999px;

  /* 더 투명하게 */
  background-color: rgba(255, 255, 255, 0.28);

  color: ${colorPalette.Black};

  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);

  box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.42),
    inset -1px -1px 1.5px rgba(255, 255, 255, 0.06);

  &::before {
    content: "";

    position: absolute;
    inset: 0;

    border-radius: inherit;

    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.06) 28%,
      rgba(255, 255, 255, 0) 52%
    );

    pointer-events: none;
  }

  &::after {
    content: "";

    position: absolute;
    inset: 1px;

    border-radius: inherit;

    box-shadow: inset 0.5px 0.5px 1px rgba(255, 255, 255, 0.18),
      inset -0.5px -0.5px 1px rgba(120, 130, 140, 0.03);

    pointer-events: none;
  }
`;

export const IngredientInfo = styled.div`
  position: relative;

  box-sizing: border-box;

  width: 250px;

  margin-top: auto;
  padding: 16px;

  overflow: hidden;

  border: 0.5px solid rgba(255, 255, 255, 0.32);
  border-radius: 12px;

  /* 기존 60%보다 조금 더 투명하게 */
  background-color: rgba(255, 255, 255, 0.46);

  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);

  box-shadow: inset 1px 1px 1.5px rgba(255, 255, 255, 0.38),
    inset -1px -1px 2px rgba(120, 130, 140, 0.025);

  &::before {
    content: "";

    position: absolute;
    inset: 0;

    border-radius: inherit;

    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.07) 24%,
      rgba(255, 255, 255, 0) 46%
    );

    pointer-events: none;
  }

  &::after {
    content: "";

    position: absolute;
    inset: 1px;

    border-radius: 11px;

    box-shadow: inset 0.5px 0.5px 1px rgba(255, 255, 255, 0.18),
      inset -0.5px -0.5px 1px rgba(120, 130, 140, 0.025);

    pointer-events: none;
  }
`;
export const IngredientName = styled.h3`
  position: relative;
  z-index: 1;

  margin: 0;

  color: ${colorPalette.Black};

  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
`;

export const Description = styled.p`
  position: relative;
  z-index: 1;

  margin: 8px 0 0;

  color: ${colorPalette.Black};

  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
`;
