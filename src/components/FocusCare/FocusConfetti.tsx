import { useRef, useState } from "react";
import { useLottie } from "lottie-react";

import confettiAnimation from "../../assets/confetti.json";

import * as S from "../../styles/FocusCare/FocusConfetti.styles";

interface FocusConfettiProps {
  onComplete?: () => void;
}

export default function FocusConfetti({ onComplete }: FocusConfettiProps) {
  const [isLeftConfettiVisible, setIsLeftConfettiVisible] = useState(true);
  const [isRightConfettiVisible, setIsRightConfettiVisible] = useState(true);

  const completedCountRef = useRef(0);
  const hasCalledCompleteRef = useRef(false);

  function handleConfettiComplete() {
    completedCountRef.current += 1;

    if (completedCountRef.current >= 2 && !hasCalledCompleteRef.current) {
      hasCalledCompleteRef.current = true;

      onComplete?.();
    }
  }

  const leftConfettiOptions = {
    animationData: confettiAnimation,
    loop: false,
    autoplay: true,
    onComplete: () => {
      setIsLeftConfettiVisible(false);
      handleConfettiComplete();
    },
  };

  const rightConfettiOptions = {
    animationData: confettiAnimation,
    loop: false,
    autoplay: true,
    onComplete: () => {
      setIsRightConfettiVisible(false);
      handleConfettiComplete();
    },
  };

  const { View: leftConfetti } = useLottie(leftConfettiOptions);
  const { View: rightConfetti } = useLottie(rightConfettiOptions);

  return (
    <>
      {isLeftConfettiVisible && (
        <S.LeftConfetti aria-hidden="true">{leftConfetti}</S.LeftConfetti>
      )}

      {isRightConfettiVisible && (
        <S.RightConfetti aria-hidden="true">{rightConfetti}</S.RightConfetti>
      )}
    </>
  );
}
