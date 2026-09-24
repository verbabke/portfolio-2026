import { computed, ref } from "vue";

// Owns hover/focus/detail/drag state and the d-pad + pointer navigation rules
// shared between the carousel and the detail view.
export function useSceneNavigation(iconDefinitions, isCompact) {
  const hoveredIcon = ref(null);
  const activeIndex = ref(0);
  const showSelectionFocus = ref(false);
  const openedIconId = ref(null);

  const isDetailOpen = computed(() => Boolean(openedIconId.value));

  const carouselSpacing = 7;
  const dragCommitThresholdPx = 40;
  const dragOffset = ref(0);
  const isDragging = ref(false);
  let dragStartX = null;
  let dragPointerId = null;
  let dragTravelPx = 1;

  function selectIcon(index) {
    activeIndex.value = Math.max(
      0,
      Math.min(index, iconDefinitions.length - 1),
    );
    showSelectionFocus.value = true;
  }

  function getFocusedIconIndex() {
    if (isDetailOpen.value) {
      return -1;
    }

    if (isCompact.value) {
      return activeIndex.value;
    }

    if (hoveredIcon.value) {
      return iconDefinitions.findIndex((icon) => icon.id === hoveredIcon.value);
    }

    if (showSelectionFocus.value) {
      return activeIndex.value;
    }

    return -1;
  }

  // a given icon is "focused" whenever it's the one getFocusedIconIndex resolves to
  function isIconFocused(index) {
    return getFocusedIconIndex() === index;
  }

  function moveSelection(step) {
    if (isDetailOpen.value) {
      return;
    }

    hoveredIcon.value = null;

    if (getFocusedIconIndex() === -1) {
      selectIcon(0);
      return;
    }

    selectIcon(activeIndex.value + step);
  }

  function selectPrevious() {
    moveSelection(-1);
  }

  function selectNext() {
    moveSelection(1);
  }

  function activateFocusedIcon() {
    const focusedIndex = getFocusedIconIndex();

    if (focusedIndex === -1) {
      return;
    }

    handleIconSelect(focusedIndex);
  }

  function openDetail(index) {
    selectIcon(index);
    hoveredIcon.value = null;
    showSelectionFocus.value = false;
    endDrag();
    openedIconId.value = iconDefinitions[index]?.id ?? null;
  }

  function closeDetail() {
    hoveredIcon.value = null;
    showSelectionFocus.value = false;
    openedIconId.value = null;
  }

  function handleHoverChange(iconId, hovered) {
    hoveredIcon.value = hovered ? iconId : null;

    if (hovered) {
      showSelectionFocus.value = false;
    }
  }

  function handleIconSelect(index) {
    const selectedId = iconDefinitions[index]?.id ?? null;

    if (isDetailOpen.value && selectedId === openedIconId.value) {
      closeDetail();
      return;
    }

    openDetail(index);
  }

  // drag/swipe nav, mouse or touch, only matters in compact mode
  function handleDragStart(event) {
    if (!isCompact.value || isDetailOpen.value) {
      return;
    }

    dragStartX = event.clientX;
    dragPointerId = event.pointerId;
    isDragging.value = true;

    const rect = event.currentTarget.getBoundingClientRect();
    dragTravelPx = Math.max(rect.width * 0.5, 120);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handleDragMove(event) {
    if (dragStartX === null || event.pointerId !== dragPointerId) {
      return;
    }

    const deltaPx = event.clientX - dragStartX;
    const rawOffset = (deltaPx / dragTravelPx) * carouselSpacing;

    dragOffset.value = Math.max(
      -carouselSpacing,
      Math.min(carouselSpacing, rawOffset),
    );
  }

  function endDrag() {
    dragStartX = null;
    dragPointerId = null;
    isDragging.value = false;
    dragOffset.value = 0;
  }

  function handleDragEnd(event) {
    if (dragStartX === null) {
      return;
    }

    const deltaPx = event.clientX - dragStartX;
    endDrag();

    if (Math.abs(deltaPx) < dragCommitThresholdPx) {
      return;
    }

    if (deltaPx < 0) {
      selectNext();
    } else {
      selectPrevious();
    }
  }

  return {
    hoveredIcon,
    activeIndex,
    showSelectionFocus,
    openedIconId,
    isDetailOpen,
    dragOffset,
    isDragging,
    carouselSpacing,
    selectIcon,
    selectPrevious,
    selectNext,
    activateFocusedIcon,
    closeDetail,
    handleHoverChange,
    handleIconSelect,
    isIconFocused,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel: endDrag,
  };
}
