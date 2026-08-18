import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { TabBar } from "../components/TabBar";
import CareButton from "../components/CareButton";

import { api } from "../lib/api";
import { courseApi } from "../api/course";

import * as S from "../styles/FocusCare/Care.styles";

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

  const [recoveryDayText, setRecoveryDayText] = useState("");
  const [recoverySummary, setRecoverySummary] = useState("");

  const [isStartingRoutine, setIsStartingRoutine] = useState(false);

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        const course = await courseApi.getCurrentCourse();

        console.log("현재 진행 중인 코스:", course);

        if (!course) {
          setRecoverySummary("");
          return;
        }

        /*
         * 집중 코스가 아닐 경우
         * 회복 단계 요약을 조회하지 않는다.
         */
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

  const handleOpenConsultationGuide = () => {
    navigate("/safety");
  };

  const handleStartRoutine = async () => {
    if (isStartingRoutine) {
      return;
    }

    try {
      setIsStartingRoutine(true);

      /*
       * 버튼을 누르는 순간
       * 현재 진행 중인 코스를 다시 조회한다.
       */
      const latestCourse = await courseApi.getCurrentCourse();

      console.log("루틴 시작 시 최신 코스:", latestCourse);

      /*
       * 기존 집중 코스가 있을 때만
       * 오늘의 집중 루틴으로 이동한다.
       *
       * Care.tsx에서는 FOCUS 코스를 새로 생성하지 않는다.
       */
      if (latestCourse?.courseType === "FOCUS") {
        console.log("기존 집중 코스로 루틴 시작:", latestCourse.courseId);

        navigate("/care/first_focus_care", {
          state: {
            courseId: latestCourse.courseId,
          },
        });

        return;
      }

      /*
       * DAILY 코스가 진행 중인 경우
       */
      if (latestCourse?.courseType === "DAILY") {
        console.error(
          "현재 데일리 코스가 진행 중입니다. 집중 루틴을 시작할 수 없습니다.",
          latestCourse
        );

        return;
      }

      /*
       * 진행 중인 코스가 없는 경우
       *
       * 여기서는 새로운 FOCUS 코스를 생성하지 않는다.
       * 집중 코스 생성은 시술 등록 페이지가 담당한다.
       */
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
