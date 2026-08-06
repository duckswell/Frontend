import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

export const Container = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 30px 20px 80px 20px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 1024px;
    padding: 80px 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
    row-gap: 0;

    align-content: center;
    align-items: center;
  }
`;

export const LeftColumn = styled.div`
  width: 100%;
`;

export const RightColumn = styled.div`
  width: 100%;
`;

export const HeroCard = styled.div<{ $isFocus: boolean }>`
  background-color: ${({ $isFocus }) => ($isFocus ? "#E3F2FD" : "#EDF9DE")};
  background-image: ${({ $isFocus }) =>
    $isFocus ? `url('/assets/ConcImg.svg')` : `url('/images/DailyImg.svg')`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    padding: 28px;
    margin-bottom: 0;
  }
`;

export const Badge = styled.div<{ $isFocus: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  border: 0.5px solid ${colorPalette.FocusPrimary};
  background-color: ${colorPalette.OffWhite};
  color: ${({ $isFocus }) =>
    $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const HeroTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${colorPalette.Black};
  line-height: 1.35;
  margin: 0 0 16px 0;
  white-space: pre-line;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

export const StatItem = styled.div`
  background-color: ${colorPalette.OffWhite};
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;

  span {
    display: block;
    font-size: 12px;
    color: ${colorPalette.Black};
    margin-bottom: 6px;
  }

  strong {
    font-size: 32px;
    font-weight: 500;
    color: ${colorPalette.Black};
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;
  }
`;
export const Percent = styled.div`
  font-size: 16px;
  font-weight: 900;
  line-height: 100%;
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
`;

export const Updown = styled.div`
  font-size: 30px;
  font-weight: 900;
  line-height: 100%;
  color: ${colorPalette.FocusPrimary};
`;
export const RoutineButton = styled.button<{ $isFocus: boolean }>`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background-color: ${({ $isFocus }) =>
    $isFocus ? colorPalette.FocusPrimary : colorPalette.DailyPrimary};
  color: ${colorPalette.OffWhite};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: ${({ $isFocus }) =>
      $isFocus ? colorPalette.FocusSelected : colorPalette.DailySelected};
  }
`;

export const BannerCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colorPalette.OffWhite};
  border: 1px solid ${colorPalette.grey50};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }

    .desc {
      font-size: 12px;
      color: ${colorPalette.grey400};
      margin-bottom: 2px;
    }

    .title {
      font-size: 15px;
      font-weight: 700;
      color: ${colorPalette.Black};
    }
  }

  .arrow {
    color: ${colorPalette.grey400};
    font-size: 18px;
  }
`;

export const SectionHeader = styled.div`
  margin: 24px 0 12px 0;

  @media (min-width: 768px) {
    margin: 0 0 16px 0;
  }

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: ${colorPalette.Black};
    margin: 0 0 4px 0;
  }

  p {
    font-size: 12px;
    color: ${colorPalette.grey400};
    margin: 0;
  }
`;

export const TodoCard = styled.div<{ $isChecked: boolean; $isFocus: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 10px;
  border: 1px solid
    ${({ $isChecked }) => ($isChecked ? "transparent" : colorPalette.grey50)};
  background-color: ${({ $isChecked, $isFocus }) =>
    $isChecked
      ? $isFocus
        ? colorPalette.FocusTertiary
        : colorPalette.DailyTertiary
      : colorPalette.OffWhite};

  .checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ $isChecked, $isFocus }) =>
      $isChecked
        ? $isFocus
          ? colorPalette.FocusPrimary
          : colorPalette.DailyPrimary
        : colorPalette.OffWhite};
    border: 1px solid
      ${({ $isChecked }) => ($isChecked ? "transparent" : colorPalette.grey200)};
    color: ${colorPalette.OffWhite};
    font-size: 12px;
    cursor: pointer;
  }

  .content {
    h4 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: ${({ $isChecked, $isFocus }) =>
        $isChecked
          ? $isFocus
            ? colorPalette.FocusPrimary
            : colorPalette.DailyPrimary
          : colorPalette.Black};
    }

    p {
      font-size: 12px;
      color: ${({ $isChecked, $isFocus }) =>
        $isChecked
          ? $isFocus
            ? colorPalette.FocusPrimary
            : colorPalette.DailyPrimary
          : colorPalette.grey400};
      margin: 0;
      line-height: 1.4;
    }
  }
`;
