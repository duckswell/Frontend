import { useCallback, useState } from "react";
import { NavBar } from "../components/NavBar";
import AnalysisLoading from "../components/FocusCare/AnalysisLoading";
import AnalysisResultCard from "../components/FocusCare/AnalysisResultCard";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineBottomSheet from "../components/FocusCare/RoutineBottomSheet";
import * as S from "../styles/FocusCare/SecondFocusCare.styles";

export default function SecondFocusCare() {
  const [isRoutineSheetVisible, setIsRoutineSheetVisible] =
    useState(false);

  const handleAnalysisComplete = useCallback(() => {
    setIsRoutineSheetVisible(true);
  }, []);

  return (
    <S.Page>
      <NavBar title="집중 코스" />

      <S.Main>
        <FocusProgress currentStep={2} />

        <S.Content>
          <AnalysisResultCard />

          <AnalysisLoading
            onComplete={handleAnalysisComplete}
          />
        </S.Content>
      </S.Main>

      {isRoutineSheetVisible && <RoutineBottomSheet />}
    </S.Page>
  );
}