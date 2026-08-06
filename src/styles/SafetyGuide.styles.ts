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
    max-width: 1024px;
    padding: 80px 40px 60px 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
    row-gap: 0;
    align-items: start;
  }
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
  font-size: 16px;
  font-weight: 700;
  color: ${colorPalette.Black};
  margin: 0 0 8px 0;
`;

export const SubDesc = styled.p`
  font-size: 14px;
  color: ${colorPalette.Black};
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${colorPalette.Black};
  margin: 0 0 12px 0;
`;

export const GuideCard = styled.div`
  background-color: ${colorPalette.White};
  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 6px;
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
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
    font-size: 16px;
    font-weight: 700;
    color: ${colorPalette.Black};
    margin-bottom: 12px;
  }

  .notice-desc {
    font-size: 12px;
    color: ${colorPalette.Secondary};
    line-height: 1.5;
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

  .title {
    font-size: 16px;
    font-weight: 700;
    color: ${colorPalette.Black};
    margin-bottom: 8px;
  }

  .time {
    font-size: 12px;
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
  font-size: 15px;
  font-weight: 700;
  color: ${colorPalette.Black};
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;

  &:hover {
    background-color: ${colorPalette.grey50};
  }
`;

export const OperatingTime = styled.span`
  color: ${colorPalette.Secondary};
  font-size: 12px;
  font-weight: 700;
  margin-right: 10px;
`;
