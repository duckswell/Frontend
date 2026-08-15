import styled from "styled-components";
import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Section = styled.section`
  box-sizing: border-box;

  width: 100%;
  max-width: 370px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

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

export const ProductCard = styled.article`
  flex: 0 0 140px;
  width: 140px;
`;

export const ProductImagePlaceholder = styled.div`
  width: 140px;
  height: 122px;

  border-radius: 4px;
  background-color: #d9d9d9;
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
export const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;
