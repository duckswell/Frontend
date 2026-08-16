import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { courseApi, type RoutineTypeCode } from "../api/course";
import { diagnosisApi, SYMPTOM_CODE_MAP } from "../api/diagnosis";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import CareInputForm from "../components/FocusCare/CareInputForm";
import FocusProgress from "../components/FocusCare/FocusProgress";

import * as S from "../styles/DailyCare/FirstDaliyCare.styles";

interface FirstDailyCareLocationState {
  courseId?: number;
  routineTypeCode?: RoutineTypeCode;
}

export default function FirstDaliyCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FirstDailyCareLocationState | null;

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const [skinImages, setSkinImages] = useState<File[]>([]);

  const [additionalSymptom, setAdditionalSymptom] = useState("");

  const [photoId, setPhotoId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * 데일리는 사진이 선택사항이므로
   * 증상 하나 이상만 선택하면 다음으로 이동 가능
   */
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

  async function getDailyCourseId(): Promise<number | null> {
    /*
     * DailyCare에서 courseId를 전달받았다면
     * 추가 API 호출 없이 사용
     */
    if (state?.courseId !== undefined) {
      return state.courseId;
    }

    /*
     * 새로고침 / 직접 접근 등으로 state가 없으면
     * 현재 진행 코스를 다시 조회
     */
    try {
      const currentCourse = await courseApi.getCurrentCourse();

      if (!currentCourse) {
        console.error("현재 진행 중인 코스가 없습니다.");

        return null;
      }

      if (currentCourse.courseType !== "DAILY") {
        console.error("현재 진행 중인 코스가 DAILY가 아닙니다:", currentCourse);

        return null;
      }

      return currentCourse.courseId;
    } catch (error) {
      console.error("현재 데일리 코스 조회 실패:", error);

      return null;
    }
  }

  const handleMoveToNext = async () => {
    if (!isNextEnabled || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const courseId = await getDailyCourseId();

      if (courseId === null) {
        console.error("진단에 사용할 DAILY courseId가 없습니다.");

        return;
      }

      const symptoms = selectedConditions.map(
        (condition) => SYMPTOM_CODE_MAP[condition]
      );

      const requestData = {
        courseId,
        symptoms,
        symptomNote: additionalSymptom.trim() || undefined,
        photoId: photoId ?? undefined,
      };

      console.log("===== 데일리 진단 요청 =====");
      console.log("courseId:", courseId);
      console.log("선택 증상:", selectedConditions);
      console.log("변환된 symptoms:", symptoms);
      console.log("photoId:", photoId);
      console.log("진단 요청 body:", requestData);

      const diagnosis = await diagnosisApi.createDiagnosis(requestData);

      console.log("데일리 코스 진단 성공:", diagnosis);

      navigate("/care/second_daily_care", {
        state: {
          diagnosis,
          selectedConditions,
          routineTypeCode: state?.routineTypeCode,
        },
      });
    } catch (error) {
      console.error("데일리 코스 진단 실패:", error);

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
