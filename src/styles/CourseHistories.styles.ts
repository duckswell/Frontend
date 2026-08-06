import styled from "styled-components";
import { colorPalette } from "../lib/colorPalette";

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
  font-size: 16px;
  font-weight: 700;
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
      font-size: 14px;
      color: ${colorPalette.Secondary};
      margin-bottom: 4px;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
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
    font-size: 16px;
    font-weight: 700;
    color: ${colorPalette.Black};
    margin-bottom: 12px;
  }

  .notice-desc {
    font-size: 12px;
    color: ${colorPalette.Secondary};
    line-height: 1.5;
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
    font-size: 14px;
    font-weight: 700;
    color: ${colorPalette.Black};
    cursor: pointer;

    &:hover {
      background-color: ${colorPalette.grey50};
    }
  }
`;
