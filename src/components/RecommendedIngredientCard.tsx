import * as S from "../styles/RecommendedIngredientCard.styles";

interface RecommendedIngredientCardProps {
  category: string | string[];
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
  const categories = Array.isArray(category) ? category : [category];

  return (
    <S.Card>
      <S.BackgroundImage src={image} alt="" aria-hidden="true" />

      <S.Content>
        <S.CategoryList>
          {categories.map((item, index) => (
            <S.Category key={`${item}-${index}`}>{item}</S.Category>
          ))}
        </S.CategoryList>

        <S.IngredientInfo>
          <S.IngredientName>{ingredient}</S.IngredientName>
          <S.Description>{description}</S.Description>
        </S.IngredientInfo>
      </S.Content>
    </S.Card>
  );
}
