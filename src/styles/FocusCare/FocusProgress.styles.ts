import styled, { css, keyframes } from "styled-components";
import { colorPalette } from "../../lib/colorPalette";

const fillProgress = keyframes`
  0% {
    width: 0%;
  }

  25% {
    width: 80%;
  }

  100% {
    width: 100%;
  }
`;

export const Container = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

interface ProgressBarProps {
  $completed: boolean;
  $current: boolean;
}

export const ProgressBar = styled.div<ProgressBarProps>`
  position: relative;

  flex: 1;
  max-width: 118px;
  height: 8px;

  overflow: hidden;

  border-radius: 9999px;
  background-color: ${colorPalette.White};

  &::after {
    content: "";

    position: absolute;
    top: 0;
    left: 0;

    height: 100%;

    border-radius: inherit;
    background-color: ${colorPalette.FocusPrimary};

    ${({ $completed, $current }) => {
      if ($completed) {
        return css`
          width: 100%;
        `;
      }

      if ($current) {
        return css`
          width: 0;
          animation: ${fillProgress} 1.2s linear forwards;
        `;
      }

      return css`
        width: 0;
      `;
    }}
  }
`;
