import { useEffect, useRef, useState } from "react";

import AnalysisLoading from "./AnalysisLoading";
import ImageUploadErrorModal from "./ImageUploadErrorModal";
import { diagnosisApi } from "../../api/diagnosis";
import * as S from "../../styles/FocusCare/CareInputForm.styles";
import * as ModalS from "../../styles/FocusCare/ImageAnalysisModal.styles";

const SKIN_CONDITION_ROWS = [
  ["붉은기", "열감", "따가움", "건조함"],
  ["각질", "번들거림", "가려움", "붓기"],
];

interface CareInputFormProps {
  variant?: "focus" | "daily";

  selectedConditions: string[];
  onToggleCondition: (condition: string) => void;

  skinImages: File[];
  onChangeImages: (files: File[]) => void;
  onChangePhotoId: (photoId: string | null) => void;
  additionalSymptom: string;
  onChangeAdditionalSymptom: (value: string) => void;
}

export default function CareInputForm({
  variant = "focus",
  selectedConditions,
  onToggleCondition,
  skinImages,
  onChangeImages,
  additionalSymptom,
  onChangeAdditionalSymptom,
  onChangePhotoId,
}: CareInputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadToastRef = useRef<HTMLDivElement>(null);

  const pendingImagesRef = useRef<File[]>([]);

  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isUploadErrorOpen, setIsUploadErrorOpen] = useState(false);
  const [isUploadToastVisible, setIsUploadToastVisible] = useState(false);

  const isDaily = variant === "daily";
  const hasImages = skinImages.length > 0;

  useEffect(() => {
    if (!isUploadToastVisible) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      uploadToastRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isUploadToastVisible]);

  const handleOpenImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleChangeImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    const selectedFile = selectedFiles[0];

    pendingImagesRef.current = [selectedFile];

    try {
      setIsAnalyzingImage(true);

      const result = await diagnosisApi.checkPhoto(selectedFile);

      onChangeImages([...skinImages, selectedFile]);
      onChangePhotoId(result.photoId);

      pendingImagesRef.current = [];

      setIsUploadToastVisible(true);

      window.setTimeout(() => {
        setIsUploadToastVisible(false);
      }, 2000);
    } catch (error) {
      console.error("사진 품질 확인 실패:", error);

      pendingImagesRef.current = [];
      onChangePhotoId(null);
      setIsUploadErrorOpen(true);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleCancelReupload = () => {
    pendingImagesRef.current = [];
    setIsUploadErrorOpen(false);
  };

  const handleReupload = () => {
    pendingImagesRef.current = [];
    setIsUploadErrorOpen(false);

    window.setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const nextImages = skinImages.filter((_, index) => index !== indexToRemove);

    onChangeImages(nextImages);

    if (nextImages.length === 0) {
      onChangePhotoId(null);
    }
  };
  return (
    <>
      <S.Section>
        <S.TextArea>
          <S.Title>오늘 피부 상태는 어떤가요?</S.Title>

          <S.Description>
            선택한 상태를 바탕으로 오늘의 맞춤 관리 루틴을 안내해 드려요
          </S.Description>
        </S.TextArea>

        <S.ConditionList>
          {SKIN_CONDITION_ROWS.map((row, rowIndex) => (
            <S.ConditionRow key={rowIndex}>
              {row.map((condition) => {
                const isSelected = selectedConditions.includes(condition);

                return (
                  <S.ConditionButton
                    key={condition}
                    type="button"
                    $selected={isSelected}
                    onClick={() => onToggleCondition(condition)}
                  >
                    {condition}
                  </S.ConditionButton>
                );
              })}
            </S.ConditionRow>
          ))}
        </S.ConditionList>
      </S.Section>

      <S.Section>
        <S.TextArea>
          <S.Title>
            사진으로 피부 상태 확인하기
            {isDaily && (
              <>
                {" "}
                <S.OptionalText $variant={variant}>(선택)</S.OptionalText>
              </>
            )}
          </S.Title>

          <S.Description>
            화장하지 않은 얼굴을 촬영하거나 사진을 올려 주세요
          </S.Description>
        </S.TextArea>

        {hasImages && (
          <S.ImagePreviewList>
            {skinImages.map((file, index) => {
              const imageUrl = URL.createObjectURL(file);

              return (
                <S.ImagePreviewItem
                  key={`${file.name}-${file.lastModified}-${index}`}
                >
                  <S.PreviewImage
                    src={imageUrl}
                    alt={`피부 사진 ${index + 1}`}
                    onLoad={() => URL.revokeObjectURL(imageUrl)}
                  />

                  <S.RemoveImageButton
                    type="button"
                    aria-label={`${index + 1}번째 사진 삭제`}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <img src="/assets/X.svg" alt="" aria-hidden="true" />
                  </S.RemoveImageButton>
                </S.ImagePreviewItem>
              );
            })}
          </S.ImagePreviewList>
        )}

        <S.UploadButton type="button" onClick={handleOpenImagePicker}>
          <S.PlusIcon src="/assets/Plus.svg" alt="" aria-hidden="true" />

          <S.UploadText>사진 추가</S.UploadText>
        </S.UploadButton>

        <S.HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
        />
      </S.Section>

      <S.Section>
        <S.TextArea>
          <S.Title>
            {isDaily
              ? "선택한 항목 외에 다른 피부 고민이 있나요?"
              : "선택한 항목 외에 다른 증상이 있나요?"}{" "}
            <S.OptionalText $variant={variant}>(선택)</S.OptionalText>
          </S.Title>

          <S.Description>
            {isDaily
              ? "고민을 입력하면 더 자세한 추천을 받을 수 있어요"
              : "불편한 증상을 적어주시면 루틴 추천에 함께 반영할게요"}
          </S.Description>
        </S.TextArea>

        <S.SymptomTextarea
          value={additionalSymptom}
          placeholder={
            isDaily
              ? "예) 트러블 흔적이 신경 쓰여요"
              : "예) 만지면 통증이 있어요"
          }
          onChange={(event) => onChangeAdditionalSymptom(event.target.value)}
        />

        <S.Notice>
          {isDaily
            ? "* 입력한 정보는 피부 상태 분석에만 사용되며 의료 진단을 대신하지 않아요"
            : "* 입력한 정보는 루틴 추천에만 사용되며 의료 진단을 대신하지 않아요"}
        </S.Notice>

        {isUploadToastVisible && (
          <S.UploadToast ref={uploadToastRef}>
            <S.CheckIcon
              src="/assets/CheckIcon.svg"
              alt=""
              aria-hidden="true"
            />

            <S.UploadCompleteText>사진을 등록했어요</S.UploadCompleteText>
          </S.UploadToast>
        )}
      </S.Section>

      {isAnalyzingImage && (
        <ModalS.Overlay>
          <ModalS.Modal>
            <AnalysisLoading
              variant={variant}
              type="image"
              onComplete={() => {}}
            />
          </ModalS.Modal>
        </ModalS.Overlay>
      )}

      {isUploadErrorOpen && (
        <ImageUploadErrorModal
          onCancel={handleCancelReupload}
          onReupload={handleReupload}
        />
      )}
    </>
  );
}
