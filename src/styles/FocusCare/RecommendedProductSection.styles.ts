import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

interface ProductImagePlaceholderProps {
  $imageUrl?: string;
}

export const Section = styled.section`
  box-sizing: border-box;

  width: 100%;
  max-width: 370px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 40px;
  margin-bottom: 16px;
`;

export const Title = styled.h2`
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const MoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 0;

  border: none;

  background: transparent;

  font-family: inherit;

  cursor: pointer;
`;

export const MoreText = styled.span`
  ${typography.Body2};

  color: ${colorPalette.Secondary};
`;

export const MoreIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const ProductScroll = styled.div`
  box-sizing: border-box;

  display: flex;
  align-items: flex-start;
  gap: 16px;

  width: 100%;
  max-width: 370px;

  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ProductCard = styled.div`
  box-sizing: border-box;

  display: flex;
  flex: 0 0 140px;
  flex-direction: column;
  align-items: flex-start;

  width: 140px;
  min-width: 140px;

  padding: 0;
  margin: 0;
`;

export const ProductImagePlaceholder = styled.div<ProductImagePlaceholderProps>`
  box-sizing: border-box;

  flex-shrink: 0;

  width: 140px;
  height: 122px;

  margin: 0;

  border-radius: 4px;

  background-color: #d9d9d9;

  background-image: ${({ $imageUrl }) =>
    $imageUrl ? `url("${$imageUrl}")` : "none"};

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const ProductInfo = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 100%;

  margin-top: 8px;
`;
export const Brand = styled.p`
  ${typography.Body1Bold};

  width: 100%;
  height: 24px;

  margin: 0;

  overflow: hidden;

  color: ${colorPalette.Black};

  line-height: 24px;

  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ProductName = styled.p`
  ${typography.Body1};

  display: -webkit-box;

  width: 100%;
  height: 48px;

  margin: 0;

  overflow: hidden;

  color: ${colorPalette.Black};

  line-height: 24px;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const ProductLinkButton = styled.button`
  ${typography.Body2};

  box-sizing: border-box;

  width: 140px;

  margin-top: 8px;
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
