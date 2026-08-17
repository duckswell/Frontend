import styled, { css, keyframes } from "styled-components";
import { colorPalette } from "../lib/colorPalette";
import { typography } from "../lib/typography";

const applyTypography = (type: keyof typeof typography) => css`
  font-size: ${typography[type].fontSize};
  font-weight: ${typography[type].fontWeight};
  line-height: ${typography[type].lineHeight};
  letter-spacing: ${typography[type].letterSpacing};
`;

const slideUpDown = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  85% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 402px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 64px 16px 120px 16px;
  box-sizing: border-box;
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
        color: ${colorPalette.Red};
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
  $isToday?: boolean;
  $isSelectable?: boolean;
}>`
  width: 100%;
  max-width: 48px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${applyTypography("Body1")}
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;

  -webkit-tap-highlight-color: transparent;

  border: ${({ $isSelected, $isToday }) =>
    $isSelected ? "none" : $isToday ? `0.5px solid #000` : "none"};

  color: ${({ $isCurrentMonth, $isSelected, $isSelectable = true }) =>
    $isSelected
      ? colorPalette.OffWhite
      : !$isSelectable || !$isCurrentMonth
        ? colorPalette.Secondary
        : colorPalette.Black};

  background-color: ${({ $isSelected }) =>
    $isSelected ? colorPalette.Black : "transparent"};

  &:disabled {
    color: ${colorPalette.Secondary} !important;
    cursor: default !important;
    pointer-events: none !important;
    background-color: transparent !important;
    border: none !important;
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      background-color: ${({ $isSelected }) =>
        $isSelected ? colorPalette.Black : colorPalette.Secondary};
    }
  }

  &:not(:disabled):active {
    background-color: ${({ $isSelected }) =>
      $isSelected ? colorPalette.Black : colorPalette.Secondary};
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 52px;
  width: auto;
  box-sizing: border-box;
  transition:
    border-color 0.15s ease,
    width 0.15s ease;

  &:focus-within {
    border: 0.5px solid ${colorPalette.Black};
  }

  input {
    min-width: 1.2ch;
    width: auto;
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
    white-space: nowrap;
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
  ${applyTypography("Body1")}
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  -webkit-tap-highlight-color: transparent;
`;
export const CardDeleteButton = styled.button`
  width: 100%;
  padding: 16px 0;
  border: 0.5px solid transparent;
  border-radius: 16px;
  background-color: ${colorPalette.OffWhite};
  ${applyTypography("Body1Bold")}
  font-size: 15px;
  color: ${colorPalette.Red};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin-top: 16px;
  margin-bottom: 8px;

  -webkit-tap-highlight-color: transparent;

  img {
    width: 24px;
    height: 24px;
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
  margin-bottom: 24px;

  -webkit-tap-highlight-color: transparent;

  img {
    width: 24px;
    height: 24px;
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
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  gap: 12px;

  width: calc(100% - 32px);
  max-width: 370px;
  padding: 16px;
  box-sizing: border-box;

  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  ${applyTypography("Body1Bold")}
  color: ${colorPalette.Black};

  pointer-events: none;
  z-index: 25;

  animation: ${slideUpDown} 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  .check-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colorPalette.Black};
    color: ${colorPalette.OffWhite};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const BottomArea = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 20;

  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 402px;
  padding: 0 16px 16px;
  box-sizing: border-box;

  transform: translateX(-50%);
  background-color: ${colorPalette.OffWhite};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;

    height: 25px;
    pointer-events: none;

    background: linear-gradient(
      to bottom,
      rgba(251, 251, 251, 0) 0%,
      rgba(251, 251, 251, 0.45) 30%,
      rgba(251, 251, 251, 0.75) 60%,
      rgba(251, 251, 251, 0.92) 100%
    );
  }

  > button {
    position: relative;
    z-index: 1;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px 0;
  background-color: ${colorPalette.FocusPrimary};
  color: ${colorPalette.OffWhite};
  border: none;
  border-radius: 12px;
  ${applyTypography("H3")}
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;

  -webkit-tap-highlight-color: transparent;

  &:disabled {
    background-color: ${colorPalette.White};
    color: ${colorPalette.Tertiary};
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      background-color: ${colorPalette.FocusSelected};
    }
  }

  &:not(:disabled):active {
    background-color: ${colorPalette.FocusSelected};
    color: ${colorPalette.OffWhite};
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  box-sizing: border-box;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 320px;
  background-color: ${colorPalette.OffWhite};
  border-radius: 12px;
  padding: 24px 16px 16px 16px;
  box-sizing: border-box;

  h3 {
    margin: 0 0 8px 0;
    ${applyTypography("H2")}
    color: ${colorPalette.Black};
  }

  p {
    margin: 0 0 24px 0;
    ${applyTypography("Body1")}
    color: ${colorPalette.Secondary};
  }

  .modal-buttons {
    display: flex;
    align-items: center;
    gap: 10px;

    button {
      flex: 1;
      padding: 12px 8px;
      border-radius: 12px;
      ${applyTypography("Body1Bold")}
      cursor: pointer;
      border: none;
      -webkit-tap-highlight-color: transparent;
    }

    .cancel-btn {
      background-color: ${colorPalette.OffWhite};
      color: ${colorPalette.Black};
    }

    .delete-btn {
      background-color: ${colorPalette.Red};
      color: ${colorPalette.OffWhite};
    }
  }
`;
