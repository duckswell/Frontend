import React, { useState } from "react";
import * as S from "../styles/NewProcedure.styles";
import { NavBar } from "../components/NavBar";
import { procedureApi } from "../api/procedure";
import { isAxiosError } from "axios";

interface ProcedureData {
  id: number;
  isOpen: boolean;
  type: string;
  date: string;
  currentCount: string;
  totalCount: string;
  selectedParts: string[];
}

const PROCEDURE_MAP: Record<string, string> = {
  스케일링: "SCALING",
  피지파괴술: "PDT_PTT",
  "압출/염증주사": "EXTRACTION_INJECTION",
  레이저토닝: "IPL_LASER_TONING",
};

const BODY_PART_MAP: Record<string, string> = {
  "얼굴 전체": "FULL_FACE",
  T존: "T_ZONE",
  나비존: "BUTTERFLY_ZONE",
  턱: "JAW",
  볼: "CHEEK",
};

const PROCEDURE_OPTIONS = Object.keys(PROCEDURE_MAP);
const BODY_PARTS = Object.keys(BODY_PART_MAP);
const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

const NewProcedure: React.FC = () => {
  const [procedures, setProcedures] = useState<ProcedureData[]>([
    {
      id: 1,
      isOpen: true,
      type: "",
      date: "",
      currentCount: "",
      totalCount: "",
      selectedParts: [],
    },
  ]);

  const [openSelectId, setOpenSelectId] = useState<number | null>(null);
  const [openDatePickerId, setOpenDatePickerId] = useState<number | null>(null);

  const [initialDate, setInitialDate] = useState<string>("");

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = procedures.every(
    (item) =>
      item.type.trim() !== "" &&
      item.date.trim() !== "" &&
      item.currentCount.trim() !== "" &&
      item.totalCount.trim() !== "" &&
      item.selectedParts.length > 0,
  );

  const updateProcedure = <K extends keyof ProcedureData>(
    id: number,
    field: K,
    value: ProcedureData[K],
  ) => {
    setProcedures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const toggleAccordion = (id: number) => {
    setProcedures((prev) =>
      prev.map((item) => ({
        ...item,
        isOpen: item.id === id ? !item.isOpen : false,
      })),
    );
  };

  const togglePart = (id: number, part: string) => {
    setProcedures((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const exists = item.selectedParts.includes(part);
        const updatedParts = exists
          ? item.selectedParts.filter((p) => p !== part)
          : [...item.selectedParts, part];

        return { ...item, selectedParts: updatedParts };
      }),
    );
  };

  const handleAddProcedure = () => {
    const newId = Date.now();
    setProcedures((prev) => [
      ...prev.map((p) => ({ ...p, isOpen: false })),
      {
        id: newId,
        isOpen: true,
        type: "",
        date: "",
        currentCount: "",
        totalCount: "",
        selectedParts: [],
      },
    ]);
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarYear((prev) => prev - 1);
      setCalendarMonth(12);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarYear((prev) => prev + 1);
      setCalendarMonth(1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      procedures: procedures.map((item) => ({
        procedureType: PROCEDURE_MAP[item.type] || item.type,
        procedureDate: item.date.replace(/\./g, "-"),
        currentCount: Number(item.currentCount),
        totalCount: Number(item.totalCount),
        areas: item.selectedParts.map((part) => BODY_PART_MAP[part] || part),
      })),
    };

    try {
      await procedureApi.createProcedures(payload);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error: unknown) {
      console.error("시술 정보 등록 실패:", error);

      if (isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "시술 등록에 실패했습니다. (진행 중인 집중 코스가 있는지 확인해주세요)",
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
      <NavBar title="시술 정보 등록" />

      <S.Container>
        <S.FormCardGroup>
          {procedures.map((item, index) => {
            const isSingle = procedures.length === 1;
            const isEditing = item.isOpen || !item.type;
            const subTitleText = item.isOpen
              ? "작성 중"
              : item.type || "작성 중";

            const isSelectOpen = openSelectId === item.id;
            const isDatePickerOpen = openDatePickerId === item.id;

            return (
              <S.FormCard key={item.id}>
                <S.AccordionHeader
                  $isSingle={isSingle}
                  onClick={() => {
                    if (!isSingle) {
                      toggleAccordion(item.id);
                    }
                  }}
                >
                  <div className="title">
                    {isSingle ? (
                      <>시술 정보 - {item.type || "시술 이름"}</>
                    ) : (
                      <>
                        시술 정보 {index + 1} -
                        <span
                          className={isEditing ? "is-editing" : "has-value"}
                        >
                          {subTitleText}
                        </span>
                      </>
                    )}
                  </div>

                  {!isSingle && (
                    <img
                      className={`arrow-icon ${item.isOpen ? "open" : ""}`}
                      src="/assets/ChevronDown.svg"
                      alt="더보기"
                    />
                  )}
                </S.AccordionHeader>

                {item.isOpen && (
                  <S.CardBody>
                    <S.FormGroup>
                      <label>시술종류</label>
                      <S.SelectBox>
                        <div
                          className={`select-header ${!item.type ? "placeholder" : ""} ${isSelectOpen ? "focused" : ""}`}
                          onClick={() => {
                            setOpenSelectId(isSelectOpen ? null : item.id);
                            setOpenDatePickerId(null);
                          }}
                        >
                          <span>{item.type || "시술 종류를 선택하세요"}</span>
                          <img
                            className={`dropdown-icon ${isSelectOpen ? "open" : ""}`}
                            src="/assets/ChevronDown.svg"
                            alt="선택"
                          />
                        </div>

                        {isSelectOpen && (
                          <div className="options-list">
                            {PROCEDURE_OPTIONS.map((opt) => (
                              <div
                                key={opt}
                                className="option-item"
                                onClick={() => {
                                  updateProcedure(item.id, "type", opt);
                                  setOpenSelectId(null);
                                }}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </S.SelectBox>
                    </S.FormGroup>

                    <S.FormGroup>
                      <label>시술날짜</label>
                      <S.DateInputWrapper
                        $hasValue={Boolean(item.date)}
                        $isFocused={isDatePickerOpen}
                        onClick={() => {
                          if (!isDatePickerOpen) {
                            setInitialDate(item.date);
                          }
                          setOpenDatePickerId(
                            isDatePickerOpen ? null : item.id,
                          );
                          setOpenSelectId(null);
                        }}
                      >
                        <img
                          src="/assets/Calendar.svg"
                          alt="달력"
                          className="calendar-icon"
                        />
                        <span
                          className={`date-text ${!item.date ? "placeholder" : ""}`}
                        >
                          {item.date || "시술날짜"}
                        </span>
                      </S.DateInputWrapper>

                      {isDatePickerOpen && (
                        <S.CustomCalendarCard>
                          <div className="calendar-header">
                            <button
                              type="button"
                              className="nav-btn"
                              onClick={handlePrevMonth}
                            >
                              <img src="/assets/Back.svg" alt="이전달" />
                            </button>
                            <span className="year-month">
                              {calendarYear}.{" "}
                              {String(calendarMonth).padStart(2, "0")}
                            </span>
                            <button
                              type="button"
                              className="nav-btn"
                              onClick={handleNextMonth}
                            >
                              <img
                                src="/assets/Back.svg"
                                alt="다음달"
                                style={{ transform: "rotate(180deg)" }}
                              />
                            </button>
                          </div>

                          <div className="weekdays-grid">
                            {WEEKDAYS.map((day, idx) => (
                              <span
                                key={day}
                                className={idx === 6 ? "sunday" : ""}
                              >
                                {day}
                              </span>
                            ))}
                          </div>

                          <div className="days-grid">
                            {(() => {
                              const firstDayIndex =
                                (new Date(
                                  calendarYear,
                                  calendarMonth - 1,
                                  1,
                                ).getDay() +
                                  6) %
                                7;
                              const totalDays = new Date(
                                calendarYear,
                                calendarMonth,
                                0,
                              ).getDate();
                              const prevMonthTotalDays = new Date(
                                calendarYear,
                                calendarMonth - 1,
                                0,
                              ).getDate();

                              const cells = [];

                              for (let i = firstDayIndex - 1; i >= 0; i--) {
                                const dayNum = prevMonthTotalDays - i;
                                cells.push(
                                  <S.DayCell
                                    key={`prev-${dayNum}`}
                                    type="button"
                                    $isCurrentMonth={false}
                                    $isSelected={false}
                                  >
                                    {dayNum}
                                  </S.DayCell>,
                                );
                              }

                              for (let d = 1; d <= totalDays; d++) {
                                const formattedDate = `${calendarYear}.${String(calendarMonth).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
                                const isSelected = item.date === formattedDate;

                                cells.push(
                                  <S.DayCell
                                    key={`curr-${d}`}
                                    type="button"
                                    $isCurrentMonth={true}
                                    $isSelected={isSelected}
                                    onClick={() => {
                                      updateProcedure(
                                        item.id,
                                        "date",
                                        formattedDate,
                                      );
                                    }}
                                  >
                                    {d}
                                  </S.DayCell>,
                                );
                              }

                              const remainingCells =
                                (7 - (cells.length % 7)) % 7;
                              for (
                                let nextD = 1;
                                nextD <= remainingCells;
                                nextD++
                              ) {
                                cells.push(
                                  <S.DayCell
                                    key={`next-${nextD}`}
                                    type="button"
                                    $isCurrentMonth={false}
                                    $isSelected={false}
                                  >
                                    {nextD}
                                  </S.DayCell>,
                                );
                              }

                              return cells;
                            })()}
                          </div>

                          <div className="calendar-footer">
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() => {
                                updateProcedure(item.id, "date", initialDate);
                                setOpenDatePickerId(null);
                              }}
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              className="confirm-btn"
                              onClick={() => setOpenDatePickerId(null)}
                            >
                              확인
                            </button>
                          </div>
                        </S.CustomCalendarCard>
                      )}
                    </S.FormGroup>

                    <S.FormGroup>
                      <label>시술회차</label>
                      <S.CountGrid>
                        <div className="count-item">
                          <span className="label-text">현재</span>
                          <S.InputBoxWrapper>
                            <input
                              type="number"
                              placeholder="N"
                              value={item.currentCount}
                              onChange={(e) =>
                                updateProcedure(
                                  item.id,
                                  "currentCount",
                                  e.target.value,
                                )
                              }
                            />
                            <span className="unit">회</span>
                          </S.InputBoxWrapper>
                        </div>

                        <div className="count-item">
                          <span className="label-text">총</span>
                          <S.InputBoxWrapper>
                            <input
                              type="number"
                              placeholder="N"
                              value={item.totalCount}
                              onChange={(e) =>
                                updateProcedure(
                                  item.id,
                                  "totalCount",
                                  e.target.value,
                                )
                              }
                            />
                            <span className="unit">회</span>
                          </S.InputBoxWrapper>
                        </div>
                      </S.CountGrid>
                    </S.FormGroup>

                    <S.FormGroup>
                      <label>시술부위</label>
                      <S.PartsGrid>
                        {BODY_PARTS.map((part) => {
                          const isSelected = item.selectedParts.includes(part);
                          return (
                            <S.PartChip
                              key={part}
                              type="button"
                              $isSelected={isSelected}
                              onClick={() => togglePart(item.id, part)}
                            >
                              {part}
                            </S.PartChip>
                          );
                        })}
                      </S.PartsGrid>
                    </S.FormGroup>
                  </S.CardBody>
                )}
              </S.FormCard>
            );
          })}
        </S.FormCardGroup>

        <S.AddButton type="button" onClick={handleAddProcedure}>
          <img src="/assets/Add.svg" alt="시술 추가" /> 시술 추가
        </S.AddButton>

        <S.BottomArea>
          {isSaved && (
            <S.SavedNotice>
              <span className="check-icon">✓</span> 시술정보를 저장했어요
            </S.SavedNotice>
          )}

          <S.SubmitButton
            type="button"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
          >
            저장
          </S.SubmitButton>
        </S.BottomArea>
      </S.Container>
    </>
  );
};

export default NewProcedure;
