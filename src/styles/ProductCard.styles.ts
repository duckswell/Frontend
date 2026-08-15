import styled from "styled-components";

import { typography } from "../lib/typography";

export const Card = styled.article`
  box-sizing: border-box;

  width: 100%;
  max-width: 177px;

  min-width: 0;
`;

export const ProductImagePlaceholder = styled.div`
  width: 100%;

  aspect-ratio: 177 / 154;

  border-radius: 4px;
  background-color: #d9d9d9;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

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

export const ProductImageButton = styled.button`
  display: block;

  width: 100%;

  padding: 0;

  border: none;

  background-color: transparent;

  cursor: pointer;
`;

export const ProductTextButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 100%;

  padding: 0;

  border: none;

  background-color: transparent;

  font-family: inherit;
  text-align: left;

  cursor: pointer;
`;
