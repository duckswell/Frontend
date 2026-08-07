import * as S from "../../styles/SkinConditionSelector.styles";
const SKIN_CONDITION_ROWS = [
    ["붉은기", "열감", "따가움", "건조함"],
    ["각질", "번들거림", "가려움", "붓기"],
  ];
  
  export default function SkinConditionSelector({
    selectedConditions,
    onToggleCondition,
  }: SkinConditionSelectorProps) {
    return (
      <S.Container>
        <S.TextArea>
          <S.Title>오늘 피부 상태는 어떤가요?</S.Title>
  
          <S.Description>
            선택한 상태를 바탕으로 오늘의 맞춤 관리 루틴을 안내해 드려요
          </S.Description>
        </S.TextArea>
  
        <S.ConditionList>
          {SKIN_CONDITION_ROWS.map((row, rowIndex) => (
            <S.ConditionRow key={rowIndex}>
              {row.map((condition) => {
                const isSelected = selectedConditions.includes(condition);
  
                return (
                  <S.ConditionButton
                    key={condition}
                    type="button"
                    $selected={isSelected}
                    onClick={() => onToggleCondition(condition)}
                  >
                    {condition}
                  </S.ConditionButton>
                );
              })}
            </S.ConditionRow>
          ))}
        </S.ConditionList>
      </S.Container>
    );
  }