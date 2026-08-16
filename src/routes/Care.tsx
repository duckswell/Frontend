import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { TabBar } from "../components/TabBar";
import CareButton from "../components/CareButton";

import { api } from "../lib/api";
import { courseApi, type CurrentCourseResponse } from "../api/course";

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
    title: "사진촬영/증상선택",
    description: "화장하지 않은 얼굴을 찍거나 오늘의 증상을 선택",
  },
  {
    step: "STEP 2",
    title: "관리 난이도 선택",
    description: "화장하지 않은 얼굴을 찍거나 오늘의 증상을 선택",
  },
  {
    step: "STEP 3",
    title: "루틴 진행",
    description: "화장하지 않은 얼굴을 찍거나 오늘의 증상을 선택",
  },
];

export default function Care() {
  const navigate = useNavigate();

  const [currentCourse, setCurrentCourse] =
    useState<CurrentCourseResponse | null>(null);

  const [recoveryDayText, setRecoveryDayText] = useState("");
  const [recoverySummary, setRecoverySummary] = useState("");

  const [isStartingCourse, setIsStartingCourse] = useState(false);

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        const course = await courseApi.getCurrentCourse();

        console.log("현재 진행 중인 코스:", course);

        /*
         * 진행 중인 코스가 없을 수 있으므로
         * null을 먼저 처리한다.
         */
        if (!course) {
          setCurrentCourse(null);
          setRecoverySummary("");
          return;
        }

        setCurrentCourse(course);

        /*
         * recovery-summary는 집중 코스에서만 조회
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

        setCurrentCourse(null);
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

        /*
         * 집중 코스가 아니거나
         * 진행 중인 코스가 없으면 data가 없을 수 있음
         */
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

  const handleMoveToProductRecommendation = () => {
    navigate("/recommend");
  };

  const handleOpenConsultationGuide = () => {
    navigate("/safety");
  };

  const handleStartRoutine = async () => {
    if (isStartingCourse) {
      return;
    }

    try {
      setIsStartingCourse(true);

      /*
       * 이미 집중 코스 진행 중
       */
      if (currentCourse?.courseType === "FOCUS") {
        console.log("기존 집중 코스로 루틴 시작:", currentCourse.courseId);

        navigate("/care/first_focus_care", {
          state: {
            courseId: currentCourse.courseId,
          },
        });

        return;
      }

      /*
       * DAILY 진행 중이면 새 FOCUS 시작 불가
       */
      if (currentCourse?.courseType === "DAILY") {
        console.error(
          "데일리 코스가 진행 중이어서 집중 코스를 시작할 수 없습니다.",
          currentCourse
        );

        return;
      }

      /*
       * 진행 중인 코스 없음 → FOCUS 생성
       */
      const course = await courseApi.startCourse({
        courseType: "FOCUS",
      });

      console.log("새 집중 코스 시작 성공:", course);

      navigate("/care/first_focus_care", {
        state: {
          courseId: course.id,
        },
      });
    } catch (error) {
      console.error("집중 코스 시작 실패:", error);
    } finally {
      setIsStartingCourse(false);
    }
  };

  return (
    <S.Page>
      <NavBar title="케어" />

      <S.Content>
        <S.StatusCard>
          {currentCourse?.courseType === "FOCUS" && (
            <S.CourseBadge>집중 코스 진행 중</S.CourseBadge>
          )}

          <S.StatusTitle>
            {recoveryDayText || "시술 후 경과 확인 중"}
          </S.StatusTitle>

          <S.StatusDescription>{recoverySummary}</S.StatusDescription>

          <S.StatusNotice>
            *피부 상태에 따라 회복 속도는 달라질 수 있어요.
          </S.StatusNotice>
        </S.StatusCard>

        <S.CourseSection>
          <S.SectionTitle>코스 안내</S.SectionTitle>

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

            <S.OutlinedButton
              type="button"
              onClick={handleMoveToProductRecommendation}
            >
              추천 성분 제품 보러가기
            </S.OutlinedButton>
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
        <CareButton disabled={isStartingCourse} onClick={handleStartRoutine}>
          루틴 시작
        </CareButton>
      </S.BottomArea>

      <TabBar activeTab="care" />
    </S.Page>
  );
}
