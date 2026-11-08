import { onBeforeUnmount } from "vue";

const dragThresholdPx = 6;
const wheelSettleMs = 180;

export function useSnapScrollList({ listRef, itemRefs, isEnabled, onSettle }) {
  let activePointerId = null;
  let isDragging = false;
  let suppressClick = false;
  let startY = 0;
  let startScrollTop = 0;
  let wheelEndTimer = null;

  function scrollItemIntoCenter(index, smooth = true) {
    const list = listRef.value;
    const item = itemRefs.get(index);

    if (list && item) {
      list.scrollTo({
        top: item.offsetTop + item.offsetHeight / 2 - list.clientHeight / 2,
        behavior: smooth ? "smooth" : "instant",
      });
    }
  }

  function settle() {
    const list = listRef.value;

    if (!list) {
      return;
    }

    const center = list.scrollTop + list.clientHeight / 2;
    let closestIndex = -1;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const [index, item] of itemRefs) {
      const distance = Math.abs(
        item.offsetTop + item.offsetHeight / 2 - center,
      );

      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    }

    if (closestIndex >= 0) {
      // Re-centre even when the nearest item is already the focused one.
      scrollItemIntoCenter(closestIndex);
      onSettle(closestIndex);
    }
  }

  // Inline (not a class) so it takes effect before the first scrollTop write of a gesture.
  function setFreeScroll(free) {
    const style = listRef.value?.style;

    if (style) {
      style.scrollBehavior = free ? "auto" : "";
      style.scrollSnapType = free ? "none" : "";
    }
  }

  function onPointerDown(event) {
    const list = listRef.value;

    if (
      !list ||
      !isEnabled() ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    activePointerId = event.pointerId;
    isDragging = false;
    suppressClick = false;
    startY = event.clientY;
    startScrollTop = list.scrollTop;
    setFreeScroll(true);

    // Capturing on the item keeps its click event targeted at the item.
    const item = event.target.closest?.("[data-snap-item]");
    (item ?? list).setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }

    const delta = event.clientY - startY;

    if (!isDragging && Math.abs(delta) < dragThresholdPx) {
      return;
    }

    isDragging = true;
    event.preventDefault();
    listRef.value.scrollTop = startScrollTop - delta;
  }

  function onPointerEnd(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }

    activePointerId = null;
    setFreeScroll(false);

    if (isDragging) {
      suppressClick = true;
      settle();
    }
  }

  function onWheel(event) {
    const list = listRef.value;

    if (!list || !isEnabled() || event.deltaY === 0) {
      return;
    }

    event.preventDefault();
    setFreeScroll(true);

    const unit =
      event.deltaMode === 1
        ? 40
        : event.deltaMode === 2
          ? list.clientHeight
          : 1;
    list.scrollTop += event.deltaY * unit;

    clearTimeout(wheelEndTimer);
    wheelEndTimer = setTimeout(() => {
      setFreeScroll(false);
      settle();
    }, wheelSettleMs);
  }

  // True once after a drag, so the click that follows its release is ignored.
  function consumeClickSuppression() {
    const suppressed = suppressClick;
    suppressClick = false;
    return suppressed;
  }

  onBeforeUnmount(() => clearTimeout(wheelEndTimer));

  return {
    scrollItemIntoCenter,
    consumeClickSuppression,
    isPointerActive: () => activePointerId !== null,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    onWheel,
  };
}
