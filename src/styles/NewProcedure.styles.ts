import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

export const Container = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 64px 20px 100px 20px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 680px;
    padding: 80px 40px 120px 40px;
  }
`;

export const FormCardGroup = styled.div`
  background-color: ${colorPalette.OffWhite};
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
`;

export const FormCard = styled.div`
  background-color: ${colorPalette.OffWhite};

  &:not(:last-child) {
    border-bottom: 0.5px solid ${colorPalette.Quaternary};
  }
`;

export const AccordionHeader = styled.div<{ $isSingle?: boolean }>`
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${({ $isSingle }) => ($isSingle ? "default" : "pointer")};
  user-select: none;

  .title {
    font-size: 16px;
    font-weight: 700;
    color: ${colorPalette.Black};

    span.is-editing {
      color: ${colorPalette.grey400};
      font-weight: 500;
      font-size: 14px;
      margin-left: 4px;
    }

    span.has-value {
      color: ${colorPalette.Black};
      font-weight: 700;
      font-size: 16px;
      margin-left: 4px;
    }
  }

  .arrow-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;

    &.open {
      transform: rotate(180deg);
    }
  }
`;

export const CardBody = styled.div`
  padding: 10px 20px 28px 20px;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: ${colorPalette.Black};
    margin-bottom: 10px;
  }
`;

export const SelectBox = styled.div`
  position: relative;

  .select-header {
    width: 100%;
    padding: 14px 16px;
    border: 0.5px solid ${colorPalette.Quaternary};
    border-radius: 12px;
    background-color: ${colorPalette.OffWhite};
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: ${colorPalette.Black};
    cursor: pointer;
    box-sizing: border-box;

    &.placeholder {
      color: ${colorPalette.grey400};
    }

    .dropdown-icon {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  .options-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background-color: ${colorPalette.OffWhite};
    border: 0.5px solid ${colorPalette.Quaternary};
    border-radius: 12px;
    z-index: 10;
    overflow: hidden;

    .option-item {
      padding: 14px 16px;
      font-size: 14px;
      color: ${colorPalette.Black};
      cursor: pointer;

      &:hover {
        background-color: ${colorPalette.grey50};
      }
    }
  }
`;

export const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input[type="date"] {
    width: 100%;
    padding: 14px 16px;
    border: 0.5px solid ${colorPalette.Quaternary};
    border-radius: 12px;
    background-color: ${colorPalette.OffWhite};
    font-size: 14px;
    font-weight: 600;
    color: ${colorPalette.Black};
    outline: none;
    box-sizing: border-box;
    font-family: inherit;

    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
    }
  }
`;

export const CountGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;

  .count-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .label-text {
      font-size: 14px;
      font-weight: 700;
      color: ${colorPalette.Black};
    }
  }
`;

export const InputBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 12px 12px 12px 0;
  width: 40px;

  input {
    width: 32px;
    border: none;
    background: transparent;
    text-align: right;
    font-size: 15px;
    font-weight: 700;
    color: ${colorPalette.Black};
    outline: none;
    padding: 0;

    &::placeholder {
      color: ${colorPalette.grey400};
      font-weight: 500;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .unit {
    font-size: 14px;
    font-weight: 600;
    color: ${colorPalette.Black};
    margin-left: 4px;
    margin-right: 11px;
  }
`;

export const PartsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PartChip = styled.button<{ $isSelected: boolean }>`
  padding: 10px 18px;
  border-radius: 999px;
  border: 0.5px solid
    ${({ $isSelected }) =>
      $isSelected ? "transparent" : colorPalette.Quaternary};
  background-color: ${({ $isSelected }) =>
    $isSelected ? colorPalette.Black : colorPalette.OffWhite};
  color: ${({ $isSelected }) =>
    $isSelected ? colorPalette.OffWhite : colorPalette.Black};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
`;

export const AddButton = styled.button`
  width: 100%;
  padding: 16px 0;
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 16px;
  background-color: ${colorPalette.OffWhite};
  font-size: 15px;
  font-weight: 700;
  color: ${colorPalette.Black};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 24px;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: ${colorPalette.grey50};
  }
`;

export const SavedNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  color: ${colorPalette.Black};
  margin-bottom: 16px;

  .check-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colorPalette.Black};
    color: ${colorPalette.OffWhite};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px 0;
  background-color: ${colorPalette.FocusPrimary};
  border: none;
  border-radius: 12px;
  color: ${colorPalette.OffWhite};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: ${colorPalette.FocusSelected};
  }
`;
