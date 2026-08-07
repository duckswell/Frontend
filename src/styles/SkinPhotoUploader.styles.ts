import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h2`
  margin: 0;

  ${typography.H3};
  color: ${colorPalette.Black};
`;

export const Description = styled.p`
  margin: 0;

  ${typography.Body1};
  color: ${colorPalette.Black};
`;

export const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;
  max-width: 370px;
  height: 48px;

  padding: 0;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};

  cursor: pointer;
`;

export const PlusIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const UploadText = styled.span`
  ${typography.Body1Bold};
  color: ${colorPalette.Black};
`;

export const HiddenInput = styled.input`
  display: none;
`;
