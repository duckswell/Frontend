// [아카이빙용 목 데이터] 백엔드 서버 종료 후 홈 대시보드를 프론트만으로 보여주기 위해 사용

import type {
  ChecklistItem,
  RecoveryBannerData,
  WeatherBannerData,
  WeatherFactor,
} from "../api/dashboard";
import type { ProcedureItem } from "../api/procedure";
import { MOCK_RECOVERY_DAY_TEXT } from "./focusCare";

const formatLocalDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

// 집중 코스 체험 기준일(7일차)에 맞춰 시술일을 6일 전으로 설정
const procedureDate = new Date();
procedureDate.setDate(procedureDate.getDate() - 6);

// GET /api/procedures/current 대체
export const MOCK_CURRENT_PROCEDURES: ProcedureItem[] = [
  {
    id: 1,
    procedureType: "PDT_PTT",
    procedureTypeName: "PDT/PTT",
    procedureDate: formatLocalDate(procedureDate),
    currentCount: 1,
    totalCount: 5,
    areas: ["FULL_FACE"],
  },
];

// GET /api/dashboard/recovery-banner 대체 (첫 줄은 케어 페이지 상태 카드 제목으로도 사용)
export const MOCK_RECOVERY_BANNER: RecoveryBannerData = {
  summaryMessage: `${MOCK_RECOVERY_DAY_TEXT},\n붉은 기가 거의 가라앉았어요`,
  dDay: 7,
  redness: { current: 32, delta: -8 },
  texture: { current: 24, delta: -3 },
  blemish: { current: 12, delta: 0 },
};

// ===== 기획 문서 <홈> 날씨 지표 기준표 =====

interface WeatherLevel {
  max: number;
  level: string;
  cardStatus: string;
  siren: boolean;
}

const UV_LEVELS: WeatherLevel[] = [
  { max: 2, level: "낮음", cardStatus: "부담적음", siren: false },
  { max: 5, level: "보통", cardStatus: "차단필요", siren: false },
  { max: 7, level: "높음", cardStatus: "노출주의", siren: true },
  { max: 10, level: "매우높음", cardStatus: "외출주의", siren: true },
  { max: Infinity, level: "위험", cardStatus: "외출자제", siren: true },
];

const HUMIDITY_LEVELS: WeatherLevel[] = [
  { max: 29, level: "30%미만", cardStatus: "매우건조", siren: true },
  { max: 39, level: "30~39%", cardStatus: "건조주의", siren: false },
  { max: 69, level: "40~69%", cardStatus: "적정", siren: false },
  { max: 79, level: "70~79%", cardStatus: "다소습함", siren: true },
  { max: Infinity, level: "80%이상", cardStatus: "매우습함", siren: true },
];

const DUST_LEVELS: WeatherLevel[] = [
  { max: 30, level: "좋음", cardStatus: "공기쾌적", siren: false },
  { max: 80, level: "보통", cardStatus: "공기보통", siren: false },
  { max: 150, level: "나쁨", cardStatus: "자극주의", siren: true },
  { max: Infinity, level: "매우나쁨", cardStatus: "외출자제", siren: true },
];

// 홈 화면은 level에 "주의"가 들어가면 경고 아이콘을 띄우므로 사이렌 대상은 "주의"로 표기
const toWeatherFactor = (value: number, levels: WeatherLevel[]) => {
  const matched =
    levels.find((level) => value <= level.max) ?? levels[levels.length - 1];

  const factor: WeatherFactor = {
    value,
    level: matched.siren ? "주의" : "양호",
    cardStatus: matched.cardStatus,
  };

  return { factor, matched };
};

// 가장 높은 주의 지표 → 종합 문구
const getSummaryMessage = (
  uv: WeatherLevel,
  humidity: WeatherLevel,
  dust: WeatherLevel
) => {
  if (uv.level === "매우높음" || uv.level === "위험") {
    return "오늘은\n한낮의 야외 활동을 줄여 주세요";
  }

  if (dust.level === "매우나쁨") {
    return "오늘은\n야외 활동을 가능한 줄여 주세요";
  }

  if (uv.level === "높음") {
    return "오늘은\n햇빛으로부터 피부를 보호해 주세요";
  }

  if (dust.level === "나쁨") {
    return "오늘은\n외출 후 피부를 깨끗이 씻어 주세요";
  }

  if (humidity.cardStatus === "매우건조") {
    return "오늘은\n피부가 쉽게 건조해질 수 있어요";
  }

  if (humidity.cardStatus === "매우습함") {
    return "오늘은\n땀이 피부에 오래 남지 않게 해주세요";
  }

  return "오늘은\n기본 케어를 편안하게 이어가세요";
};

// GET /api/dashboard/weather-banner 대체 (예시 날씨: 자외선 6, 습도 45%, 미세먼지 35)
export const getMockWeatherBanner = (): WeatherBannerData => {
  const uv = toWeatherFactor(6, UV_LEVELS);
  const humidity = toWeatherFactor(45, HUMIDITY_LEVELS);
  const dust = toWeatherFactor(35, DUST_LEVELS);

  return {
    uv: uv.factor,
    humidity: humidity.factor,
    dust: dust.factor,
    summaryMessage: getSummaryMessage(uv.matched, humidity.matched, dust.matched),
    triggerFactor: "자외선",
  };
};

// GET /api/dashboard/checklist 대체 (기획 문서의 사후관리 생활 습관 기반)
export const getMockChecklist = (isFocus: boolean): ChecklistItem[] =>
  isFocus
    ? [
        {
          id: 1,
          title: "시술 부위 만지지 않기",
          description: "각질은 자연스럽게 떨어지도록 두고 손으로 뜯거나 짜지 마세요",
          checked: false,
        },
        {
          id: 2,
          title: "사우나·격한 운동·음주 쉬어가기",
          description: "열 자극은 회복을 늦출 수 있어 시술 후 최소 7일은 피해 주세요",
          checked: false,
        },
      ]
    : [
        {
          id: 4,
          title: "자외선 차단제 덧바르기",
          description: "자외선이 강한 날이에요. SPF 30 이상 제품을 외출 전에 발라 주세요",
          checked: false,
        },
        {
          id: 5,
          title: "자극적인 음식 줄이기",
          description: "고당지수·고지방 음식과 유제품은 트러블을 악화시킬 수 있어요",
          checked: false,
        },
      ];
