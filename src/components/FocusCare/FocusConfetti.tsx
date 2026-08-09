import { useState } from "react";
import { useLottie } from "lottie-react";

import confettiAnimation from "../../assets/confetti.json";

import * as S from "../../styles/FocusCare/FocusConfetti.styles";

export default function FocusConfetti() {
  const [isLeftConfettiVisible, setIsLeftConfettiVisible] = useState(true);
  const [isRightConfettiVisible, setIsRightConfettiVisible] = useState(true);

  const leftConfettiOptions = {
    animationData: confettiAnimation,
    loop: false,
    autoplay: true,
    onComplete: () => {
      setIsLeftConfettiVisible(false);
    },
  };

  const rightConfettiOptions = {
    animationData: confettiAnimation,
    loop: false,
    autoplay: true,
    onComplete: () => {
      setIsRightConfettiVisible(false);
    },
  };

  const { View: leftConfetti } = useLottie(leftConfettiOptions);
  const { View: rightConfetti } = useLottie(rightConfettiOptions);

  return (
    <>
      {isLeftConfettiVisible && (
        <S.LeftConfetti aria-hidden="true">
          {leftConfetti}
        </S.LeftConfetti>
      )}

      {isRightConfettiVisible && (
        <S.RightConfetti aria-hidden="true">
          {rightConfetti}
        </S.RightConfetti>
      )}
    </>
  );
}