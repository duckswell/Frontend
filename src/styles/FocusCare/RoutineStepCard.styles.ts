import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

interface VariantProps {
  $variant: "focus" | "daily";
}

function getPrimaryColor(variant: "focus" | "daily") {
  return variant === "daily"
    ? colorPalette.DailyPrimary
    : colorPalette.FocusPrimary;
}

function getSecondaryColor(variant: "focus" | "daily") {
  return variant === "daily"
    ? colorPalette.DailySecondary
    : colorPalette.FocusSecondary;
}

export const Card = styled.section<VariantProps>`
  width: 100%;
  max-width: 370px;
  padding: 16px;

  box-sizing: border-box;

  border: 0.5px solid ${({ $variant }) => getSecondaryColor($variant)};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StepBadge = styled.span<VariantProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;

  border: 1px solid ${({ $variant }) => getPrimaryColor($variant)};
  border-radius: 999px;

  background-color: ${({ $variant }) =>
    $variant === "daily" ? colorPalette.DailyPrimary : "transparent"};

  color: ${({ $variant }) =>
    $variant === "daily" ? colorPalette.OffWhite : getPrimaryColor($variant)};

  font-size: ${typography.Body2Bold.fontSize};
  font-weight: ${typography.Body2Bold.fontWeight};
  line-height: ${typography.Body2Bold.lineHeight};
  letter-spacing: ${typography.Body2Bold.letterSpacing};

  white-space: nowrap;
`;

export const Title = styled.h3<VariantProps>`
  margin: 0;

  color: ${({ $variant }) => getPrimaryColor($variant)};

  font-size: ${typography.H3.fontSize};
  font-weight: ${typography.H3.fontWeight};
  line-height: ${typography.H3.lineHeight};
  letter-spacing: ${typography.H3.letterSpacing};
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-top: 16px;
`;

export const InfoRow = styled.div<{ $secondary?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  color: ${({ $secondary }) =>
    $secondary ? colorPalette.Secondary : colorPalette.Black};
`;

export const Icon = styled.img`
  flex-shrink: 0;

  width: 24px;
  height: 24px;

  object-fit: contain;
`;

export const InfoContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  min-width: 0;
  padding-top: 1px;
`;

export const InfoLabel = styled.span<{ $secondary?: boolean }>`
  flex-shrink: 0;

  min-width: 44px;

  color: ${({ $secondary }) =>
    $secondary ? colorPalette.Secondary : colorPalette.Black};

  font-size: ${typography.Body1Bold.fontSize};
  font-weight: ${typography.Body1Bold.fontWeight};
  line-height: ${typography.Body1Bold.lineHeight};
  letter-spacing: ${typography.Body1Bold.letterSpacing};
`;

export const InfoText = styled.span<{ $secondary?: boolean }>`
  color: ${({ $secondary }) =>
    $secondary ? colorPalette.Secondary : colorPalette.Black};

  font-size: ${typography.Body1.fontSize};
  font-weight: ${typography.Body1.fontWeight};
  line-height: ${typography.Body1.lineHeight};
  letter-spacing: ${typography.Body1.letterSpacing};

  word-break: keep-all;
`;

export const ProductButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 48px;
  margin-top: 16px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: transparent;
  color: ${colorPalette.Black};

  font-size: ${typography.Body1Bold.fontSize};
  font-weight: ${typography.Body1Bold.fontWeight};
  line-height: ${typography.Body1Bold.lineHeight};
  letter-spacing: ${typography.Body1Bold.letterSpacing};

  cursor: pointer;
`;
