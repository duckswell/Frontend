import * as S from "../../styles/FocusCare/FocusProgress.styles";

interface FocusProgressProps {
  currentStep: 1 | 2 | 3;
}

export default function FocusProgress({ currentStep }: FocusProgressProps) {
  return (
    <S.Container aria-label={`집중 코스 ${currentStep}단계`}>
      {[1, 2, 3].map((step) => (
        <S.ProgressBar
          key={step}
          $completed={step < currentStep}
          $current={step === currentStep}
        />
      ))}
    </S.Container>
  );
}
