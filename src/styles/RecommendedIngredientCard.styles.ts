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

  border: 0.5px solid ${colorPalette.Tertiary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};
`;

export const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: 0.5;

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

export const Category = styled.span`
  ${typography.Body2};

  box-sizing: border-box;

  width: fit-content;

  padding: 6px 12px;

  border: 0.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 9999px;

  background-color: rgba(255, 255, 255, 0.4);
  color: ${colorPalette.Black};

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  box-shadow:
    inset 1px 1px 2px rgba(255, 255, 255, 0.8),
    inset -1px -1px 2px rgba(255, 255, 255, 0.18);
`;

export const IngredientInfo = styled.div`
  box-sizing: border-box;

  width: 250px;

  margin-top: auto;
  padding: 16px;

  border: 0.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;

  background-color: rgba(255, 255, 255, 0.6);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  box-shadow:
    inset 1px 1px 3px rgba(255, 255, 255, 0.8),
    inset -1px -1px 3px rgba(255, 255, 255, 0.18);
`;

export const IngredientName = styled.h3`
  margin: 0;

  color: ${colorPalette.Black};

  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
`;

export const Description = styled.p`
  margin: 8px 0 0;

  color: ${colorPalette.Black};

  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
`;