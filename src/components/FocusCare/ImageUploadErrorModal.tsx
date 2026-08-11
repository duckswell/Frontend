import * as S from "../../styles/FocusCare/ImageUploadErrorModal.styles";

interface ImageUploadErrorModalProps {
  onCancel: () => void;
  onReupload: () => void;
}

export default function ImageUploadErrorModal({
  onCancel,
  onReupload,
}: ImageUploadErrorModalProps) {
  return (
    <S.Overlay>
      <S.Modal>
        <S.TextArea>
          <S.Title>사진을 다시 올려주세요</S.Title>

          <S.Description>
            사진의 밝기 혹은 조명이 균일할수록
            <br />더 정확한 분석을 제공해 드릴 수 있어요
          </S.Description>
        </S.TextArea>

        <S.ButtonArea>
          <S.CancelButton type="button" onClick={onCancel}>
            취소
          </S.CancelButton>

          <S.ReuploadButton type="button" onClick={onReupload}>
            재업로드
          </S.ReuploadButton>
        </S.ButtonArea>
      </S.Modal>
    </S.Overlay>
  );
}
