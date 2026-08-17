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
  align-items: flex-start;
  justify-content: center;

  flex-shrink: 0;

  width: 100%;

  box-sizing: border-box;

  padding-top: 152px;
  padding-bottom: 120px;
`;

export const Title = styled.h1`
  ${typography.H1};

  position: relative;
  z-index: 2;

  margin: 0;

  color: #1f2937;
  text-align: center;
`;

export const RoutineRecordCard = styled.section`
  box-sizing: border-box;

  width: 100%;
  max-width: 370px;

  padding: 16px;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const RecordTitle = styled.h2`
  ${typography.H3};

  margin: 0;

  color: ${colorPalette.Black};
`;

export const RecordDescription = styled.p`
  ${typography.Body1};

  margin: 10px 0 0;

  color: ${colorPalette.Black};

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
