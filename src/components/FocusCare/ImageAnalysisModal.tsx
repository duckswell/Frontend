import AnalysisLoading from "./AnalysisLoading";

import * as S from "../../styles/FocusCare/ImageAnalysisModal.styles";

interface ImageAnalysisModalProps {
  variant?: "focus" | "daily";
  onComplete: () => void;
}

export default function ImageAnalysisModal({
  variant = "focus",
  onComplete,
}: ImageAnalysisModalProps) {
  return (
    <S.Overlay>
      <S.Modal>
        <AnalysisLoading
          variant={variant}
          type="image"
          onComplete={onComplete}
        />
      </S.Modal>
    </S.Overlay>
  );
}
