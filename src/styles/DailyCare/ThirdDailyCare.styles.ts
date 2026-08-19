import styled from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

export const Page = styled.div`
  display: flex;
  flex-direction: column;

  min-height: calc(100dvh - 56px);
  margin-top: 56px;

  background-color: ${colorPalette.OffWhite};
  color: ${colorPalette.Black};

  box-sizing: border-box;

  @media (min-width: 768px) {
    min-height: calc(100dvh - 64px);
    margin-top: 64px;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;

  /*
   * 프로그레스바 아래 제목까지 16px
   */
  gap: 16px;

  width: 100%;
  max-width: 402px;

  margin: 0 auto;
  padding: 8px 16px 0;

  box-sizing: border-box;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  width: 100%;
`;

export const RoutineIntro = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;

  box-sizing: border-box;
`;

export const SectionTitle = styled.h2`
  /*
   * 제목 영역 40px
   * 세로 가운데
   */
  display: flex;
  align-items: center;

  width: 100%;
  height: 40px;

  margin: 0;

  color: ${colorPalette.Black};

  font-size: ${typography.H3.fontSize};
  font-weight: ${typography.H3.fontWeight};
  line-height: ${typography.H3.lineHeight};
  letter-spacing: ${typography.H3.letterSpacing};
`;

export const Description = styled.p`
  /*
   * 제목 바로 아래
   */
  margin: 0;

  color: ${colorPalette.Black};

  font-size: ${typography.Body1.fontSize};
  font-weight: ${typography.Body1.fontWeight};
  line-height: ${typography.Body1.lineHeight};
  letter-spacing: ${typography.Body1.letterSpacing};

  word-break: keep-all;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;

  margin-top: 16px;

  box-sizing: border-box;
`;

export const WarningBox = styled.section`
  width: 100%;

  margin-top: 36px;
  padding: 16px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.White};
`;

export const WarningHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const WarningIcon = styled.img`
  width: 16px;
  height: 16px;

  object-fit: contain;
`;

export const WarningTitle = styled.h3`
  margin: 0;

  color: ${colorPalette.Black};

  font-size: ${typography.H3.fontSize};
  font-weight: ${typography.H3.fontWeight};
  line-height: ${typography.H3.lineHeight};
  letter-spacing: ${typography.H3.letterSpacing};
`;

export const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-top: 12px;
`;

export const WarningText = styled.p`
  margin: 0;

  color: ${colorPalette.Secondary};

  font-size: ${typography.Body2.fontSize};
  font-weight: ${typography.Body2.fontWeight};
  line-height: ${typography.Body2.lineHeight};
  letter-spacing: ${typography.Body2.letterSpacing};

  word-break: keep-all;
`;

export const SymptomButton = styled.button`
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

export const CompleteButtonWrapper = styled.div`
  width: 100%;

  margin-top: 40px;

  box-sizing: border-box;

  padding-bottom: 16px;
`;
