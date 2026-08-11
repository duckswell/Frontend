import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import CareInputForm from "../components/FocusCare/CareInputForm";
import FocusProgress from "../components/FocusCare/FocusProgress";

import { colorPalette } from "../lib/colorPalette";
import * as S from "../styles/DailyCare/FirstDaliyCare.styles";

export default function FirstDaliyCare() {
  const navigate = useNavigate();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    "열감",
    "따가움",
    "건조함",
  ]);

  const [skinImages, setSkinImages] = useState<File[]>([]);

  const [additionalSymptom, setAdditionalSymptom] = useState("");

  const isNextEnabled = selectedConditions.length > 0;

  const handleToggleCondition = (condition: string) => {
    setSelectedConditions((previousConditions) => {
      if (previousConditions.includes(condition)) {
        return previousConditions.filter(
          (selectedCondition) => selectedCondition !== condition
        );
      }

      return [...previousConditions, condition];
    });
  };

  const handleChangeImages = (files: File[]) => {
    setSkinImages(files);
  };

  const handleChangeAdditionalSymptom = (value: string) => {
    setAdditionalSymptom(value);
  };

  const handleMoveToNext = () => {
    if (!isNextEnabled) {
      return;
    }

    console.log({
      selectedConditions,
      skinImages,
      additionalSymptom,
    });

    navigate("/care/second_daily_care");
  };

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Main>
        <FocusProgress currentStep={1} variant="daily" />

        <S.Content>
          <CareInputForm
            variant="daily"
            selectedConditions={selectedConditions}
            onToggleCondition={handleToggleCondition}
            skinImages={skinImages}
            onChangeImages={handleChangeImages}
            additionalSymptom={additionalSymptom}
            onChangeAdditionalSymptom={handleChangeAdditionalSymptom}
          />
        </S.Content>
      </S.Main>

      <S.BottomArea>
        <CareButton
          disabled={!isNextEnabled}
          backgroundColor={
            isNextEnabled ? colorPalette.DailyPrimary : colorPalette.White
          }
          textColor={isNextEnabled ? colorPalette.White : colorPalette.Tertiary}
          onClick={handleMoveToNext}
        >
          다음으로
        </CareButton>
      </S.BottomArea>
    </S.Page>
  );
}
