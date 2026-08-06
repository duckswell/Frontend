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
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  z-index: 1000;
  border-bottom: 1px solid ${colorPalette.grey50};

  @media (min-width: 768px) {
    height: 64px;
    padding: 0 32px;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }
`;

export const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${colorPalette.Black};
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const EmptySpace = styled.div`
  width: 40px;
`;
