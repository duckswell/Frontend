import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { courseApi, type RoutineTypeCode } from "../api/course";
import {
  diagnosisApi,
  SYMPTOM_CODE_MAP,
  type DiagnosisResponse,
} from "../api/diagnosis";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import CareInputForm from "../components/FocusCare/CareInputForm";
import FocusProgress from "../components/FocusCare/FocusProgress";
import ImageAnalysisModal from "../components/FocusCare/ImageAnalysisModal";

import * as S from "../styles/DailyCare/FirstDaliyCare.styles";

interface FirstDailyCareLocationState {
  courseId?: number;
  routineTypeCode?: RoutineTypeCode;
}

type DiagnosisRequest = Parameters<typeof diagnosisApi.createDiagnosis>[0];

const NO_CONDITION = "해당없음";

export default function FirstDaliyCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FirstDailyCareLocationState | null;

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [skinImages, setSkinImages] = useState<File[]>([]);
  const [additionalSymptom, setAdditionalSymptom] = useState("");
  const [photoId, setPhotoId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isDiagnosisComplete, setIsDiagnosisComplete] = useState(false);

  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);

  const isNextEnabled = selectedConditions.length > 0;

  const handleToggleCondition = (condition: string) => {
    setSelectedConditions((previousConditions) => {
      if (condition === NO_CONDITION) {
        if (previousConditions.includes(NO_CONDITION)) {
          return [];
        }

        return [NO_CONDITION];
      }

      const conditionsWithoutNone = previousConditions.filter(
        (selectedCondition) => selectedCondition !== NO_CONDITION
      );

      if (conditionsWithoutNone.includes(condition)) {
        return conditionsWithoutNone.filter(
          (selectedCondition) => selectedCondition !== condition
        );
      }

      return [...conditionsWithoutNone, condition];
    });
  };

  const handleChangeImages = (files: File[]) => {
    setSkinImages(files);
  };

  const handleChangeAdditionalSymptom = (value: string) => {
    setAdditionalSymptom(value);
  };

  async function getDailyCourseId(): Promise<number | null> {
    if (state?.courseId !== undefined) {
      return state.courseId;
    }

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

    setIsSubmitting(true);
    setDiagnosis(null);
    setIsDiagnosisComplete(false);
    setIsDiagnosisModalOpen(true);

    try {
      const courseId = await getDailyCourseId();

      if (courseId === null) {
        console.error("진단에 사용할 DAILY courseId가 없습니다.");

        setIsDiagnosisModalOpen(false);
        setIsSubmitting(false);

        return;
      }

      const symptoms = selectedConditions
        .map((condition) => SYMPTOM_CODE_MAP[condition])
        .filter(
          (symptom): symptom is NonNullable<typeof symptom> =>
            symptom !== undefined
        );

      const diagnosisRequest: DiagnosisRequest = {
        courseId,
        symptoms,
        symptomNote: additionalSymptom.trim() || undefined,

        photoId: photoId ?? undefined,
      };

      console.log("===== 데일리 AI 진단 시작 =====");
      console.log("선택 UI:", selectedConditions);
      console.log("API symptoms:", symptoms);
      console.log("진단 요청:", diagnosisRequest);

      const response = await diagnosisApi.createDiagnosis(diagnosisRequest);

      console.log("===== 데일리 AI 진단 완료 =====");
      console.log("진단 결과:", response);

      setDiagnosis(response);
      setIsDiagnosisComplete(true);
    } catch (error) {
      console.error("데일리 코스 AI 진단 실패:", error);

      setDiagnosis(null);
      setIsDiagnosisComplete(false);
      setIsDiagnosisModalOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDiagnosisAnalysisComplete = () => {
    if (!diagnosis) {
      return;
    }

    setIsDiagnosisModalOpen(false);

    navigate("/care/second_daily_care", {
      state: {
        diagnosis,
        selectedConditions,
        routineTypeCode: state?.routineTypeCode,
        skinImage: skinImages[0],
      },
    });

    setIsSubmitting(false);
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

      {isDiagnosisModalOpen && (
        <ImageAnalysisModal
          variant="daily"
          isComplete={isDiagnosisComplete}
          onComplete={handleDiagnosisAnalysisComplete}
        />
      )}
    </S.Page>
  );
}
