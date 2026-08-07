import { useRef } from "react";
import * as S from "../../styles/FocusCare/SkinPhotoUploader.styles";

interface SkinPhotoUploaderProps {
  onChangeImage: (file: File | null) => void;
}

export default function SkinPhotoUploader({
  onChangeImage,
}: SkinPhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    onChangeImage(file);
  };

  return (
    <S.Container>
      <S.TextArea>
        <S.Title>사진으로 피부 상태 확인하기</S.Title>

        <S.Description>
          화장하지 않은 얼굴을 촬영하거나 사진을 올려 주세요
        </S.Description>
      </S.TextArea>

      <S.UploadButton type="button" onClick={handleOpenImagePicker}>
        <S.PlusIcon src="/assets/Plus.svg" alt="" />

        <S.UploadText>사진 추가</S.UploadText>
      </S.UploadButton>

      <S.HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChangeImage}
      />
    </S.Container>
  );
}
