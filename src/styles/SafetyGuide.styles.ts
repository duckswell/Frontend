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
  max-width: 402px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 80px 16px 40px 16px;
  box-sizing: border-box;
`;

export const LeftColumn = styled.div`
  width: 100%;
`;

export const RightColumn = styled.div`
  width: 100%;
`;

export const Section = styled.section`
  margin-bottom: 50px;
`;

export const Title = styled.h2`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0 0 8px 0;
`;

export const SubDesc = styled.p`
  ${applyTypography("Body1")}
  color: ${colorPalette.Black};
  margin: 0;
`;

export const SectionTitle = styled.h3`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0 0 12px 0;
`;

export const GuideCard = styled.div`
  background-color: ${colorPalette.White};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 6px;
  padding: 16px;
  ${applyTypography("Body1")}
  color: ${colorPalette.Black};
  margin-bottom: 10px;
`;

export const InfoNoticeCard = styled.div`
  background-color: ${colorPalette.White};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 20px 16px;
  margin-bottom: 24px;

  .notice-header {
    display: flex;
    align-items: center;
    gap: 6px;
    ${applyTypography("H3")}
    color: ${colorPalette.Black};
    margin-bottom: 12px;
  }

  .notice-desc {
    ${applyTypography("Body2")}
    color: ${colorPalette.Secondary};
    margin: 0;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

export const ContactCard = styled.div`
  background-color: ${colorPalette.White};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 20px 16px;
  white-space: nowrap;

  .title {
    ${applyTypography("H3")}
    color: ${colorPalette.Black};
    margin-bottom: 8px;
  }

  .time {
    ${applyTypography("Body2")}
    color: ${colorPalette.Secondary};
    margin-bottom: 16px;
  }
`;

export const CallButton = styled.a`
  display: block;
  width: 100%;
  padding: 14px 0;
  background-color: ${colorPalette.White};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  ${applyTypography("Body1Bold")}
  font-size: 15px;
  color: ${colorPalette.Black};
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;

  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      background-color: ${colorPalette.grey50};
    }
  }

  &:active {
    background-color: ${colorPalette.grey50};
  }
`;

export const OperatingTime = styled.span`
  color: ${colorPalette.Secondary};
  ${applyTypography("Body2Bold")}

  @media (min-width: 361px) {
    margin-right: 10px;
  }
`;
