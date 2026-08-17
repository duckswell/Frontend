import AnalysisLoading from "./AnalysisLoading";

import * as S from "../../styles/FocusCare/ImageAnalysisModal.styles";

interface ImageAnalysisModalProps {
  variant?: "focus" | "daily";
  isComplete: boolean;
  onComplete: () => void;
}

export default function ImageAnalysisModal({
  variant = "focus",
  isComplete,
  onComplete,
}: ImageAnalysisModalProps) {
  return (
    <S.Overlay>
      <S.Modal>
        <AnalysisLoading
          variant={variant}
          type="image"
          isComplete={isComplete}
          onComplete={onComplete}
        />
      </S.Modal>
    </S.Overlay>
  );
}
