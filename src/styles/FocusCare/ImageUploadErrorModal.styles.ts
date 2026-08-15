import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

export const Modal = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  width: 320px;

  padding: 24px 16px 16px;

  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h2`
  ${typography.H2};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const Description = styled.p`
  margin: 0;

  font-size: 14px;
  font-weight: 500;
  line-height: 150%;

  color: ${colorPalette.Secondary};
`;

export const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;
`;

export const CancelButton = styled.button`
  box-sizing: border-box;

  width: 138px;
  height: 48px;

  padding: 0;

  border: none;
  border-radius: 12px;

  background-color: transparent;

  ${typography.Body1Bold};

  color: ${colorPalette.Black};

  cursor: pointer;
`;

export const ReuploadButton = styled.button`
  box-sizing: border-box;

  width: 138px;
  height: 48px;

  padding: 0;

  border: none;
  border-radius: 12px;

  background-color: ${colorPalette.Black};

  ${typography.Body1Bold};

  color: ${colorPalette.OffWhite};

  cursor: pointer;
`;
