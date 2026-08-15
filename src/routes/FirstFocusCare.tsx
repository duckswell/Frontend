import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { courseApi } from "../api/course";
import { diagnosisApi, SYMPTOM_CODE_MAP } from "../api/diagnosis";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import CareInputForm from "../components/FocusCare/CareInputForm";
import FocusProgress from "../components/FocusCare/FocusProgress";

import * as S from "../styles/FocusCare/FirstFocusCare.styles";

export default function FirstFocusCare() {
  const navigate = useNavigate();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    "따가움",
  ]);

  const [skinImages, setSkinImages] = useState<File[]>([]);
  const [additionalSymptom, setAdditionalSymptom] = useState("");
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNextEnabled =
    selectedConditions.length > 0 && skinImages.length > 0 && photoId !== null;

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
    if (!isNextEnabled || !photoId || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const currentCourse = await courseApi.getCurrentCourse();

      const symptoms = selectedConditions.map(
        (condition) => SYMPTOM_CODE_MAP[condition]
      );

      const requestData = {
        courseId: currentCourse.courseId,
        symptoms,
        symptomNote: additionalSymptom || undefined,
        photoId,
      };

      console.log("===== 진단 요청 =====");
      console.log("현재 courseId:", currentCourse.courseId);
      console.log("현재 courseType:", currentCourse.courseType);
      console.log("선택 증상:", selectedConditions);
      console.log("변환된 symptoms:", symptoms);
      console.log("photoId:", photoId);
      console.log("진단 요청 body:", requestData);

      const diagnosis = await diagnosisApi.createDiagnosis(requestData);

      console.log("집중 코스 진단 성공:", diagnosis);

      navigate("/care/second_focus_care", {
        state: {
          diagnosis,
          selectedConditions,
          skinImage: skinImages[0],
        },
      });
    } catch (error) {
      console.error("집중 코스 진단 실패:", error);

      if (axios.isAxiosError(error)) {
        console.error("HTTP Status:", error.response?.status);
        console.error("API Error Response:", error.response?.data);
        console.error("요청 URL:", error.config?.url);
        console.error("보낸 요청 데이터:", error.config?.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.Page>
      <NavBar title="집중 코스" />

      <S.Main>
        <FocusProgress currentStep={1} />

        <S.Content>
          <CareInputForm
            variant="focus"
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
          variant="focus"
          disabled={!isNextEnabled || isSubmitting}
          onClick={handleMoveToNext}
        >
          다음으로
        </CareButton>
      </S.BottomArea>
    </S.Page>
  );
}
