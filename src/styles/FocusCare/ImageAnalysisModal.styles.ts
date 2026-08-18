import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

export const Modal = styled.div`
  box-sizing: border-box;

  width: 292px;

  padding: 60px 0;

  border-radius: 12px;

  background-color: ${colorPalette.White};

  > section {
    margin: 0;
  }
`;
