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
  padding: 140px 16px 16px;
`;

export const ConfettiArea = styled.div`
  position: relative;

  display: flex;
  justify-content: center;

  width: 100%;

  overflow: visible;
`;

export const TitleArea = styled.div`
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: center;

  width: 100%;

  text-align: center;
`;

export const Title = styled.h1`
  margin: 0;

  color: #1f2937;

  font-size: ${typography.H1.fontSize};
  font-weight: ${typography.H1.fontWeight};
  line-height: ${typography.H1.lineHeight};
  letter-spacing: ${typography.H1.letterSpacing};

  text-align: center;
`;

export const RoutineRecordCard = styled.section`
  box-sizing: border-box;

  width: 100%;
  max-width: 370px;

  margin-top: 124px;
  padding: 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const RecordTitle = styled.h2`
  margin: 0;

  color: ${colorPalette.Black};

  font-size: ${typography.H3.fontSize};
  font-weight: ${typography.H3.fontWeight};
  line-height: ${typography.H3.lineHeight};
  letter-spacing: ${typography.H3.letterSpacing};
`;

export const RecordDescription = styled.p`
  margin: 10px 0 0;

  color: ${colorPalette.Black};

  font-size: ${typography.Body1.fontSize};
  font-weight: ${typography.Body1.fontWeight};
  line-height: ${typography.Body1.lineHeight};
  letter-spacing: ${typography.Body1.letterSpacing};

  word-break: keep-all;
`;

export const RecordNotice = styled.p`
  margin: 10px 0 0;

  color: ${colorPalette.Tertiary};

  font-family: "Inter", sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 0;

  word-break: keep-all;
`;

export const ProductSection = styled.section`
  width: 100%;
  max-width: 370px;

  margin-top: 36px;
`;

export const ButtonArea = styled.div`
  width: 100%;
  max-width: 370px;

  margin-top: 40px;
`;
