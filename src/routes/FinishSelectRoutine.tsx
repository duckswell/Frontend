import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { RoutineTypeCode } from "../api/course";
import { routineApi } from "../api/routine";

import CareButton from "../components/CareButton";
import FocusConfetti from "../components/FocusCare/FocusConfetti";
import RecommendedProductSection, {
  type Product,
} from "../components/FocusCare/RecommendedProductSection";

import * as S from "../styles/FocusCare/FinishSelectRoutine.styles";

interface FinishSelectRoutineLocationState {
  courseId: number;
  routineTypeCode: RoutineTypeCode;
  routineTypeName: string | null;
  routineTitle: string;
  routineImage: string;
  routineCategories: string[];

  /*
   * 실제 routine이 존재하는 경우에만 사용.
   *
   * 현재 FinishFocusCare → FinishSelectRoutine 흐름에서는
   * 아직 diagnosis를 하지 않았기 때문에
   * 보통 routineId는 존재하지 않는다.
   */
  routineId?: number;
}

export default function FinishSelectRoutine() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as FinishSelectRoutineLocationState | null;

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const routineTitle =
    state?.routineTitle ?? state?.routineTypeName ?? "데일리 루틴";

  const routineImage = state?.routineImage ?? "/assets/Daily_cooldown.png";

  const routineCategories = state?.routineCategories ?? [];

  const routineDisplayName = routineTitle.replace(" 루틴", "");

  useEffect(() => {
    /*
     * 이 페이지에 넘어올 때 실제 routineId가 없는 경우에는
     * recommended-products를 억지로 호출하지 않는다.
     *
     * /courses/start는 course만 생성하며,
     * routineId는 이후 /diagnoses 응답에서 생성된다.
     */
    if (state?.routineId === undefined) {
      console.log("아직 오늘의 routineId가 없어 추천 제품 조회를 생략합니다.");
      return;
    }

    const routineId = state.routineId;

    async function fetchRecommendedProducts() {
      try {
        const response = await routineApi.getRecommendedProducts(routineId);

        console.log("루틴 추천 제품 조회 성공:", response);

        const mappedProducts: Product[] = response.map((item) => ({
          id: item.product.id,
          brand: item.product.brand,
          name: item.product.name,
          categories: [item.ingredientName],
          imageUrl: item.product.imageUrl,
          linkUrl: item.product.linkUrl,
        }));

        setRecommendedProducts(mappedProducts);
      } catch (error) {
        console.error("루틴 추천 제품 조회 실패:", error);

        if (axios.isAxiosError(error)) {
          console.error("HTTP Status:", error.response?.status);

          console.error("API Error Response:", error.response?.data);

          console.error("요청 URL:", error.config?.url);
        }

        setRecommendedProducts([]);
      }
    }

    fetchRecommendedProducts();
  }, [state?.routineId]);

  function handleMoveToHome() {
    navigate("/");
  }

  return (
    <S.Page>
      <S.Content>
        <S.CompletionSection>
          <FocusConfetti />

          <S.IntroTextArea>
            <S.Title>
              내일부터 {routineDisplayName} 루틴으로
              <br />
              매일 함께해요!
            </S.Title>

            <S.Description>데일리 코스 루틴 선택을 완료했어요</S.Description>
          </S.IntroTextArea>
        </S.CompletionSection>

        <S.IntroSection>
          <S.RoutineCard>
            <S.RoutineImage src={routineImage} alt={routineDisplayName} />

            <S.RoutineName>{routineDisplayName}</S.RoutineName>

            <S.CategoryList>
              {routineCategories.map((category) => (
                <S.Category key={category}>{category}</S.Category>
              ))}
            </S.CategoryList>
          </S.RoutineCard>
        </S.IntroSection>

        <S.ProductSection>
          <RecommendedProductSection
            title="이 제품들과 함께하면 좋아요"
            products={recommendedProducts}
          />
        </S.ProductSection>

        <S.ButtonArea>
          <CareButton variant="black" onClick={handleMoveToHome}>
            홈으로
          </CareButton>
        </S.ButtonArea>
      </S.Content>
    </S.Page>
  );
}
