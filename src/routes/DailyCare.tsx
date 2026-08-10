import { useNavigate } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { TabBar } from "../components/TabBar";
import CareButton from "../components/CareButton";
import { colorPalette } from "../lib/colorPalette";
import * as S from "../styles/DailyCare/DailyCare.styles";

const ROUTINE_CATEGORIES = ["붉은기", "열감", "민감함"];

const ROUTINE_STEPS = [
  {
    step: "STEP 1",
    title: "피부 상태 확인",
    description:
      "민낯 사진을 촬영하거나 피부 고민을 기록하면 AI가 오늘의 상태를 분석해요",
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

export default function DailyCare() {
  const navigate = useNavigate();

  const handleMoveToIngredientRecommendation = () => {
    console.log("추천 성분 제품 페이지로 이동");
  };

  const handleOpenConsultationGuide = () => {
    console.log("상담이 필요한 증상 확인");
  };

  const handleStartRoutine = () => {
    navigate("/care/first_daily_care");
  };

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Content>
        <S.RoutineSection>
          <S.SectionTitle>오늘의 데일리 루틴</S.SectionTitle>

          <S.RoutineCard>
            <S.RoutineBadge>현재 진행 중인 루틴</S.RoutineBadge>

            <S.RoutineTitleRow>
              <S.RoutineTitle>쿨다운 루틴</S.RoutineTitle>

              <S.SettingIcon
                src="/assets/SettingBlack.svg"
                alt=""
                aria-hidden="true"
              />
            </S.RoutineTitleRow>

            <S.RoutineDescription>
              붉은기와 열감이 느껴지는 피부를 편안하게 진정해요
            </S.RoutineDescription>

            <S.CategoryList>
              {ROUTINE_CATEGORIES.map((category) => (
                <S.CategoryBadge key={category}>{category}</S.CategoryBadge>
              ))}
            </S.CategoryList>
          </S.RoutineCard>
        </S.RoutineSection>

        <S.CourseSection>
          <S.SectionTitle>루틴은 이렇게 진행돼요</S.SectionTitle>

          <S.CourseCard>
            <S.StepList>
              {ROUTINE_STEPS.map((routineStep) => (
                <S.StepItem key={routineStep.step}>
                  <S.StepBadge>{routineStep.step}</S.StepBadge>

                  <S.StepTitle>{routineStep.title}</S.StepTitle>

                  <S.StepDescription>
                    {routineStep.description}
                  </S.StepDescription>
                </S.StepItem>
              ))}
            </S.StepList>

            <S.OutlinedButton
              type="button"
              onClick={handleMoveToIngredientRecommendation}
            >
              추천 성분이 담긴 제품 보기
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
        <CareButton
          backgroundColor={colorPalette.DailyPrimary}
          onClick={handleStartRoutine}
        >
          루틴 시작하기
        </CareButton>
      </S.BottomArea>

      <TabBar activeTab="care" />
    </S.Page>
  );
}
