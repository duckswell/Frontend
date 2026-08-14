import styled, { keyframes } from "styled-components";
import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

const slideUp = keyframes`
  from {
    transform: translateX(-50%) translateY(100%);
  }

  to {
    transform: translateX(-50%) translateY(0);
  }
`;

interface BottomSheetProps {
  $expanded: boolean;
  $dragOffset: number;
}

interface SheetContentProps {
  $expanded: boolean;
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

  /* height: 600px; 삭제 */

  padding: 0 16px 16px;

  box-sizing: border-box;

  border-top: 0.5px solid ${colorPalette.grey300};
  border-radius: 24px 24px 0 0;

  background-color: #ffffff;

  box-shadow: 0 -4px 4px rgb(187 187 187 / 20%);

  touch-action: none;

  animation: ${slideUp} 0.45s ease-out;

  transform: translateX(-50%)
    translateY(
      ${({ $expanded, $dragOffset }) => {
        if ($expanded) {
          return `${Math.max($dragOffset, 0)}px`;
        }

        return `calc(
          100% - 40px + ${Math.min($dragOffset, 0)}px
        )`;
      }}
    );

  transition: ${({ $dragOffset }) =>
    $dragOffset === 0 ? "transform 0.3s ease" : "none"};
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;

  /* 카드 ↔ 카드 = 16px */
  gap: 16px;

  margin-top: 24px;
`;

export const ButtonArea = styled.div`
  width: 100%;

  /* 마지막 카드 ↔ 버튼 = 24px */
  margin-top: 24px;
`;

export const DragArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 40px;

  flex-shrink: 0;

  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;

export const Handle = styled.div`
  width: 84px;
  height: 4px;

  border-radius: 999999px;

  background-color: #d9d9d9;
`;

export const SheetContent = styled.div<SheetContentProps>`
  display: flex;
  flex-direction: column;

  width: 100%;

  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};

  pointer-events: ${({ $expanded }) => ($expanded ? "auto" : "none")};

  transition: opacity 0.15s ease;
`;

export const HeaderArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h2`
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const Description = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Black};
`;
