import * as S from "../../styles/Care/AdditionalSymptomInput.styles";

interface AdditionalSymptomInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdditionalSymptomInput({
  value,
  onChange,
}: AdditionalSymptomInputProps) {
  return (
    <S.Container>
      <S.TextArea>
        <S.Title>
          선택한 항목 외에 다른 증상이 있나요?{" "}
          <S.OptionalText>(선택)</S.OptionalText>
        </S.Title>

        <S.Description>
          불편한 증상을 적어주시면 루틴 추천에 함께 반영할게요
        </S.Description>
      </S.TextArea>

      <S.SymptomTextarea
        value={value}
        placeholder="예) 만지면 통증이 있어요"
        onChange={(event) => onChange(event.target.value)}
      />

      <S.Notice>
        * 입력한 정보는 루틴 추천에만 사용되며 의료 진단을 대신하지 않아요
      </S.Notice>
    </S.Container>
  );
}
