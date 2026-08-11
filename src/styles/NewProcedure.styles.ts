import styled, { css } from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

const applyTypography = (type: keyof typeof typography) => css`
  font-size: ${typography[type].fontSize};
  font-weight: ${typography[type].fontWeight};
  line-height: ${typography[type].lineHeight};
  letter-spacing: ${typography[type].letterSpacing};
`;

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
  overflow: visible;
`;

export const FormCard = styled.div`
  background-color: ${colorPalette.OffWhite};
  position: relative;

  &:not(:last-child) {
    border-bottom: 0.5px solid ${colorPalette.Quaternary};
  }
`;

export const AccordionHeader = styled.div<{ $isSingle?: boolean }>`
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${({ $isSingle }) => ($isSingle ? "default" : "pointer")};
  user-select: none;

  .title {
    ${applyTypography("H3")}
    color: ${colorPalette.Black};

    span.is-editing {
      ${applyTypography("Body1")}
      color: ${colorPalette.grey400};
      margin-left: 4px;
    }

    span.has-value {
      ${applyTypography("H3")}
      color: ${colorPalette.Black};
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
  padding-top: 10px;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;

  label {
    display: block;
    ${applyTypography("Body1Bold")}
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
    ${applyTypography("Body1")}
    color: ${colorPalette.Black};
    cursor: pointer;
    box-sizing: border-box;
    transition: border-color 0.15s ease;

    -webkit-tap-highlight-color: transparent;

    &.focused {
      border: 0.5px solid ${colorPalette.Black};
    }

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
      ${applyTypography("Body1")}
      color: ${colorPalette.Black};
      cursor: pointer;

      &:not(:last-child) {
        border-bottom: 0.5px solid ${colorPalette.Quaternary};
      }

      @media (hover: hover) {
        &:hover {
          background-color: ${colorPalette.grey50};
        }
      }

      &:active {
        background-color: ${colorPalette.grey50};
      }
    }
  }
`;

export const DateInputWrapper = styled.div<{
  $hasValue: boolean;
  $isFocused: boolean;
}>`
  width: 100%;
  padding: 14px 16px;
  border: ${({ $isFocused }) =>
    $isFocused
      ? `0.5px solid ${colorPalette.Black}`
      : `0.5px solid ${colorPalette.Quaternary}`};
  border-radius: 12px;
  background-color: ${colorPalette.OffWhite};
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.15s ease;

  -webkit-tap-highlight-color: transparent;

  .calendar-icon {
    width: 20px;
    height: 20px;
    opacity: ${({ $hasValue, $isFocused }) =>
      $hasValue || $isFocused ? 1 : 0.45};
    transition: opacity 0.2s ease;
  }

  .date-text {
    ${applyTypography("Body1")}
    color: ${colorPalette.Black};

    &.placeholder {
      color: ${colorPalette.grey400};
    }
  }
`;

export const CustomCalendarCard = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 16px;
  padding: 20px 16px;
  box-sizing: border-box;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;

    .year-month {
      ${applyTypography("Body1")}
      color: ${colorPalette.Black};
    }

    .nav-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 15px;
        height: 15px;
      }
    }
  }

  .weekdays-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;
    text-align: center;
    margin-bottom: 12px;

    span {
      ${applyTypography("Body1Bold")}
      color: ${colorPalette.Black};

      &.sunday {
        color: #e53935;
      }
    }
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;
    row-gap: 8px;
    margin-bottom: 20px;
  }

  .calendar-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;

    .cancel-btn {
      background: none;
      border: none;
      ${applyTypography("Body1Bold")}
      color: ${colorPalette.Black};
      cursor: pointer;
      padding: 10px 16px;
    }

    .confirm-btn {
      background-color: ${colorPalette.Black};
      border: none;
      border-radius: 12px;
      ${applyTypography("Body1")}
      color: ${colorPalette.OffWhite};
      cursor: pointer;
      padding: 12px 20px;

      @media (hover: hover) {
        &:hover {
          opacity: 0.9;
        }
      }

      &:active {
        opacity: 0.9;
      }
    }
  }
`;

export const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isSelected: boolean;
}>`
  background: none;
  border: none;
  width: 100%;
  max-width: 36px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${applyTypography("Body1")}
  cursor: pointer;
  padding: 0;

  -webkit-tap-highlight-color: transparent;

  color: ${({ $isCurrentMonth, $isSelected }) =>
    $isSelected
      ? colorPalette.OffWhite
      : $isCurrentMonth
        ? colorPalette.Black
        : colorPalette.grey200};

  background-color: ${({ $isSelected }) =>
    $isSelected ? colorPalette.Black : "transparent"};

  @media (hover: hover) {
    &:hover {
      background-color: ${({ $isSelected }) =>
        $isSelected ? colorPalette.Black : colorPalette.grey50};
    }
  }

  &:active {
    background-color: ${({ $isSelected }) =>
      $isSelected ? colorPalette.Black : colorPalette.grey50};
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
      ${applyTypography("Body1Bold")}
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
  transition: border-color 0.15s ease;

  &:focus-within {
    border: 0.5px solid ${colorPalette.Black};
  }

  input {
    width: 32px;
    border: none;
    background: transparent;
    text-align: right;
    font-size: 15px;
    font-weight: 700;
    line-height: 150%;
    letter-spacing: 0;
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
    ${applyTypography("Body1Bold")}
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
  ${applyTypography("Body1Bold")}
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  -webkit-tap-highlight-color: transparent;
`;

export const AddButton = styled.button`
  width: 100%;
  padding: 16px 0;
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 16px;
  background-color: ${colorPalette.OffWhite};
  ${applyTypography("Body1Bold")}
  font-size: 15px;
  color: ${colorPalette.Black};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 120px;

  -webkit-tap-highlight-color: transparent;

  img {
    width: 18px;
    height: 18px;
  }

  @media (hover: hover) {
    &:hover {
      background-color: ${colorPalette.White};
    }
  }

  &:active {
    background-color: ${colorPalette.White};
  }
`;

export const SavedNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 16px;
  ${applyTypography("Body1Bold")}
  color: ${colorPalette.Black};
  margin-bottom: 16px;
  margin-top: -70px;

  .check-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colorPalette.Black};
    color: ${colorPalette.OffWhite};
    display: flex;
    align-items: center;
    justify-content: center;
    ${applyTypography("Body2Bold")}
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px 0;
  background-color: ${colorPalette.FocusPrimary};
  border: none;
  border-radius: 12px;
  color: ${colorPalette.OffWhite};
  ${applyTypography("H3")}
  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      background-color: ${colorPalette.FocusSelected};
    }
  }

  &:active {
    background-color: ${colorPalette.FocusSelected};
  }
`;
