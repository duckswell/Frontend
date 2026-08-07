import styled from "styled-components";
import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

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

  color: ${({ $selected }) =>
    $selected ? colorPalette.OffWhite : colorPalette.Black};

  ${typography.Body1};

  cursor: pointer;
`;
