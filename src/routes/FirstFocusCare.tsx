import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { courseApi } from "../api/course";
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

import * as S from "../styles/FocusCare/FirstFocusCare.styles";

interface FirstFocusCareLocationState {
  courseId?: number;
}

type DiagnosisRequest = Parameters<typeof diagnosisApi.createDiagnosis>[0];

const NO_CONDITION = "해당없음";

export default function FirstFocusCare() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FirstFocusCareLocationState | null;

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [skinImages, setSkinImages] = useState<File[]>([]);
  const [additionalSymptom, setAdditionalSymptom] = useState("");
  const [photoId, setPhotoId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * 진단 진행 모달
   */
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

  /*
   * 실제 /api/diagnoses 요청이 끝났는지 여부
   * true가 되는 순간 AnalysisLoading이 100%로 마무리된다.
   */
  const [isDiagnosisComplete, setIsDiagnosisComplete] = useState(false);

  /*
   * First에서 받은 실제 AI 분석 결과
   */
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);

  /*
   * Focus
   *
   * 피부 상태 최소 1개 필수
   * 사진 필수
   * photoId 필수
   */
  const isNextEnabled =
    selectedConditions.length > 0 && skinImages.length > 0 && photoId !== null;

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

  const getFocusCourseId = async (): Promise<number | null> => {
    if (state?.courseId !== undefined) {
      return state.courseId;
    }

    try {
      const currentCourse = await courseApi.getCurrentCourse();

      if (!currentCourse) {
        console.error("현재 진행 중인 코스가 없습니다.");

        return null;
      }

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

    /*
     * 버튼을 누르자마자 모달부터 표시
     */
    setIsSubmitting(true);
    setDiagnosis(null);
    setIsDiagnosisComplete(false);
    setIsDiagnosisModalOpen(true);

    try {
      const courseId = await getFocusCourseId();

      if (courseId === null) {
        console.error("진단에 사용할 집중 코스 courseId가 없습니다.");

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
        photoId,
      };

      console.log("===== 집중 AI 진단 시작 =====");
      console.log("선택 UI:", selectedConditions);
      console.log("API symptoms:", symptoms);
      console.log("진단 요청:", diagnosisRequest);

      /*
       * 실제 AI 분석 API
       *
       * 이 요청이 진행되는 동안 모달의 퍼센트가 진행된다.
       */
      const response = await diagnosisApi.createDiagnosis(diagnosisRequest);

      console.log("===== 집중 AI 진단 완료 =====");
      console.log("진단 결과:", response);

      /*
       * 결과 먼저 저장
       */
      setDiagnosis(response);

      /*
       * 실제 API가 끝났다는 신호
       *
       * AnalysisLoading이 이 값을 감지하고
       * 진행률을 100%까지 마무리한다.
       */
      setIsDiagnosisComplete(true);
    } catch (error) {
      console.error("집중 코스 AI 진단 실패:", error);

      /*
       * 요청 실패 시 모달 종료
       */
      setDiagnosis(null);
      setIsDiagnosisComplete(false);
      setIsDiagnosisModalOpen(false);
      setIsSubmitting(false);
    }
  };

  /*
   * API가 끝났다고 즉시 페이지를 이동하지 않는다.
   *
   * AnalysisLoading이 실제로 100%까지 표시한 뒤
   * onComplete가 실행되면 SecondFocusCare로 이동한다.
   */
  const handleDiagnosisAnalysisComplete = () => {
    if (!diagnosis) {
      return;
    }

    setIsDiagnosisModalOpen(false);

    navigate("/care/second_focus_care", {
      state: {
        diagnosis,
        selectedConditions,
        skinImage: skinImages[0],
      },
    });

    setIsSubmitting(false);
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

      {isDiagnosisModalOpen && (
        <ImageAnalysisModal
          variant="focus"
          isComplete={isDiagnosisComplete}
          onComplete={handleDiagnosisAnalysisComplete}
        />
      )}
    </S.Page>
  );
}
