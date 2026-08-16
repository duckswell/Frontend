import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { courseApi } from "../api/course";
import { diagnosisApi, SYMPTOM_CODE_MAP } from "../api/diagnosis";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import CareInputForm from "../components/FocusCare/CareInputForm";
import FocusProgress from "../components/FocusCare/FocusProgress";

import * as S from "../styles/FocusCare/FirstFocusCare.styles";

interface FirstFocusCareLocationState {
  courseId?: number;
}

export default function FirstFocusCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FirstFocusCareLocationState | null;

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

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

  const getFocusCourseId = async (): Promise<number | null> => {
    /*
     * Care에서 courseId를 전달했다면
     * 추가 API 호출 없이 사용
     */
    if (state?.courseId !== undefined) {
      return state.courseId;
    }

    /*
     * 새로고침 / URL 직접 접근 시에만
     * 현재 코스 재조회
     */
    try {
      const currentCourse = await courseApi.getCurrentCourse();

      /*
       * 진행 중인 코스 자체가 없는 경우
       */
      if (!currentCourse) {
        console.error("현재 진행 중인 코스가 없습니다.");
        return null;
      }

      /*
       * 현재 코스가 FOCUS인지 확인
       */
      if (currentCourse.courseType !== "FOCUS") {
        console.error(
          "현재 진행 중인 코스가 집중 코스가 아닙니다:",
          currentCourse
        );

        return null;
      }

      return currentCourse.courseId;
    } catch (error) {
      console.error("현재 집중 코스 조회 실패:", error);

      return null;
    }
  };

  const handleMoveToNext = async () => {
    if (!isNextEnabled || !photoId || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const courseId = await getFocusCourseId();

      if (courseId === null) {
        console.error("진단에 사용할 집중 코스 courseId가 없습니다.");
        return;
      }

      const symptoms = selectedConditions
        .map((condition) => SYMPTOM_CODE_MAP[condition])
        .filter(
          (symptom): symptom is NonNullable<typeof symptom> =>
            symptom !== undefined
        );

      const requestData = {
        courseId,
        symptoms,
        symptomNote: additionalSymptom.trim() || undefined,
        photoId,
      };

      console.log("===== 진단 요청 =====");
      console.log("courseId:", courseId);
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
