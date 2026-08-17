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

  /*
   * Daily
   *
   * 피부 상태 최소 1개 필수.
   * 사진은 선택사항.
   *
   * 해당없음도 정상적인 선택 1개.
   */
  const isNextEnabled = selectedConditions.length > 0;

  const handleToggleCondition = (condition: string) => {
    setSelectedConditions((previousConditions) => {
      /*
       * 해당없음 선택
       */
      if (condition === NO_CONDITION) {
        if (previousConditions.includes(NO_CONDITION)) {
          return [];
        }

        return [NO_CONDITION];
      }

      /*
       * 일반 증상을 선택하면
       * 해당없음 자동 해제
       */
      const conditionsWithoutNone = previousConditions.filter(
        (selectedCondition) => selectedCondition !== NO_CONDITION
      );

      /*
       * 이미 선택한 일반 증상 해제
       */
      if (conditionsWithoutNone.includes(condition)) {
        return conditionsWithoutNone.filter(
          (selectedCondition) => selectedCondition !== condition
        );
      }

      /*
       * 새 증상 추가
       */
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

    try {
      setIsSubmitting(true);

      const courseId = await getDailyCourseId();

      if (courseId === null) {
        console.error("진단에 사용할 DAILY courseId가 없습니다.");

        return;
      }

      /*
       * 해당없음 역시 NONE으로 변환.
       *
       * 절대 제거하지 않는다.
       */
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

      console.log("===== 데일리 진단 요청 준비 =====");
      console.log("선택 UI:", selectedConditions);
      console.log("API symptoms:", symptoms);
      console.log("진단 요청:", diagnosisRequest);

      navigate("/care/second_daily_care", {
        state: {
          diagnosisRequest,
          selectedConditions,
          routineTypeCode: state?.routineTypeCode,
        },
      });
    } catch (error) {
      console.error("SecondDailyCare 이동 준비 실패:", error);
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
