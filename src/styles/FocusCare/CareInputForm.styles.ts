import styled, { keyframes } from "styled-components";

import { colorPalette } from "../../lib/colorPalette";
import { typography } from "../../lib/typography";

type CareVariant = "focus" | "daily";

export const Section = styled.section`
  position: relative;

  display: flex;
  flex-direction: column;

  /*
   * 질문/설명 영역과 실제 입력 UI 사이
   */
  gap: 16px;

  width: 100%;
`;

export const TextArea = styled.div`
  display: flex;
  flex-direction: column;

  /*
   * 질문과 설명은 별도의 큰 gap 없이 바로 이어짐
   */
  gap: 0;

  width: 100%;
`;

export const Title = styled.h2`
  ${typography.H3};

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  width: 100%;
  height: 40px;

  margin: 0;

  color: ${colorPalette.Black};
`;

export const OptionalText = styled.span<{
  $variant: CareVariant;
}>`
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  margin-left: 2px;
  color: ${({ $variant }) =>
    $variant === "daily"
      ? colorPalette.DailyPrimary
      : colorPalette.FocusPrimary};
`;

export const Description = styled.p`
  ${typography.Body1};

  margin: 0;

  color: ${colorPalette.Black};

  word-break: keep-all;
`;

export const ConditionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ConditionRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const ConditionButton = styled.button<{
  $selected: boolean;
}>`
  padding: 6px 12px;

  border: 1px solid
    ${({ $selected }) =>
      $selected ? colorPalette.Black : colorPalette.Quaternary};

  border-radius: 999px;

  background-color: ${({ $selected }) =>
    $selected ? colorPalette.Black : colorPalette.OffWhite};

  ${typography.Body1};

  color: ${({ $selected }) =>
    $selected ? colorPalette.OffWhite : colorPalette.Black};

  cursor: pointer;
`;

/* =========================
   이미지 미리보기
========================= */

export const ImagePreviewList = styled.div`
  display: flex;
  gap: 6px;

  width: 100%;

  overflow-x: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ImagePreviewItem = styled.div`
  position: relative;

  flex-shrink: 0;

  width: 127px;
  height: 127px;

  padding-top: 7px;
  padding-right: 7px;

  box-sizing: border-box;
`;

export const PreviewImage = styled.img`
  display: block;

  width: 120px;
  height: 120px;

  box-sizing: border-box;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 4px;

  object-fit: cover;
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 19px;
  height: 19px;

  padding: 0;
  border: none;

  background: transparent;

  cursor: pointer;

  img {
    width: 19px;
    height: 19px;
  }
`;

export const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 100%;
  max-width: 370px;
  height: 48px;

  padding: 0;

  border: 0.5px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};

  cursor: pointer;
`;

export const PlusIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const UploadText = styled.span`
  ${typography.Body1Bold};

  color: ${colorPalette.Black};
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const SymptomTextarea = styled.textarea`
  box-sizing: border-box;

  width: 100%;
  max-width: 370px;
  height: 80px;

  padding: 16px;

  border: 1px solid ${colorPalette.Quaternary};
  border-radius: 4px;

  background-color: ${colorPalette.OffWhite};

  ${typography.Body1};

  color: ${colorPalette.Black};

  resize: none;

  &::placeholder {
    ${typography.Body1};

    color: ${colorPalette.Secondary};
  }

  &:focus {
    outline: none;

    border-color: ${colorPalette.Black};
  }
`;

export const Notice = styled.p`
  margin: 36px 0 0;

  font-family: "Inter", sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 150%;

  color: ${colorPalette.Tertiary};

  word-break: keep-all;
`;

/* =========================
   사진 등록 완료
========================= */

export const CheckIcon = styled.img`
  flex-shrink: 0;

  width: 19px;
  height: 19px;
`;

export const UploadCompleteText = styled.span`
  ${typography.Body1Bold};

  color: ${colorPalette.Black};
`;

const showToast = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  15% {
    opacity: 1;
    transform: translateY(0);
  }

  85% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(20px);
  }
`;

export const UploadToast = styled.div`
  position: fixed;
  z-index: 30;

  left: 50%;

  bottom: 88px;

  display: flex;
  align-items: center;
  gap: 12px;

  width: calc(100% - 32px);
  max-width: 370px;

  padding: 16px;

  box-sizing: border-box;

  border: 1px solid ${colorPalette.Quaternary};
  border-radius: 12px;

  background-color: ${colorPalette.OffWhite};

  translate: -50% 0;

  animation: ${showToast} 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  pointer-events: none;
`;
export const SymptomArea = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`;
