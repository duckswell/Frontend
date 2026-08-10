import * as S from "../styles/RecommendedIngredientCard.styles";

interface RecommendedIngredientCardProps {
  category: string;
  ingredient: string;
  description: string;
  image: string;
}

export default function RecommendedIngredientCard({
  category,
  ingredient,
  description,
  image,
}: RecommendedIngredientCardProps) {
  return (
    <S.Card>
      <S.BackgroundImage src={image} alt="" aria-hidden="true" />

      <S.Content>
        <S.Category>{category}</S.Category>

        <S.IngredientInfo>
          <S.IngredientName>{ingredient}</S.IngredientName>
          <S.Description>{description}</S.Description>
        </S.IngredientInfo>
      </S.Content>
    </S.Card>
  );
}
