import React, { useEffect, useState } from "react";
import * as S from "../styles/NewProcedure.styles";
import { NavBar } from "../components/NavBar";
import { procedureApi } from "../api/procedure";
import { courseApi } from "../api/course";
import { isAxiosError } from "axios";

interface ProcedureData {
  id: number;
  isOpen: boolean;
  type: string;
  date: string;
  currentCount: string;
  totalCount: string;
  selectedParts: string[];
  isNew?: boolean;
}

const PROCEDURE_MAP: Record<string, string> = {
  스케일링: "SCALING",
  피지파괴술: "PDT_PTT",
  "PDT/PTT": "PDT_PTT",
  "압출/염증주사": "EXTRACTION_INJECTION",
  레이저토닝: "IPL_LASER_TONING",
  "IPL/레이저토닝": "IPL_LASER_TONING",
};

const BODY_PART_MAP: Record<string, string> = {
  "얼굴 전체": "FULL_FACE",
  "전체 얼굴": "FULL_FACE",
  T존: "T_ZONE",
  나비존: "BUTTERFLY_ZONE",
  턱: "JAW",
  볼: "CHEEK",
};

const REVERSE_PROCEDURE_MAP: Record<string, string> = {
  SCALING: "스케일링",
  PDT_PTT: "PDT/PTT",
  EXTRACTION_INJECTION: "압출/염증주사",
  IPL_LASER_TONING: "IPL/레이저토닝",
};

const REVERSE_BODY_PART_MAP: Record<string, string> = {
  FULL_FACE: "얼굴 전체",
  T_ZONE: "T존",
  BUTTERFLY_ZONE: "나비존",
  JAW: "턱",
  CHEEK: "볼",
};

const PROCEDURE_OPTIONS = [
  "스케일링",
  "PDT/PTT",
  "압출/염증주사",
  "IPL/레이저토닝",
];
const BODY_PARTS = ["얼굴 전체", "T존", "나비존", "턱", "볼"];
const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

const NewProcedure: React.FC = () => {
  const [procedures, setProcedures] = useState<ProcedureData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [openSelectId, setOpenSelectId] = useState<number | null>(null);
  const [openDatePickerId, setOpenDatePickerId] = useState<number | null>(null);

  const [initialDate, setInitialDate] = useState<string>("");

  const [deleteTargetItem, setDeleteTargetItem] =
    useState<ProcedureData | null>(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDateSelectable = (year: number, month: number, day: number) => {
    const targetDate = new Date(year, month - 1, day);
    targetDate.setHours(0, 0, 0, 0);

    const maxDate = new Date(currentYear, currentMonth - 1, currentDate);
    maxDate.setHours(0, 0, 0, 0);

    const minDate = new Date(currentYear, currentMonth - 1, currentDate);
    minDate.setDate(minDate.getDate() - 6);
    minDate.setHours(0, 0, 0, 0);

    return targetDate >= minDate && targetDate <= maxDate;
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const currentCourse = await courseApi
          .getCurrentCourse()
          .catch(() => null);
        if (!isMounted) return;

        if (currentCourse && currentCourse.courseType === "FOCUS") {
          const data = await procedureApi
            .getCurrentProcedures()
            .catch(() => []);
          if (!isMounted) return;

          if (data && data.length > 0) {
            const sortedData = [...data].sort(
              (a, b) => Number(a.id) - Number(b.id),
            );

            const mappedList: ProcedureData[] = sortedData.map((item, idx) => {
              const displayType =
                REVERSE_PROCEDURE_MAP[item.procedureType] ||
                item.procedureTypeName ||
                item.procedureType;

              return {
                id: item.id,
                isOpen: idx === sortedData.length - 1,
                type: displayType,
                date: item.procedureDate
                  ? item.procedureDate.replace(/-/g, ".")
                  : "",
                currentCount: String(item.currentCount ?? ""),
                totalCount: String(item.totalCount ?? ""),
                selectedParts: (item.areas || []).map(
                  (area) => REVERSE_BODY_PART_MAP[area] || area,
                ),
                isNew: false,
              };
            });
            setProcedures(mappedList);
            return;
          }
        }

        setProcedures([
          {
            id: Date.now(),
            isOpen: true,
            type: "",
            date: "",
            currentCount: "",
            totalCount: "",
            selectedParts: [],
            isNew: true,
          },
        ]);
      } catch (error) {
        console.error("시술 정보 초기화 실패:", error);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const isFormValid =
    procedures.length > 0 &&
    procedures.every(
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
        isNew: true,
      },
    ]);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetItem) return;

    const target = deleteTargetItem;
    setDeleteTargetItem(null);

    if (target.isNew) {
      setProcedures((prev) => {
        const filtered = prev.filter((p) => p.id !== target.id);
        if (filtered.length > 0) {
          return filtered.map((item, idx) => ({
            ...item,
            isOpen: idx === filtered.length - 1,
          }));
        }
        return filtered;
      });
      return;
    }

    try {
      await procedureApi.deleteProcedure(target.id);
      setRefreshKey((prev) => prev + 1);
    } catch (error: unknown) {
      console.error("시술 정보 삭제 실패:", error);
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || "시술 삭제에 실패했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
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

    const existingProcedures = procedures.filter((p) => !p.isNew);
    const newProcedures = procedures.filter((p) => p.isNew);

    try {
      if (newProcedures.length > 0) {
        try {
          const currentCourse = await courseApi
            .getCurrentCourse()
            .catch(() => null);
          const currentCourseId =
            currentCourse?.courseId ??
            (currentCourse as unknown as { id?: number })?.id;

          if (!currentCourse || currentCourse.courseType !== "FOCUS") {
            if (currentCourseId) {
              await courseApi.endCourse(currentCourseId);
            }
            await courseApi.startCourse({ courseType: "FOCUS" });
          }
        } catch (courseError) {
          console.warn("집중 코스 전환 중 오류:", courseError);
          await courseApi.restartFocusCourse().catch(() => {});
        }
      }

      const promises: Promise<unknown>[] = [];

      existingProcedures.forEach((item) => {
        promises.push(
          procedureApi.updateProcedure(item.id, {
            procedureType: PROCEDURE_MAP[item.type] || item.type,
            procedureDate: item.date.replace(/\./g, "-"),
            currentCount: Number(item.currentCount),
            totalCount: Number(item.totalCount),
            areas: item.selectedParts.map(
              (part) => BODY_PART_MAP[part] || part,
            ),
          }),
        );
      });

      if (newProcedures.length > 0) {
        promises.push(
          procedureApi.createProcedures({
            procedures: newProcedures.map((item) => ({
              procedureType: PROCEDURE_MAP[item.type] || item.type,
              procedureDate: item.date.replace(/\./g, "-"),
              currentCount: Number(item.currentCount),
              totalCount: Number(item.totalCount),
              areas: item.selectedParts.map(
                (part) => BODY_PART_MAP[part] || part,
              ),
            })),
          }),
        );
      }

      await Promise.all(promises);

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);

      setRefreshKey((prev) => prev + 1);
    } catch (error: unknown) {
      console.error("시술 정보 저장 실패:", error);

      if (isAxiosError(error)) {
        alert(error.response?.data?.message || "시술 저장에 실패했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSingle = procedures.length === 1;

  return (
    <>
      <NavBar title="시술 정보 등록" />

      <S.Container>
        <S.FormCardGroup>
          {procedures.map((item, index) => {
            const hasValue = Boolean(item.type && item.type.trim() !== "");
            const displayText = hasValue
              ? item.type
              : isSingle
                ? "시술 이름"
                : "작성 중";

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
                      <>
                        시술 정보 -{" "}
                        <span className={hasValue ? "has-value" : "is-editing"}>
                          {displayText}
                        </span>
                      </>
                    ) : (
                      <>
                        시술 정보 {index + 1} -{" "}
                        <span className={hasValue ? "has-value" : "is-editing"}>
                          {displayText}
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
                      <label>시술 종류</label>
                      <S.SelectBox>
                        <div
                          className={`select-header ${
                            !item.type ? "placeholder" : ""
                          } ${isSelectOpen ? "focused" : ""}`}
                          onClick={() => {
                            setOpenSelectId(isSelectOpen ? null : item.id);
                            setOpenDatePickerId(null);
                          }}
                        >
                          <span>{item.type || "시술 종류를 선택하세요"}</span>
                          <img
                            className={`dropdown-icon ${
                              isSelectOpen ? "open" : ""
                            }`}
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
                      <label>시술 날짜</label>
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
                          className={`date-text ${
                            !item.date ? "placeholder" : ""
                          }`}
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
                                    disabled
                                    $isCurrentMonth={false}
                                    $isSelected={false}
                                    $isSelectable={false}
                                  >
                                    {dayNum}
                                  </S.DayCell>,
                                );
                              }

                              for (let d = 1; d <= totalDays; d++) {
                                const formattedDate = `${calendarYear}.${String(
                                  calendarMonth,
                                ).padStart(2, "0")}.${String(d).padStart(
                                  2,
                                  "0",
                                )}`;
                                const isSelected = item.date === formattedDate;
                                const isToday =
                                  calendarYear === currentYear &&
                                  calendarMonth === currentMonth &&
                                  d === currentDate;
                                const isSelectable = isDateSelectable(
                                  calendarYear,
                                  calendarMonth,
                                  d,
                                );

                                cells.push(
                                  <S.DayCell
                                    key={`curr-${d}`}
                                    type="button"
                                    disabled={!isSelectable}
                                    $isCurrentMonth={true}
                                    $isSelected={isSelected}
                                    $isToday={isToday}
                                    $isSelectable={isSelectable}
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
                                    disabled
                                    $isCurrentMonth={false}
                                    $isSelected={false}
                                    $isSelectable={false}
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
                      <label>시술 횟수</label>
                      <S.CountGrid>
                        <div className="count-item">
                          <span className="label-text">현재</span>
                          <S.InputBoxWrapper>
                            <input
                              type="number"
                              placeholder="N"
                              size={
                                item.currentCount
                                  ? Math.max(item.currentCount.length, 1)
                                  : 1
                              }
                              style={{
                                width: `${Math.max(
                                  item.currentCount
                                    ? item.currentCount.length
                                    : 1,
                                  1,
                                )}ch`,
                              }}
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
                              size={
                                item.totalCount
                                  ? Math.max(item.totalCount.length, 1)
                                  : 1
                              }
                              style={{
                                width: `${Math.max(
                                  item.totalCount ? item.totalCount.length : 1,
                                  1,
                                )}ch`,
                              }}
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
                      <label>시술 부위</label>
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

                    {!isSingle && (
                      <S.CardDeleteButton
                        type="button"
                        onClick={() => setDeleteTargetItem(item)}
                      >
                        <img src="/assets/Minus.svg" alt="시술 삭제" /> 시술
                        삭제
                      </S.CardDeleteButton>
                    )}
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

      {deleteTargetItem && (
        <S.ModalOverlay onClick={() => setDeleteTargetItem(null)}>
          <S.ModalCard onClick={(e) => e.stopPropagation()}>
            <h3>해당 시술 정보를 삭제하겠습니까?</h3>
            <p>삭제된 시술 정보는 되돌릴 수 없습니다</p>
            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setDeleteTargetItem(null)}
              >
                취소
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={handleConfirmDelete}
              >
                삭제
              </button>
            </div>
          </S.ModalCard>
        </S.ModalOverlay>
      )}
    </>
  );
};

export default NewProcedure;
