import { NavBar } from "../components/NavBar";
import AnalysisLoading from "../components/FocusCare/AnalysisLoading";
import AnalysisResultCard from "../components/FocusCare/AnalysisResultCard";
import FocusProgress from "../components/FocusCare/FocusProgress";
import * as S from "../styles/FocusCare/SecondFocusCare.styles";

export default function SecondFocusCare() {
  return (
    <S.Page>
      <NavBar title="집중 코스" />
      <S.Main>
        <FocusProgress currentStep={2} />

        <S.Content>
          <AnalysisResultCard />
          <AnalysisLoading />
        </S.Content>
      </S.Main>
    </S.Page>
  );
}
