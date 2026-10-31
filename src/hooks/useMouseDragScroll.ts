import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

const DRAG_START_DISTANCE = 5;

/*
 * PC에서 가로 스크롤 영역을 마우스로 잡아 끌 수 있게 하는 훅
 * 터치는 건드리지 않고 브라우저 기본 스크롤에 맡긴다
 */
export function useMouseDragScroll<T extends HTMLElement>(
  containerRef: RefObject<T | null>
) {
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  function onPointerDown(event: ReactPointerEvent<T>) {
    const container = containerRef.current;

    hasDraggedRef.current = false;

    if (
      !container ||
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      container.scrollWidth <= container.clientWidth
    ) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startScrollLeftRef.current = container.scrollLeft;
  }

  function onPointerMove(event: ReactPointerEvent<T>) {
    const container = containerRef.current;

    if (!container || pointerIdRef.current !== event.pointerId) {
      return;
    }

    const moveX = event.clientX - startXRef.current;

    if (!hasDraggedRef.current) {
      if (Math.abs(moveX) < DRAG_START_DISTANCE) {
        return;
      }

      // 끌기가 시작된 뒤에 캡처해야 카드 안 버튼의 일반 클릭이 그대로 동작한다
      hasDraggedRef.current = true;

      container.setPointerCapture(event.pointerId);

      setIsDragging(true);
    }

    container.scrollLeft = startScrollLeftRef.current - moveX;
  }

  function finishDrag(event: ReactPointerEvent<T>) {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    const container = containerRef.current;

    if (container?.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }

    pointerIdRef.current = null;

    setIsDragging(false);
  }

  // 끌기를 끝내며 발생하는 클릭이 버튼을 누르지 않도록 막는다
  function onClickCapture(event: ReactMouseEvent<T>) {
    if (!hasDraggedRef.current) {
      return;
    }

    hasDraggedRef.current = false;

    event.preventDefault();
    event.stopPropagation();
  }

  function onDragStart(event: React.DragEvent<T>) {
    event.preventDefault();
  }

  return {
    isDragging,
    dragScrollHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onClickCapture,
      onDragStart,
    },
  };
}
