import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";

export const Page = styled.div`
  display: flex;
  flex-direction: column;

  min-height: calc(100dvh - 64px);
  margin-top: 64px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  box-sizing: border-box;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 48px;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 16px 16px 0;

  box-sizing: border-box;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 44px;

  width: 100%;
`;

export const BottomArea = styled.div`
  width: 100%;
  max-width: 402px;

  margin: auto auto 0;
  padding: 72px 16px 22px;

  box-sizing: border-box;
`;
