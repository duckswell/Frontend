import styled, { css } from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

const applyTypography = (type: keyof typeof typography) => css`
  font-size: ${typography[type].fontSize};
  font-weight: ${typography[type].fontWeight};
  line-height: ${typography[type].lineHeight};
  letter-spacing: ${typography[type].letterSpacing};
`;

export const Container = styled.header`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 402px;
  height: 56px;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  z-index: 1000;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  img {
    height: 20px;
    width: auto;
  }
`;

export const SwitchToFocusButton = styled.button<{
  $currentVersion: "focus" | "daily";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 0.5px solid
    ${({ $currentVersion }) =>
      $currentVersion === "focus"
        ? colorPalette.FocusPrimary
        : colorPalette.DailyPrimary};
  background-color: ${colorPalette.OffWhite};
  color: ${({ $currentVersion }) =>
    $currentVersion === "focus"
      ? colorPalette.FocusPrimary
      : colorPalette.DailyPrimary};
  ${applyTypography("Body2Bold")};
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;

  @media (hover: hover) {
    &:hover {
      background-color: ${({ $currentVersion }) =>
        $currentVersion === "focus"
          ? colorPalette.FocusPrimary
          : colorPalette.DailyPrimary};
      color: ${colorPalette.White};
    }
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const ChangeImg = styled.img.attrs<{ $isFocus?: boolean }>(
  ({ $isFocus }) => ({
    src: $isFocus ? "/assets/Change_focus.svg" : "/assets/Change_daily.svg",
    alt: "전환 아이콘",
  }),
)<{ $isFocus?: boolean }>`
  width: 16px;
  height: 16px;
  object-fit: contain;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0) invert(1);
  }

  button:hover & {
    filter: brightness(0) invert(1);
  }
`;
