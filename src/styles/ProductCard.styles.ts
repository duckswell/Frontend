import styled from "styled-components";

import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

export const Card = styled.article`
  box-sizing: border-box;

  width: 100%;
  max-width: 177px;

  min-width: 0;
`;

interface ProductImagePlaceholderProps {
  $imageUrl?: string | null;
}

export const ProductImagePlaceholder = styled.div<ProductImagePlaceholderProps>`
  width: 100%;

  aspect-ratio: 177 / 154;

  border-radius: 4px;

  background-color: #d9d9d9;

  background-image: ${({ $imageUrl }) =>
    $imageUrl ? `url("${$imageUrl}")` : "none"};

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

  color: ${colorPalette.Black};
`;

export const ProductName = styled.p`
  ${typography.Body1};

  display: -webkit-box;

  width: 100%;
  min-height: 48px;
  max-height: 48px;

  margin: 4px 0 0;

  overflow: hidden;

  color: ${colorPalette.Black};

  line-height: 24px;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const ProductLinkButton = styled.button`
  ${typography.Body2};

  box-sizing: border-box;

  width: 100%;

  margin-top: 4px;
  padding: 6px 0;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 4px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  font-family: inherit;

  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;
