import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

export const Container = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const ProgressBar = styled.div<{ $active: boolean }>`
  flex: 1;
  max-width: 118px;
  height: 8px;
  border-radius: 9999px;
  background-color: ${({ $active }) =>
    $active ? colorPalette.FocusPrimary : colorPalette.White};
`;
