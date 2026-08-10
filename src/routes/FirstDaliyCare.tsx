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
  const [skinImage, setSkinImage] = useState<File | null>(null);
  const [additionalSymptom, setAdditionalSymptom] = useState("");

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

  const handleChangeImage = (file: File | null) => {
    setSkinImage(file);
  };

  const handleChangeAdditionalSymptom = (value: string) => {
    setAdditionalSymptom(value);
  };

  const handleMoveToNext = () => {
    console.log({
      selectedConditions,
      skinImage,
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
            onChangeImage={handleChangeImage}
            additionalSymptom={additionalSymptom}
            onChangeAdditionalSymptom={handleChangeAdditionalSymptom}
          />
        </S.Content>
      </S.Main>

      <S.BottomArea>
        <CareButton
          backgroundColor={colorPalette.DailyPrimary}
          onClick={handleMoveToNext}
        >
          다음으로
        </CareButton>
      </S.BottomArea>
    </S.Page>
  );
}
