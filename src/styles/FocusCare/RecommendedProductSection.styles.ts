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
  gap: 16px;

  width: 100%;
  max-width: 370px;

  overflow-x: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ProductCard = styled.button`
  box-sizing: border-box;

  flex: 0 0 140px;

  width: 140px;

  padding: 0;

  border: none;

  background-color: transparent;

  font-family: inherit;
  text-align: left;

  cursor: pointer;
`;

export const ProductImagePlaceholder = styled.div<ProductImagePlaceholderProps>`
  width: 140px;
  height: 122px;

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
  gap: 4px;

  margin-top: 8px;
`;

export const Brand = styled.p`
  ${typography.Body1Bold};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const ProductName = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  width: 100%;
`;

export const Category = styled.span`
  ${typography.Body2};

  width: fit-content;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 9999px;

  background-color: rgba(251, 251, 251, 0.8);
  color: ${colorPalette.Black};

  white-space: nowrap;
`;

export const ProductModalOverlay = styled.div`
  position: fixed;
  z-index: 9999;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

export const ProductModalContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 370px;

  max-width: calc(100vw - 32px);
`;

export const ProductModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 100%;
`;

export const ProductModalCloseButton = styled.button`
  ${typography.Body2};

  box-sizing: border-box;

  padding: 12px;

  border: none;

  background-color: transparent;
  color: ${colorPalette.OffWhite};

  font-family: inherit;

  cursor: pointer;
`;
export const ExternalWebsiteArea = styled.div`
  position: relative;

  width: 100%;
  height: min(657px, calc(100dvh - 120px));

  overflow: hidden;

  border-radius: 4px;

  background-color: ${colorPalette.White};
`;

export const ExternalWebsiteFrame = styled.iframe`
  position: absolute;

  top: 0;
  left: 0;

  width: 590px;
  height: 1011px;

  border: none;

  background-color: ${colorPalette.White};

  transform: scale(0.65);
  transform-origin: top left;
`;
