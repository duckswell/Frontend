import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/DailycoursePreview.styles";
import { NavBar } from "../components/NavBar";
import { courseApi } from "../api/course";
import { isAxiosError } from "axios";

const ROUTINE_CODE_MAP: Record<
  string,
  "COOLDOWN" | "CLEAR_UP" | "SEBUM_CONTROL" | "HYDRATION"
> = {
  cooldown: "COOLDOWN",
  clearup: "CLEAR_UP",
  sebum: "SEBUM_CONTROL",
  moisture: "HYDRATION",
};

const REVERSE_ROUTINE_ID_MAP: Record<string, string> = {
  "쿨다운 케어": "cooldown",
  쿨다운: "cooldown",
  "클리어업 케어": "clearup",
  클리어업: "clearup",
  "피지 조절 케어": "sebum",
  "피지컨트롤 케어": "sebum",
  피지컨트롤: "sebum",
  "수분 보충 케어": "moisture",
  "수분충전 케어": "moisture",
  수분충전: "moisture",
};

type StartDailyCoursePayload = Parameters<typeof courseApi.startCourse>[0] & {
  routineTypeCode: "COOLDOWN" | "CLEAR_UP" | "SEBUM_CONTROL" | "HYDRATION";
};

interface RoutineItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  iconSrc: string;
}

const ROUTINE_DATA: RoutineItem[] = [
  {
    id: "cooldown",
    title: "쿨다운 루틴",
    description: "쉽게 붉어지고 예민해지는 피부를 진정",
    tags: ["센텔라", "판테놀", "알로에"],
    iconSrc: "/assets/Daily_cooldown.png",
  },
  {
    id: "clearup",
    title: "클리어업 루틴",
    description: "칙칙한 피부톤과 눈에 띄는 피부 흔적에 집중",
    tags: ["나이아신아마이드", "비타민C"],
    iconSrc: "/assets/Daily_clearup.png",
  },
  {
    id: "sebum",
    title: "피지컨트롤 루틴",
    description: "과도한 피지가 고민인 피부를 산뜻하고 깨끗하게",
    tags: ["나이아신아마이드", "징크 PCA"],
    iconSrc: "/assets/Daily_pore.png",
  },
  {
    id: "moisture",
    title: "수분충전 루틴",
    description: "건조하고 당기는 피부에 수분을 채워 촉촉하게",
    tags: ["히알루론산", "세라마이드", "판테놀"],
    iconSrc: "/assets/Daily_barrier.png",
  },
];

const DailycoursePreview: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentRoutineId, setCurrentRoutineId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentCourse = async () => {
      try {
        const current = await courseApi.getCurrentCourse();
        if (!isMounted || !current) return;

        if (current.courseType === "DAILY" && current.label) {
          const matchedId = REVERSE_ROUTINE_ID_MAP[current.label] || null;
          setCurrentRoutineId(matchedId);
        }
      } catch (error) {
        console.error("현재 코스 조회 실패:", error);
      }
    };

    fetchCurrentCourse();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoutineClick = (id: string) => {
    if (currentRoutineId === id) {
      setShowToast(false);
      setTimeout(() => setShowToast(true), 10);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    setSelectedId(id);
  };

  const handleSubmit = async () => {
    if (!selectedId || selectedId === currentRoutineId || isSubmitting) return;

    const routineTypeCode = ROUTINE_CODE_MAP[selectedId];
    if (!routineTypeCode) return;

    setIsSubmitting(true);

    const payload: StartDailyCoursePayload = {
      courseType: "DAILY",
      routineTypeCode,
    };

    try {
      const current = await courseApi.getCurrentCourse().catch(() => null);

      const currentCourseId =
        current?.courseId ?? (current as unknown as { id?: number })?.id;

      if (currentCourseId !== undefined && currentCourseId !== null) {
        await courseApi.endCourse(currentCourseId);
      }

      await courseApi.startCourse(payload);

      navigate("/");
    } catch (error) {
      console.error("데일리 코스 전환 실패:", error);

      if (isAxiosError(error) && error.response?.status === 409) {
        try {
          const fallbackCurrent = await courseApi.getCurrentCourse();
          const fallbackId =
            fallbackCurrent?.courseId ??
            (fallbackCurrent as unknown as { id?: number })?.id;

          if (fallbackId) {
            await courseApi.endCourse(fallbackId);
            await courseApi.startCourse(payload);
            navigate("/");
            return;
          }
        } catch (retryError) {
          console.error("재시도 실패:", retryError);
        }
      }

      if (isAxiosError(error)) {
        alert(
          error.response?.data?.message || "데일리 코스 시작에 실패했습니다.",
        );
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar title="데일리 코스 루틴" />

      <S.Container>
        <S.BannerCard>
          <S.BannerTitle>내 피부 고민에 맞는 관리를 꾸준히</S.BannerTitle>
          <S.BannerDesc>
            네 가지 데일리 루틴 중 하나를 선택해 매일 꾸준히 관리해요
          </S.BannerDesc>
          <S.TimeInfo>
            <img src="/assets/Clock.svg" alt="시계" />
            <span>최소 하루 약 5분</span>
          </S.TimeInfo>
        </S.BannerCard>

        <S.SectionHeader>
          <S.Title>어떤 관리에 집중하고 싶으세요?</S.Title>
          <S.SubDesc>
            지금 가장 신경 쓰이는 피부 고민에 맞춰 루틴을 선택해 주세요
            {"\n"}선택한 루틴은 언제든 변경할 수 있어요
          </S.SubDesc>
        </S.SectionHeader>

        <S.RoutineList>
          {ROUTINE_DATA.map((item) => {
            const isCurrent = currentRoutineId === item.id;
            const isSelected = selectedId === item.id;

            return (
              <S.CardContainer
                key={item.id}
                $isSelected={isSelected}
                style={{
                  position: "relative",
                  marginTop: isCurrent ? "12px" : "0px",
                }}
                onClick={() => handleRoutineClick(item.id)}
              >
                {isCurrent && <S.NowRoutine>현재 루틴</S.NowRoutine>}

                <S.IconImage src={item.iconSrc} alt={item.title} />
                <S.ContentBox>
                  <S.CardTitle>{item.title}</S.CardTitle>
                  <S.CardDescription>{item.description}</S.CardDescription>
                  <S.TagList>
                    {item.tags.map((tag) => (
                      <S.TagChip key={tag}>{tag}</S.TagChip>
                    ))}
                  </S.TagList>
                </S.ContentBox>
              </S.CardContainer>
            );
          })}
        </S.RoutineList>

        <S.SubmitButton
          type="button"
          disabled={
            !selectedId || selectedId === currentRoutineId || isSubmitting
          }
          onClick={handleSubmit}
        >
          {isSubmitting ? "변경하는 중..." : "이 루틴으로 변경하기"}
        </S.SubmitButton>

        {showToast && (
          <S.ToastNotice>
            <span className="info-icon">!</span> 현재 진행 중인 루틴은 선택할 수
            없습니다.
          </S.ToastNotice>
        )}
      </S.Container>
    </>
  );
};

export default DailycoursePreview;
