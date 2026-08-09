import { NavBar } from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import CareButton from "../components/CareButton";
import FocusProgress from "../components/FocusCare/FocusProgress";
import RoutineStepCard from "../components/FocusCare/RoutineStepCard";

import { colorPalette } from "../lib/colorPalette";
import * as S from "../styles/FocusCare/ThirdFocusCare.styles";

export default function ThirdFocusCare() {
  const navigate = useNavigate();
  function handleCompleteFocusCareRoutine() {
    navigate("/care/finish_routine");
  }

  return (
    <S.Page>
      <NavBar title="집중 코스" />

      <S.Main>
        <FocusProgress currentStep={3} />

        <S.Content>
          <S.RoutineIntro>
            <S.SectionTitle>오늘의 맞춤 루틴</S.SectionTitle>

            <S.Description>
              남아 있는 붉은기와 건조함, 각질을 고려해
              <br />
              진정과 장벽 관리에 필요한 단계만 담았어요
            </S.Description>
          </S.RoutineIntro>

          <S.CardList>
            <RoutineStepCard
              step={1}
              title="클렌징"
              product="순한 약산성 클렌저"
              method="미온수로 충분히 적신 뒤 손끝으로 부드럽게 세안"
            />

            <RoutineStepCard
              step={2}
              title="수분 토너"
              product="히알루론산·판테놀 성분의 토너"
              method="화장솜 대신 손바닥으로 가볍게 눌러 흡수"
              alternative="두 성분이 모두 없다면 OOO 성분도 좋아요"
            />

            <RoutineStepCard
              step={3}
              title="진정 세럼"
              product="센텔라·판테놀 성분의 세럼"
              method="붉은 부위를 문지르지 말고 부드럽게 눌러 흡수"
              alternative="두 성분 모두 없다면 센텔라를 우선 사용해요"
            />

            <RoutineStepCard
              step={4}
              title="장벽 크림"
              product="세라마이드·판테놀 성분의 크림"
              method="건조함과 각질이 느껴지는 부위에 덧발라요"
              alternative="세라마이드가 없다면 판테놀을 우선 사용해요"
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
                · 각질이 있는 부위는 문지르거나 억지로 떼어내지 마세요
              </S.WarningText>

              <S.WarningText>
                · 따갑거나 자극이 느껴지면 해당 단계를 건너뛰어도 돼요
              </S.WarningText>

              <S.WarningText>
                · 이 루틴은 일상적인 피부 관리 안내이며 의료 진단을 대신하지
                않아요.
              </S.WarningText>

              <S.WarningText>
                · 붓기나 통증이 심해지면 루틴을 멈추고 의료기관에 상담해 주세요.
              </S.WarningText>
            </S.WarningList>

            <S.SymptomButton type="button">
              상담이 필요한 증상 확인
            </S.SymptomButton>
          </S.WarningBox>

          <S.CompleteButtonWrapper>
            <CareButton
              onClick={handleCompleteFocusCareRoutine}
              backgroundColor={colorPalette.FocusPrimary}
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
