import styled from "styled-components";

export const LeftConfetti = styled.div`
  position: absolute;
  top: 50%;
  left: -140px;

  z-index: 1;

  width: 340px;
  height: 420px;

  transform: translateY(-50%);

  pointer-events: none;

  > div {
    width: 100%;
    height: 100%;
  }
`;

export const RightConfetti = styled.div`
  position: absolute;
  top: 50%;
  right: -140px;

  z-index: 1;

  width: 340px;
  height: 420px;

  transform: translateY(-50%) scaleX(-1);

  pointer-events: none;

  > div {
    width: 100%;
    height: 100%;
  }
`;