import { ref } from "vue";

export function useIndexedFocus(itemCount) {
  const focusedIndex = ref(0);
  const hoveredIndex = ref(null);
  const hasKeyboardFocus = ref(false);

  function setFocusedIndex(index) {
    focusedIndex.value = itemCount
      ? Math.max(0, Math.min(index, itemCount - 1))
      : -1;
    hoveredIndex.value = null;
    hasKeyboardFocus.value = itemCount > 0;
    return focusedIndex.value;
  }

  function getFocusedIndex() {
    if (hoveredIndex.value !== null) {
      return hoveredIndex.value;
    }

    return hasKeyboardFocus.value ? focusedIndex.value : -1;
  }

  function moveFocus(step, currentIndex = getFocusedIndex()) {
    return setFocusedIndex(currentIndex < 0 ? 0 : currentIndex + step);
  }

  function setHoveredIndex(index, hovered) {
    hoveredIndex.value = hovered ? index : null;
    if (hovered) {
      hasKeyboardFocus.value = false;
    }
  }

  function clearFocus() {
    hoveredIndex.value = null;
    hasKeyboardFocus.value = false;
  }

  return {
    focusedIndex,
    hoveredIndex,
    hasKeyboardFocus,
    getFocusedIndex,
    setFocusedIndex,
    moveFocus,
    setHoveredIndex,
    clearFocus,
  };
}
