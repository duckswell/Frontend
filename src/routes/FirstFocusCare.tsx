import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import AdditionalSymptomInput from "../components/FocusCare/AdditionalSymptomInput";
import FocusProgress from "../components/FocusCare/FocusProgress";
import SkinConditionSelector from "../components/FocusCare/SkinConditionSelector";
import SkinPhotoUploader from "../components/FocusCare/SkinPhotoUploader";
import * as S from "../styles/FocusCare/FirstFocusCare.styles";

export default function FirstFocusCare() {
  const navigate = useNavigate();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    "따가움",
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

    navigate("/care/second_focus_care");
  };
  return (
    <S.Page>
      <NavBar title="집중 코스" />

      <S.Main>
        <FocusProgress currentStep={1} />

        <S.Content>
          <SkinConditionSelector
            selectedConditions={selectedConditions}
            onToggleCondition={handleToggleCondition}
          />

          <SkinPhotoUploader onChangeImage={handleChangeImage} />

          <AdditionalSymptomInput
            value={additionalSymptom}
            onChange={handleChangeAdditionalSymptom}
          />
        </S.Content>
      </S.Main>

      <S.BottomArea>
        <CareButton onClick={handleMoveToNext}>다음으로</CareButton>
      </S.BottomArea>
    </S.Page>
  );
}
