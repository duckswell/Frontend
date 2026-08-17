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
   * Focus
   *
   * 피부 상태 최소 1개 필수
   * 사진 필수
   * photoId 필수
   *
   * 해당없음도 정상적인 증상 선택 1개로 취급
   */
  const isNextEnabled =
    selectedConditions.length > 0 && skinImages.length > 0 && photoId !== null;

  const handleToggleCondition = (condition: string) => {
    setSelectedConditions((previousConditions) => {
      /*
       * 해당없음 선택
       *
       * 다른 증상과 동시에 선택될 수 없음
       */
      if (condition === NO_CONDITION) {
        if (previousConditions.includes(NO_CONDITION)) {
          return [];
        }

        return [NO_CONDITION];
      }

      /*
       * 일반 증상을 선택하면
       * 해당없음은 자동 해제
       */
      const conditionsWithoutNone = previousConditions.filter(
        (selectedCondition) => selectedCondition !== NO_CONDITION
      );

      /*
       * 이미 선택된 증상이면 해제
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

    try {
      setIsSubmitting(true);

      const courseId = await getFocusCourseId();

      if (courseId === null) {
        console.error("진단에 사용할 집중 코스 courseId가 없습니다.");

        return;
      }

      /*
       * 해당없음도
       * SYMPTOM_CODE_MAP을 통해 NONE으로 변환한다.
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
        photoId,
      };

      console.log("===== 집중 진단 요청 준비 =====");
      console.log("선택 UI:", selectedConditions);
      console.log("API symptoms:", symptoms);
      console.log("진단 요청:", diagnosisRequest);

      navigate("/care/second_focus_care", {
        state: {
          diagnosisRequest,
          selectedConditions,
          skinImage: skinImages[0],
        },
      });
    } catch (error) {
      console.error("SecondFocusCare 이동 준비 실패:", error);
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
