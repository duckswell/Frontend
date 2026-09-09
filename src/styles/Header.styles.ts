import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

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
