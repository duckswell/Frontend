import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

interface BottomSheetProps {
  $expanded: boolean;
  $dragOffset: number;
  $collapsedOffset: number;
  $isPositionReady: boolean;
}

export const BottomSheet = styled.section<BottomSheetProps>`
  position: fixed;

  left: 50%;
  bottom: 0;

  z-index: 100;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 402px;

  height: auto;
  max-height: calc(100dvh - 16px);

  padding: 0 16px 16px;

  box-sizing: border-box;

  border-top: 0.5px solid ${colorPalette.grey300};
  border-radius: 24px 24px 0 0;

  background-color: #ffffff;

  box-shadow: 0 -4px 4px rgb(187 187 187 / 20%);

  overflow: hidden;

  transform: translateX(-50%)
    translateY(
      ${({ $expanded, $dragOffset, $collapsedOffset }) => {
        if ($expanded) {
          return `${$dragOffset}px`;
        }

        return `${Math.max($collapsedOffset + $dragOffset, 0)}px`;
      }}
    );

  opacity: ${({ $isPositionReady }) => ($isPositionReady ? 1 : 0)};

  transition: ${({ $dragOffset }) =>
    $dragOffset === 0
      ? "transform 520ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 160ms ease"
      : "none"};

  will-change: transform;

  touch-action: none;
`;

export const DragArea = styled.div`
  position: relative;

  display: flex;
  justify-content: center;

  width: 100%;
  height: 20px;

  flex-shrink: 0;

  cursor: grab;

  touch-action: none;

  user-select: none;

  &::before {
    content: "";

    position: absolute;

    top: -8px;
    left: 0;

    width: 100%;
    height: 48px;
  }

  &:active {
    cursor: grabbing;
  }
`;

export const Handle = styled.div`
  position: absolute;

  top: 16px;
  left: 50%;

  width: 84px;
  height: 4px;

  border-radius: 999999px;

  background-color: #d9d9d9;

  transform: translateX(-50%);

  pointer-events: none;
`;

export const SheetContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  min-height: 0;
`;

export const HeaderArea = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  margin-top: 24px;

  flex-shrink: 0;
`;

export const Title = styled.h2`
  ${typography.H3};

  display: flex;
  align-items: center;

  width: 100%;
  height: 40px;

  margin: 0;

  color: ${colorPalette.Black};
`;

export const Description = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  min-height: 0;

  margin-top: 24px;

  overflow-y: auto;
  overflow-x: hidden;

  overscroll-behavior: contain;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;

  flex-shrink: 0;
`;

export const ButtonArea = styled.div`
  width: 100%;

  margin-top: 24px;

  flex-shrink: 0;
`;
