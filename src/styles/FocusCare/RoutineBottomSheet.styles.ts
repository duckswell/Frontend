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

  /*
   * 실제 콘텐츠 높이만큼만 사용.
   *
   * 화면보다 길어지는 경우에만
   * 최대 높이를 제한한다.
   */
  height: auto;
  max-height: calc(100dvh - 16px);

  padding: 0 16px 16px;

  box-sizing: border-box;

  border-top: 0.5px solid ${colorPalette.grey300};
  border-radius: 24px 24px 0 0;

  background-color: #ffffff;

  box-shadow: 0 -4px 4px rgb(187 187 187 / 20%);

  overflow: hidden;

  /*
   * 높이는 절대 애니메이션하지 않는다.
   *
   * 오직 translateY 하나만 움직여서
   * 위/아래 이동 중 튀거나 바운스하는 현상을 줄인다.
   */
  transform: translateX(-50%)
    translateY(
      ${({ $expanded, $dragOffset, $collapsedOffset }) => {
        /*
         * 펼친 상태
         *
         * 기본 위치 = 0
         * 아래로 드래그하면 dragOffset만큼 내려감
         */
        if ($expanded) {
          return `${$dragOffset}px`;
        }

        /*
         * 접힌 상태
         *
         * 기본 위치 = collapsedOffset
         * 위로 드래그하면 음수 dragOffset만큼 올라감
         */
        return `${Math.max($collapsedOffset + $dragOffset, 0)}px`;
      }}
    );

  /*
   * 최초 실제 위치를 계산하기 전에는 숨겨 두어
   * 화면 아래에서 갑자기 위치가 바뀌는 현상을 방지.
   */
  opacity: ${({ $isPositionReady }) => ($isPositionReady ? 1 : 0)};

  /*
   * 드래그 중에는 transition 없음.
   *
   * 손을 놓았을 때만 현재 위치에서 목표 위치까지
   * 부드럽게 이동한다.
   *
   * bounce 성향이 없는 easing 사용.
   */
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

  /*
   * DragArea 자체의 실제 터치 영역을
   * 시각적인 영역보다 넓게 확보
   */
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
