import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";

export const Page = styled.div`
  display: flex;
  flex-direction: column;

  min-height: calc(100dvh - 56px);
  margin-top: 56px;

  padding-bottom: 113px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  box-sizing: border-box;

  @media (min-width: 768px) {
    min-height: calc(100dvh - 64px);
    margin-top: 64px;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 16px 16px 0;

  box-sizing: border-box;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;

  width: 100%;
`;

export const BottomArea = styled.div`
  position: fixed;

  left: 50%;
  bottom: 0;

  z-index: 20;

  display: flex;
  justify-content: center;

  width: 100%;
  max-width: 402px;

  padding: 0 16px 16px;

  box-sizing: border-box;

  transform: translateX(-50%);

  background-color: ${colorPalette.OffWhite};

  &::before {
    content: "";

    position: absolute;

    left: 0;
    right: 0;
    bottom: 72px;

    height: 25px;

    pointer-events: none;

    background: linear-gradient(
      to bottom,
      rgba(251, 251, 251, 0) 0%,
      rgba(251, 251, 251, 0.45) 30%,
      rgba(251, 251, 251, 0.75) 60%,
      rgba(251, 251, 251, 0.92) 100%
    );
  }

  > button {
    position: relative;
    z-index: 1;
  }
`;
