import styled from "styled-components";

import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

interface PageProps {
  $hasTabBar: boolean;
}

interface ProductCategoryButtonProps {
  $selected: boolean;
}
export const Page = styled.div<PageProps>`
  box-sizing: border-box;

  width: 100%;
  height: 100dvh;

  padding-bottom: ${({ $hasTabBar }) => ($hasTabBar ? "84px" : "24px")};

  overflow-x: hidden;
  overflow-y: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TitleHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 402px;
  height: 56px;

  margin: 0 auto;
`;

export const HeaderTitle = styled.h1`
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const Content = styled.main`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;

  overflow-x: hidden;
`;

export const IngredientSection = styled.section`
  width: 100%;

  padding-top: 16px;
`;

export const SectionTitle = styled.h2`
  ${typography.H3};

  margin: 0;
  padding: 0 16px;

  color: ${colorPalette.Black};
`;

export const IngredientScroll = styled.div`
  box-sizing: border-box;

  display: flex;
  gap: 16px;

  width: 100%;

  margin-top: 28px;
  padding: 0 60px;

  overflow-x: auto;

  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const IngredientCardWrapper = styled.div`
  flex: 0 0 282px;

  scroll-snap-align: center;
  scroll-snap-stop: always;
`;

export const ProductSection = styled.section`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  width: 100%;

  margin-top: 36px;
  padding: 0 16px;
`;

export const ProductCategoryScroll = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  width: calc(100% + 16px);

  overflow-x: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
export const ProductCategoryButton = styled.button<ProductCategoryButtonProps>`
  ${typography.Body1};

  box-sizing: border-box;

  flex-shrink: 0;

  padding: 6px 12px;

  border: none;
  border-radius: 9999px;

  background-color: ${({ $selected }) =>
    $selected ? colorPalette.Black : "transparent"};

  color: ${({ $selected }) =>
    $selected ? colorPalette.OffWhite : colorPalette.Black};

  font-family: inherit;

  white-space: nowrap;

  cursor: pointer;
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 16px;

  width: 100%;

  margin-top: 16px;
`;
export const ScrollTopButton = styled.button<PageProps>`
  position: fixed;
  z-index: 1100;

  right: max(16px, calc((100vw - 402px) / 2 + 16px));
  bottom: ${({ $hasTabBar }) => ($hasTabBar ? "84px" : "10px")};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  padding: 0;

  border: none;
  border-radius: 50%;

  background-color: ${colorPalette.Black};

  cursor: pointer;
`;

export const ScrollTopIcon = styled.img`
  width: 24px;
  height: 24px;

  object-fit: contain;
`;
export const ProductModalContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 370px;

  max-width: calc(100vw - 32px);
`;

export const ProductModalOverlay = styled.div<PageProps>`
  position: fixed;
  z-index: 999;

  top: 0;
  left: 0;
  right: 0;
  bottom: ${({ $hasTabBar }) => ($hasTabBar ? "64px" : "0")};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  @media (min-width: 768px) {
    bottom: ${({ $hasTabBar }) => ($hasTabBar ? "72px" : "0")};
  }
`;
export const ProductModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 100%;ProductCategoryButton
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
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 370px;
  height: 657px;

  max-width: 100%;
  max-height: calc(100dvh - 120px);

  overflow: hidden;

  background-color: ${colorPalette.White};
  color: ${colorPalette.Black};

  ${typography.Body2};
`;
