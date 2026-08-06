import React, { useState } from "react";
import * as S from "../styles/NewProcedure.styles";
import { NavBar } from "../components/NavBar";

interface ProcedureData {
  id: number;
  isOpen: boolean;
  type: string;
  date: string;
  currentCount: string;
  totalCount: string;
  selectedParts: string[];
}

const PROCEDURE_OPTIONS = [
  "여드름 압출",
  "레이저 토닝",
  "피코 토닝",
  "필링 케어",
  "기타",
];
const BODY_PARTS = ["얼굴 전체", "T존", "나비존", "턱", "볼"];
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

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDateStr = `${currentYear}.${String(currentMonth).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [tempSelectedDate, setTempSelectedDate] =
    useState<string>(currentDateStr);

  const [isSaved, setIsSaved] = useState(false);

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

  const handleConfirmDate = (id: number) => {
    updateProcedure(id, "date", tempSelectedDate);
    setOpenDatePickerId(null);
  };

  const handleSubmit = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
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
                          className={`select-header ${!item.type ? "placeholder" : ""}`}
                          onClick={() => {
                            setOpenSelectId(
                              openSelectId === item.id ? null : item.id,
                            );
                            setOpenDatePickerId(null);
                          }}
                        >
                          <span>{item.type || "시술 종류를 선택하세요"}</span>
                          <img
                            className={`dropdown-icon ${openSelectId === item.id ? "open" : ""}`}
                            src="/assets/ChevronDown.svg"
                            alt="선택"
                          />
                        </div>

                        {openSelectId === item.id && (
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
                        onClick={() => {
                          setOpenDatePickerId(
                            openDatePickerId === item.id ? null : item.id,
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
                      {openDatePickerId === item.id && (
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
                                const isSelected =
                                  tempSelectedDate === formattedDate;

                                cells.push(
                                  <S.DayCell
                                    key={`curr-${d}`}
                                    type="button"
                                    $isCurrentMonth={true}
                                    $isSelected={isSelected}
                                    onClick={() =>
                                      setTempSelectedDate(formattedDate)
                                    }
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
                              onClick={() => setOpenDatePickerId(null)}
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              className="confirm-btn"
                              onClick={() => handleConfirmDate(item.id)}
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

        {isSaved && (
          <S.SavedNotice>
            <span className="check-icon">✓</span> 시술정보를 저장했어요
          </S.SavedNotice>
        )}

        <S.SubmitButton type="button" onClick={handleSubmit}>
          저장
        </S.SubmitButton>
      </S.Container>
    </>
  );
};

export default NewProcedure;
