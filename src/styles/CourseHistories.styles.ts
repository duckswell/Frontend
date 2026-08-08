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
  padding: 64px 20px 40px 20px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 600px;
    padding: 80px 40px 60px 40px;
  }
`;

export const Section = styled.section`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h3`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0 0 12px 0;
`;

export const CourseCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 18px 16px;
  margin-bottom: 10px;

  .icon-img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .content {
    .desc {
      ${applyTypography("Body1")}
      color: ${colorPalette.Secondary};
      margin-bottom: 4px;
    }

    .title {
      ${applyTypography("H3")}
      color: ${colorPalette.Black};
    }
  }
`;

export const InfoNoticeCard = styled.div`
  background-color: ${colorPalette.White};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 20px 16px;

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
    margin: 0 0 16px 0;
  }

  img {
    width: 16px;
    height: 16px;
  }

  .safety-btn {
    width: 100%;
    padding: 14px 0;
    background-color: ${colorPalette.White};
    border: 0.5px solid ${colorPalette.Quaternary};
    border-radius: 12px;
    ${applyTypography("Body1Bold")}
    color: ${colorPalette.Black};
    cursor: pointer;

    &:hover {
      background-color: ${colorPalette.grey50};
    }
  }
`;
