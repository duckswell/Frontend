import styled from "styled-components";
import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Card = styled.section`
  box-sizing: border-box;

  width: 100%;
  max-width: 370px;

  padding: 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const Title = styled.h2`
  ${typography.H3};

  margin: 0 0 10px;
  color: ${colorPalette.Black};
`;

export const Description = styled.p`
  ${typography.Body1};

  margin: 0 0 10px;
  color: ${colorPalette.Black};
`;

export const IngredientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  margin-bottom: 10px;
`;

export const RecommendIcon = styled.img`
  flex-shrink: 0;

  width: 20px;
  height: 20px;
`;

export const IngredientText = styled.span`
  ${typography.Body2Bold};

  color: ${colorPalette.Secondary};
`;

export const GuideText = styled.p`
  margin: 0;

  color: ${colorPalette.Tertiary};

  font-size: 11px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 0;
`;
