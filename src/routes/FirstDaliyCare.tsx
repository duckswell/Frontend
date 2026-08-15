import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseApi } from "../api/course";
import { diagnosisApi, SYMPTOM_CODE_MAP } from "../api/diagnosis";
import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import CareInputForm from "../components/FocusCare/CareInputForm";
import FocusProgress from "../components/FocusCare/FocusProgress";

import * as S from "../styles/DailyCare/FirstDaliyCare.styles";

export default function FirstDaliyCare() {
  const navigate = useNavigate();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const [skinImages, setSkinImages] = useState<File[]>([]);

  const [additionalSymptom, setAdditionalSymptom] = useState("");
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleMoveToNext = async () => {
    if (!isNextEnabled || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const currentCourse = await courseApi.getCurrentCourse();

      const symptoms = selectedConditions.map(
        (condition) => SYMPTOM_CODE_MAP[condition]
      );

      const diagnosis = await diagnosisApi.createDiagnosis({
        courseId: currentCourse.courseId,
        symptoms,
        symptomNote: additionalSymptom || undefined,
        photoId: photoId ?? undefined,
      });

      console.log("데일리 코스 진단 성공:", diagnosis);

      navigate("/care/second_daily_care", {
        state: {
          diagnosis,
        },
      });
    } catch (error) {
      console.error("데일리 코스 진단 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            onChangePhotoId={setPhotoId}
          />
        </S.Content>
      </S.Main>

      <S.BottomArea>
        <CareButton
          variant="daily"
          disabled={!isNextEnabled || isSubmitting}
          onClick={handleMoveToNext}
        >
          다음으로
        </CareButton>
      </S.BottomArea>
    </S.Page>
  );
}
