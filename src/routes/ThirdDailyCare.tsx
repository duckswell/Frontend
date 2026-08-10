import { useNavigate } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import CareButton from "../components/CareButton";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineStepCard from "../components/FocusCare/RoutineStepCard";

import { colorPalette } from "../lib/colorPalette";
import * as S from "../styles/DailyCare/ThirdDailyCare.styles";

export default function ThirdDailyCare() {
  const navigate = useNavigate();

  function handleCompleteDailyCareRoutine() {
    navigate("/care/today_routine_summary");
  }

  function handleMoveToRecommendedProduct() {
    navigate("/recommend?from=care");
  }

  return (
    <S.Page>
      <NavBar title="데일리 코스" />

      <S.Main>
        <FocusProgress currentStep={3} variant="daily" />

        <S.Content>
          <S.RoutineIntro>
            <S.SectionTitle>오늘의 클리어업 루틴</S.SectionTitle>

            <S.Description>
              트러블 흔적과 피부톤이 칙칙한 부위가 있어
              <br />
              가볍게 관리할 수 있는 맞춤 루틴을 준비했어요
            </S.Description>
          </S.RoutineIntro>

          <S.CardList>
            <RoutineStepCard
              step={1}
              title="클렌징"
              product="순한 약산성 클렌저"
              method="미지근한 물로 거품을 충분히 내어 부드럽게 세안"
              variant="daily"
              onProductButtonClick={handleMoveToRecommendedProduct}
            />

            <RoutineStepCard
              step={2}
              title="흔적 케어"
              product="나이아신아마이드 세럼"
              method={
                <>
                  칙칙하거나 트러블 흔적이
                  <br />
                  신경 쓰이는 부위부터 얇게 펴 발라 주세요
                </>
              }
              alternative="센텔라 성분 제품을 사용해도 좋아요"
              variant="daily"
              onProductButtonClick={handleMoveToRecommendedProduct}
            />

            <RoutineStepCard
              step={3}
              title="보습 마무리"
              product="판테놀 또는 세라마이드 크림"
              method={
                <>
                  얼굴 전체에 얇게 펴 바르고
                  <br />
                  건조한 부위에는 한 번 더 덧발라 주세요
                </>
              }
              alternative={
                <>
                  두 성분 모두 없다면
                  <br />
                  세라마이드를 우선 사용해요
                </>
              }
              variant="daily"
              productButtonText="추천 성분이 포함된 제품"
              onProductButtonClick={handleMoveToRecommendedProduct}
            />
          </S.CardList>

          <S.WarningBox>
            <S.WarningHeader>
              <S.WarningIcon
                src="/assets/warning_icon.svg"
                alt=""
                aria-hidden="true"
              />

              <S.WarningTitle>주의사항</S.WarningTitle>
            </S.WarningHeader>

            <S.WarningList>
              <S.WarningText>
                · 피부에 자극이 느껴지면 해당 제품의 사용을 중단해 주세요.
              </S.WarningText>

              <S.WarningText>
                · 새 제품은 얼굴 전체에 사용하기 전 좁은 부위에 먼저 테스트해
                주세요.
              </S.WarningText>

              <S.WarningText>
                · 이 루틴은 일상 관리 안내이며 의료 처방이 아닙니다.
              </S.WarningText>

              <S.WarningText>
                · 증상이 심해지거나 통증이 있으면 병원 상담을 권장합니다.
              </S.WarningText>
            </S.WarningList>

            <S.SymptomButton type="button">상담 안내 확인</S.SymptomButton>
          </S.WarningBox>

          <S.CompleteButtonWrapper>
            <CareButton
              onClick={handleCompleteDailyCareRoutine}
              backgroundColor={colorPalette.DailyPrimary}
              textColor={colorPalette.OffWhite}
            >
              루틴 완료
            </CareButton>
          </S.CompleteButtonWrapper>
        </S.Content>
      </S.Main>
    </S.Page>
  );
}
