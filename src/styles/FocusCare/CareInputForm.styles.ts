import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Section = styled.section`
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

export const OptionalText = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  color: ${colorPalette.FocusPrimary};
`;

export const Description = styled.p`
  margin: 0;

  ${typography.Body1};
  color: ${colorPalette.Black};
`;

export const ConditionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ConditionRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const ConditionButton = styled.button<{ $selected: boolean }>`
  padding: 6px 12px;

  border: 1px solid
    ${({ $selected }) =>
      $selected ? colorPalette.Black : colorPalette.Quaternary};
  border-radius: 999px;

  background-color: ${({ $selected }) =>
    $selected ? colorPalette.Black : colorPalette.OffWhite};

  ${typography.Body1};
  color: ${({ $selected }) =>
    $selected ? colorPalette.OffWhite : colorPalette.Black};

  cursor: pointer;
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

export const SymptomTextarea = styled.textarea`
  box-sizing: border-box;

  width: 100%;
  max-width: 370px;
  height: 80px;

  padding: 16px;

  border: 1px solid ${colorPalette.Quaternary};
  border-radius: 4px;

  background-color: ${colorPalette.OffWhite};

  ${typography.Body1};
  color: ${colorPalette.Black};

  resize: none;

  &::placeholder {
    ${typography.Body1};
    color: ${colorPalette.Secondary};
  }

  &:focus {
    outline: none;
    border-color: ${colorPalette.FocusPrimary};
  }
`;

export const Notice = styled.p`
  margin: 16px 0 0;

  font-family: "Inter", sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 150%;

  color: ${colorPalette.Tertiary};
`;