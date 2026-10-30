// [백엔드 연동 주석처리] API 조회용 useEffect를 주석처리하면서 import에서 제외
// import { useEffect, useState } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { TabBar } from "../components/TabBar";
import CareButton from "../components/CareButton";

// [백엔드 연동 주석처리] 아카이빙을 위해 API 대신 목 데이터 사용
// import { api } from "../lib/api";
// import { courseApi } from "../api/course";
import {
  MOCK_FOCUS_COURSE,
  MOCK_RECOVERY_DAY_TEXT,
  MOCK_RECOVERY_SUMMARY,
} from "../mocks/focusCare";

import * as S from "../styles/FocusCare/Care.styles";

/* [백엔드 연동 주석처리] 회복 배너 API 응답 타입
interface RecoveryBannerMetric {
  current: number;
  previous: number;
  delta: number;
}

interface RecoveryBannerResponse {
  redness: RecoveryBannerMetric;
  texture: RecoveryBannerMetric;
  blemish: RecoveryBannerMetric;
  summaryMessage: string;
}
*/

const COURSE_STEPS = [
  {
    step: "STEP 1",
    title: "피부 상태 확인",
    description:
      "민낯 사진을 촬영하고 피부 고민을 기록하면 AI가 오늘의 상태를 분석해요",
  },
  {
    step: "STEP 2",
    title: "관리 강도 선택",
    description: "오늘 내가 원하는 만큼 편하게 관리해요",
  },
  {
    step: "STEP 3",
    title: "맞춤 루틴 진행",
    description: "AI가 피부 상태에 최적화된 맞춤 루틴을 안내해요",
  },
];

export default function Care() {
  const navigate = useNavigate();

  // [백엔드 연동 주석처리] 회복 배너·회복 단계 요약 API 대신 목 데이터로 초기화
  // const [recoveryDayText, setRecoveryDayText] = useState("");
  // const [recoverySummary, setRecoverySummary] = useState("");
  const [recoveryDayText]= useState(MOCK_RECOVERY_DAY_TEXT);
  const [recoverySummary] = useState(MOCK_RECOVERY_SUMMARY);

  const [isStartingRoutine, setIsStartingRoutine] = useState(false);

  /* [백엔드 연동 주석처리] 현재 코스·회복 요약·회복 배너 조회
  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        const course = await courseApi.getCurrentCourse();

        console.log("현재 진행 중인 코스:", course);

        if (!course) {
          setRecoverySummary("");
          return;
        }

        if (course.courseType !== "FOCUS") {
          setRecoverySummary("");
          return;
        }

        try {
          const summary = await courseApi.getRecoverySummary(course.courseId);

          setRecoverySummary(summary.recoveryStageSummaryText);
        } catch (error) {
          console.error("회복 단계 요약 조회 실패:", error);

          setRecoverySummary("");
        }
      } catch (error) {
        console.error("현재 진행 중인 코스 조회 실패:", error);

        setRecoverySummary("");
      }
    };

    fetchCurrentCourse();
  }, []);

  useEffect(() => {
    const fetchRecoveryBanner = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data?: RecoveryBannerResponse;
          errorCode?: string;
          message?: string;
        }>("/api/dashboard/recovery-banner");

        const banner = response.data.data;

        console.log("회복 배너 조회 성공:", banner);

        if (!banner) {
          setRecoveryDayText("");
          return;
        }

        const firstLine = banner.summaryMessage
          .split("\n")[0]
          .replace(",", "")
          .trim();

        setRecoveryDayText(firstLine);
      } catch (error) {
        console.error("회복 배너 조회 실패:", error);

        setRecoveryDayText("");
      }
    };

    fetchRecoveryBanner();
  }, []);
  */

  const handleOpenConsultationGuide = () => {
    navigate("/safety");
  };

  const handleStartRoutine = async () => {
    if (isStartingRoutine) {
      return;
    }

    try {
      setIsStartingRoutine(true);

      // [백엔드 연동 주석처리] 현재 코스 조회 대신 목 집중 코스 사용
      // const latestCourse = await courseApi.getCurrentCourse();
      const latestCourse = MOCK_FOCUS_COURSE;

      console.log("루틴 시작 시 최신 코스:", latestCourse);

      if (latestCourse?.courseType === "FOCUS") {
        console.log("기존 집중 코스로 루틴 시작:", latestCourse.courseId);

        navigate("/care/first_focus_care", {
          state: {
            courseId: latestCourse.courseId,
          },
        });

        return;
      }

      if (latestCourse?.courseType === "DAILY") {
        console.error(
          "현재 데일리 코스가 진행 중입니다. 집중 루틴을 시작할 수 없습니다.",
          latestCourse
        );

        return;
      }

      console.error(
        "진행 중인 집중 코스가 없습니다. 시술 등록 후 집중 코스를 시작해야 합니다."
      );
    } catch (error) {
      console.error("집중 루틴 시작 실패:", error);
    } finally {
      setIsStartingRoutine(false);
    }
  };

  return (
    <S.Page>
      <NavBar title="집중 코스" />

      <S.Content>
        <S.StatusCard>
          <S.CourseBadge>집중 코스 진행 중</S.CourseBadge>

          <S.StatusTitle>
            {recoveryDayText || "시술 후 경과 확인 중"}
          </S.StatusTitle>

          <S.StatusDescription>{recoverySummary}</S.StatusDescription>

          <S.StatusNotice>
            *피부 상태에 따라 회복 속도는 달라질 수 있어요.
          </S.StatusNotice>
        </S.StatusCard>

        <S.CourseSection>
          <S.SectionTitle>코스는 이렇게 진행돼요</S.SectionTitle>

          <S.CourseCard>
            <S.StepList>
              {COURSE_STEPS.map((courseStep) => (
                <S.StepItem key={courseStep.step}>
                  <S.StepBadge>{courseStep.step}</S.StepBadge>

                  <S.StepTitle>{courseStep.title}</S.StepTitle>

                  <S.StepDescription>
                    {courseStep.description}
                  </S.StepDescription>
                </S.StepItem>
              ))}
            </S.StepList>
          </S.CourseCard>
        </S.CourseSection>

        <S.WarningCard>
          <S.WarningTitleRow>
            <S.WarningIcon
              src="/assets/warning_icon.svg"
              alt=""
              aria-hidden="true"
            />

            <S.WarningTitle>잠깐, 이런 증상이 있나요?</S.WarningTitle>
          </S.WarningTitleRow>

          <S.WarningDescription>
            통증이 심하거나 붓기·붉은기가 갑자기 심해졌다면
            <br />
            루틴을 멈추고 시술 받은 병원에 상담 요청을 해 주세요
          </S.WarningDescription>

          <S.ConsultationButton
            type="button"
            onClick={handleOpenConsultationGuide}
          >
            상담이 필요한 증상 확인
          </S.ConsultationButton>
        </S.WarningCard>
      </S.Content>

      <S.BottomArea>
        <CareButton disabled={isStartingRoutine} onClick={handleStartRoutine}>
          루틴 시작
        </CareButton>
      </S.BottomArea>

      <TabBar activeTab="care" />
    </S.Page>
  );
}
