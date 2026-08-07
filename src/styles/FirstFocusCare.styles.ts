import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

export const Page = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100dvh;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};
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
  padding: 32px 16px 22px;

  box-sizing: border-box;
`;

export const NextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 370px;
  height: 56px;

  padding: 12px;

  border: none;
  border-radius: 12px;

  background-color: ${colorPalette.FocusPrimary};

  ${typography.H3};
  color: ${colorPalette.OffWhite};

  cursor: pointer;
`;
