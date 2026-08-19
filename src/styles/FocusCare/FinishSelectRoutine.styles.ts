import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  width: 100%;
  min-height: 100dvh;

  background-color: ${colorPalette.OffWhite};
`;

export const Content = styled.main`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 402px;
  min-height: 100dvh;

  margin: 0 auto;
  padding: 0 16px 16px;

  overflow: hidden;
`;
export const CompletionSection = styled.section`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 100%;

  padding-top: 152px;
`;

export const IntroTextArea = styled.div`
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

export const Description = styled.p`
  margin: 16px 0 0;

  color: #000000;

  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;

  text-align: center;
`;

export const IntroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  margin-top: 36px;
`;

export const Title = styled.h1`
  margin: 0;

  color: #1f2937;

  font-size: 24px;
  font-weight: 600;
  line-height: 1.35;

  text-align: center;
`;

export const RoutineCard = styled.div`
  position: relative;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: fit-content;
  min-width: 208px;
  max-width: 100%;

  padding: 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;
export const RecommendedBadge = styled.div`
  ${typography.Body2Bold};

  position: absolute;
  z-index: 3;

  top: -14px;
  left: 20px;

  width: fit-content;

  padding: 6px 12px;

  border-radius: 999px;

  background-color: ${colorPalette.FocusTertiary};
  color: ${colorPalette.FocusPrimary};

  white-space: nowrap;

  pointer-events: none;
`;
export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;

  width: fit-content;
  max-width: 100%;

  margin-top: 8px;
`;

export const Category = styled.span`
  ${typography.Body2};

  box-sizing: border-box;

  flex-shrink: 0;

  width: fit-content;

  padding: 6px 12px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 9999px;

  background-color: ${colorPalette.White};
  color: ${colorPalette.Black};

  white-space: nowrap;
`;
export const RoutineImage = styled.img`
  width: 42px;
  height: 42px;

  object-fit: cover;

  border-radius: 50%;
`;

export const RoutineName = styled.h2`
  margin: 16px 0 0;

  color: #1f2937;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
`;

export const ProductSection = styled.div`
  width: 100%;
  max-width: 370px;

  margin-top: 62px;
`;

export const ButtonArea = styled.div`
  width: 100%;
  max-width: 370px;

  margin-top: 32px;
`;
