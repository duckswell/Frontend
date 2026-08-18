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
  padding: 64px 16px 100px 16px;
  box-sizing: border-box;
`;

export const Section = styled.section`
  margin-bottom: 28px;
`;

export const SectionTitle = styled.h3`
  ${applyTypography("H3")}
  color: ${colorPalette.Black};
  margin: 0 0 12px 0;
`;

export const TreatmentCard = styled.div`
  background-color: ${colorPalette.White};
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  padding: 0px 5px;

  .card-top {
    padding: 20px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;

    .info {
      h4 {
        ${applyTypography("H3")}
        color: #1f2937;
        margin: 0 0 6px 0;
      }

      p {
        ${applyTypography("Body2")}
        color: #1f2937;
        margin: 0;
      }
    }

    .setting-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 15px;
    }
  }

  .card-bottom {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid #e5e7eb;
    margin-top: 15px;

    .stat-box {
      padding: 16px 0;
      text-align: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      &:not(:last-child)::after {
        content: "";
        position: absolute;
        right: 0;
        top: 20%;
        height: 60%;
        width: 0.5px;
        background-color: #e5e7eb;
      }

      span {
        ${applyTypography("Body2")}
        color: #1f2937;
      }

      strong {
        ${applyTypography("Body1Bold")}
        color: #1f2937;
        margin-left: 6px;
      }
    }
  }
`;

export const LinkCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colorPalette.OffWhite};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;
  padding: 18px 16px;
  cursor: pointer;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
    }

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

  .arrow {
    display: flex;
    align-items: center;

    img {
      width: 7.5px;
      height: 15px;
    }
  }
`;
