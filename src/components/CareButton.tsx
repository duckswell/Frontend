import * as S from "../styles/CareButton.styles";

interface CareButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
}

export default function CareButton({
  children,
  onClick,
  backgroundColor,
  textColor,
  disabled = false,
}: CareButtonProps) {
  return (
    <S.Button
      type="button"
      onClick={onClick}
      $backgroundColor={backgroundColor}
      $textColor={textColor}
      disabled={disabled}
    >
      {children}
    </S.Button>
  );
}