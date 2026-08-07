import { useState } from "react";
import { NavBar } from "../components/NavBar";
import AdditionalSymptomInput from "../components/Care/AdditionalSymptomInput";
import FocusProgress from "../components/Care/FocusProgress";
import SkinConditionSelector from "../components/Care/SkinConditionSelector";
import SkinPhotoUploader from "../components/Care/SkinPhotoUploader";
import * as S from "../styles/FirstFocusCare.styles";

export default function FirstFocusCare() {
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

    // TODO: AI 분석 페이지 연결 후 navigate 추가
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
        <S.NextButton type="button" onClick={handleMoveToNext}>
          다음으로
        </S.NextButton>
      </S.BottomArea>
    </S.Page>
  );
}
