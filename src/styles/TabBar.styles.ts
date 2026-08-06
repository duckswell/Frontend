import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

export const Container = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 64px;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid ${colorPalette.grey50};
  z-index: 1000;

  @media (min-width: 768px) {
    height: 72px;
    padding: 0 100px;
    box-sizing: border-box;
  }

  @media (min-width: 1024px) {
    padding: 0 200px;
  }
`;

export const TabItem = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 100%;
  cursor: pointer;
  color: ${({ $isActive }) =>
    $isActive ? colorPalette.Black : colorPalette.grey300};
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "400")};
  font-size: 12px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colorPalette.Black};
  }
`;

export const Icon = styled.img`
  width: 24px;
  height: 24px;
`;
