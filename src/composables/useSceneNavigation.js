import { computed, ref } from "vue";
import { useIndexedFocus } from "./useIndexedFocus";

// Owns icon-carousel focus, detail state, and compact-mode drag navigation.
export function useSceneNavigation(
  iconDefinitions,
  isCompact,
  initialOpenedIconId = null,
) {
  const focus = useIndexedFocus(iconDefinitions.length);
  const {
    focusedIndex: activeIndex,
    hoveredIndex,
    hasKeyboardFocus: showSelectionFocus,
  } = focus;
  const hoveredIcon = computed(
    () => iconDefinitions[hoveredIndex.value]?.id ?? null,
  );
  const openedIconId = ref(initialOpenedIconId);

  const isDetailOpen = computed(() => Boolean(openedIconId.value));

  const carouselSpacing = 7;
  const dragCommitThresholdPx = 40;
  const dragStartThresholdPx = 8;
  const dragOffset = ref(0);
  const isDragging = ref(false);
  let dragStartX = null;
  let dragPointerId = null;
  let dragTravelPx = 1;
  let dragTarget = null;

  function selectIcon(index) {
    focus.setFocusedIndex(index);
  }

  function getFocusedIconIndex() {
    if (isDetailOpen.value) {
      return -1;
    }

    if (isCompact.value) {
      return activeIndex.value;
    }

    return focus.getFocusedIndex();
  }

  // a given icon is "focused" whenever it's the one getFocusedIconIndex resolves to
  function isIconFocused(index) {
    return getFocusedIconIndex() === index;
  }

  function moveSelection(step) {
    if (isDetailOpen.value) {
      return;
    }

    focus.moveFocus(step, getFocusedIconIndex());
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
    focus.clearFocus();
    endDrag();
    openedIconId.value = iconDefinitions[index]?.id ?? null;
  }

  function closeDetail() {
    focus.clearFocus();
    openedIconId.value = null;
  }

  function handleHoverChange(iconId, hovered) {
    const index = iconDefinitions.findIndex((icon) => icon.id === iconId);
    focus.setHoveredIndex(index, hovered && index !== -1);
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
    dragTarget = event.currentTarget;

    const rect = event.currentTarget.getBoundingClientRect();
    dragTravelPx = Math.max(rect.width * 0.5, 120);
  }

  function handleDragMove(event) {
    if (dragStartX === null || event.pointerId !== dragPointerId) {
      return;
    }

    const deltaPx = event.clientX - dragStartX;

    if (!isDragging.value) {
      if (Math.abs(deltaPx) < dragStartThresholdPx) {
        return;
      }

      isDragging.value = true;
      dragTarget?.setPointerCapture?.(event.pointerId);
    }

    const rawOffset = (deltaPx / dragTravelPx) * carouselSpacing;

    dragOffset.value = Math.max(
      -carouselSpacing,
      Math.min(carouselSpacing, rawOffset),
    );
  }

  function endDrag() {
    dragStartX = null;
    dragPointerId = null;
    dragTarget = null;
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
