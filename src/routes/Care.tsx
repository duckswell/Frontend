import { NavBar } from "../components/NavBar";
import { TabBar } from "../components/TabBar";
import * as S from "../styles/Care.styles";

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
  const handleMoveToProductRecommendation = () => {
    console.log("추천 성분 제품 페이지로 이동");
  };

  const handleOpenConsultationGuide = () => {
    console.log("상담 안내 확인");
  };

  const handleStartRoutine = () => {
    console.log("루틴 시작");
  };

  return (
    <S.Page>
      <NavBar title="케어" />

      <S.Content>
        <S.StatusCard>
          <S.CourseBadge>집중 코스 진행 중</S.CourseBadge>

          <S.StatusTitle>시술 후 5일째</S.StatusTitle>

          <S.StatusDescription>
            피부 장벽 강화 단계 · 붉은기 완화 중
          </S.StatusDescription>

          <S.StatusNotice>
            *이 정보는 관리 목적 안내이며 의료 진단이 아닙니다.
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
            <S.WarningTitle>이런 증상이 느껴지시나요?</S.WarningTitle>
          </S.WarningTitleRow>

          <S.WarningDescription>
            심한 통증, 급격한 악화, 심한 붓기 등이 있다면 루틴 대신
            <br />
            시술 병원 또는 의료기관 상담을 권고합니다.
          </S.WarningDescription>

          <S.ConsultationButton
            type="button"
            onClick={handleOpenConsultationGuide}
          >
            상담 안내 확인
          </S.ConsultationButton>
        </S.WarningCard>
      </S.Content>

      <S.BottomArea>
        <S.RoutineStartButton type="button" onClick={handleStartRoutine}>
          루틴 시작
        </S.RoutineStartButton>
      </S.BottomArea>

      <TabBar activeTab="care" />
    </S.Page>
  );
}
