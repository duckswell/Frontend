import styled from "styled-components";

import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

interface PageProps {
  $hasTabBar: boolean;
}

interface ProductCategoryButtonProps {
  $selected: boolean;
}

interface IngredientScrollProps {
  $isDragging: boolean;
  $isScrollable: boolean;
}

export const Page = styled.div<PageProps>`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100dvh;

  padding-top: ${({ $hasTabBar }) => ($hasTabBar ? "0" : "56px")};
  padding-bottom: ${({ $hasTabBar }) => ($hasTabBar ? "84px" : "24px")};

  overflow-x: hidden;
  overflow-y: auto;

  background-color: ${colorPalette.OffWhite};

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    padding-top: ${({ $hasTabBar }) => ($hasTabBar ? "0" : "64px")};
  }
`;

export const TitleHeader = styled.header`
  flex-shrink: 0;

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
  flex: 1;
  flex-direction: column;

  width: 100%;
  max-width: 402px;
  min-height: 0;

  margin: 0 auto;

  overflow-x: hidden;
`;

export const IngredientSection = styled.section`
  flex-shrink: 0;

  width: 100%;

  padding-top: 8px;
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

export const IngredientScroll = styled.div<IngredientScrollProps>`
  box-sizing: border-box;

  display: flex;
  gap: 16px;

  width: 100%;

  margin-top: 16px;
  padding: 0 60px;

  overflow-x: ${({ $isScrollable }) => ($isScrollable ? "auto" : "hidden")};
  overflow-y: hidden;

  scroll-snap-type: ${({ $isDragging }) =>
    $isDragging ? "none" : "x mandatory"};

  overscroll-behavior-x: contain;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;

  cursor: ${({ $isScrollable, $isDragging }) => {
    if (!$isScrollable) {
      return "default";
    }

    return $isDragging ? "grabbing" : "grab";
  }};

  user-select: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const IngredientCardWrapper = styled.div`
  flex: 0 0 282px;

  scroll-snap-align: center;
  scroll-snap-stop: always;
`;

/* =========================
   루틴 없음 - 성분 카드
========================= */

export const EmptyIngredientCardArea = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;

  margin-top: 16px;
`;

export const EmptyIngredientCard = styled.div`
  position: relative;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 282px;
  height: 218px;

  overflow: hidden;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};
`;

export const EmptyIngredientLogo = styled.img`
  position: absolute;

  top: 50%;
  left: 50%;

  width: 266px;
  height: 64px;

  object-fit: contain;

  transform: translate(-50%, -50%);

  pointer-events: none;
  user-select: none;
`;

export const EmptyIngredientInfo = styled.div`
  position: absolute;

  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 2;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 6px;

  padding: 16px;

  overflow: hidden;

  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;

  background-color: rgba(255, 255, 255, 0.6);

  /*
   * Figma의 유리 효과
   * 빛 -45 / 80%
   * 굴절·깊이·분산 값은 CSS와 1:1 대응되지 않아서
   * backdrop + highlight + shadow로 최대한 가깝게 표현
   */
  backdrop-filter: blur(8px) saturate(1.15);
  -webkit-backdrop-filter: blur(8px) saturate(1.15);

  box-shadow: inset 1px 1px 1.5px rgba(255, 255, 255, 0.8),
    inset -1px -1px 2px rgba(255, 255, 255, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.025);

  &::before {
    content: "";

    position: absolute;
    inset: 0;

    border-radius: inherit;

    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.28) 26%,
      rgba(255, 255, 255, 0) 52%
    );

    pointer-events: none;
  }

  &::after {
    content: "";

    position: absolute;
    inset: 1px;

    border-radius: 11px;

    box-shadow: inset 0.5px 0.5px 1px rgba(255, 255, 255, 0.8),
      inset -0.5px -0.5px 1px rgba(80, 80, 80, 0.04);

    pointer-events: none;
  }
`;

export const EmptyIngredientTitle = styled.p`
  position: relative;
  z-index: 1;

  margin: 0;

  color: ${colorPalette.Black};

  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
`;

export const EmptyIngredientDescription = styled.p`
  position: relative;
  z-index: 1;

  margin: 0;

  color: ${colorPalette.Black};

  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
`;

/* =========================
   제품 영역
========================= */

export const ProductSection = styled.section`
  box-sizing: border-box;

  display: flex;
  flex: 1;
  flex-direction: column;

  width: 100%;
  min-height: 0;

  margin-top: 36px;
  padding: 0 16px;
`;

export const ProductCategoryScroll = styled.div`
  box-sizing: border-box;

  flex-shrink: 0;

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

/* =========================
   제품 없음
========================= */

export const EmptyProductArea = styled.div`
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 321px;

  background-color: transparent;
`;

export const EmptyProductContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  width: 100%;

  text-align: center;
`;

export const EmptyProductTitle = styled.p`
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const EmptyProductDescription = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Secondary};

  text-align: center;
`;

/* =========================
   루틴 없음
========================= */

export const NoRoutineArea = styled.div`
  box-sizing: border-box;

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 0;
`;

export const NoRoutineContent = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  /*
   * 카테고리 ~ TabBar 사이의 중앙에
   * 문구 + 버튼 묶음 자체가 오도록 약간 아래 여백 보정
   */
  transform: translateY(-4px);
`;

export const NoRoutineDescription = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Secondary};

  text-align: center;
`;

export const StartRoutineButton = styled.button`
  ${typography.H3};

  box-sizing: border-box;

  width: 100%;
  height: 56px;

  margin-top: 36px;
  padding: 0;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: transparent;
  color: ${colorPalette.Black};

  font-family: inherit;

  cursor: pointer;
`;

/* =========================
   맨 위 버튼
========================= */

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
