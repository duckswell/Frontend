import * as S from "../styles/CareButton.styles";

interface CareButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "focus" | "daily" | "black";
  disabled?: boolean;
}

export default function CareButton({
  children,
  onClick,
  variant = "focus",
  disabled = false,
}: CareButtonProps) {
  return (
    <S.Button
      type="button"
      onClick={onClick}
      $variant={variant}
      disabled={disabled}
    >
      {children}
    </S.Button>
  );
}
