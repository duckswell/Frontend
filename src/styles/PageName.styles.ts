import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

export const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 56px;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-bottom: 1px solid ${colorPalette.grey50};

  @media (min-width: 768px) {
    height: 64px;
  }
`;

export const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${colorPalette.Black};
  margin: 0;
`;
