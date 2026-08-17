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

  /*
   * care에서 진입한 경우 NavBar가 fixed라서
   * NavBar 높이만큼 페이지 시작 위치 확보
   */
  padding-top: ${({ $hasTabBar }) => ($hasTabBar ? "0" : "56px")};
  padding-bottom: ${({ $hasTabBar }) => ($hasTabBar ? "84px" : "24px")};

  overflow-x: hidden;
  overflow-y: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    padding-top: ${({ $hasTabBar }) => ($hasTabBar ? "0" : "64px")};
  }
`;

export const IngredientSection = styled.section`
  width: 100%;

  padding-top: 16px;
`;

export const SectionTitle = styled.h2`
  ${typography.H3};

  display: flex;
  align-items: center;

  box-sizing: border-box;

  width: 100%;
  height: 40px;

  margin: 0;
  padding: 0 16px;

  color: ${colorPalette.Black};
`;

export const IngredientScroll = styled.div`
  box-sizing: border-box;

  display: flex;
  gap: 16px;

  width: 100%;

  /*
   * 40px 제목 영역과 카드 사이 16px
   */
  margin-top: 16px;
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
  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 8px;

  width: calc(100% + 32px);

  margin-left: -16px;
  padding: 0 16px;

  overflow-x: auto;
  overflow-y: hidden;

  scroll-padding-inline: 16px;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;

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
  min-width: 0;

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
