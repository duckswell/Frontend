import styled from "styled-components";

import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

export const Card = styled.article`
  box-sizing: border-box;

  width: 177px;
`;

export const ProductImagePlaceholder = styled.div`
  width: 177px;
  height: 154px;

  border-radius: 4px;
  background-color: #d9d9d9;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 8px;
`;

export const Brand = styled.p`
  ${typography.Body1Bold};

  margin: 0;

  color: #1f2937;
`;

export const ProductName = styled.p`
  ${typography.Body1};

  margin: 4px 0 0;

  color: #1f2937;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  width: 100%;

  margin-top: 4px;
`;

export const Category = styled.span`
  ${typography.Body2};

  box-sizing: border-box;

  width: fit-content;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 9999px;

  background-color: rgba(251, 251, 251, 0.8);
  color: ${colorPalette.Black};

  white-space: nowrap;
`;
