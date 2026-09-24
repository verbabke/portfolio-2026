import { computed } from "vue";

const carouselViewHeight = 15;

// Derives per-icon screen position/opacity and HTML label placement from the
// current navigation state (compact carousel vs. landscape vs. detail view).
export function useIconLayout({
  iconDefinitions,
  isCompact,
  isDetailOpen,
  openedIconId,
  activeIndex,
  dragOffset,
  carouselSpacing,
  cameraFrame,
}) {
  // active icon sits at x=0, neighbors peek out on either side, dragOffset just nudges all of it while swiping
  function getCarouselPosition(icon, index) {
    const slotOffset = (index - activeIndex.value) * carouselSpacing;
    return [slotOffset + dragOffset.value, icon.compactOffsetY ?? 0, 0];
  }

  function getDetailIconPosition(icon) {
    return isCompact.value
      ? (icon.compactDetailPosition ?? [-1.35, 0, 0])
      : (icon.detailPosition ?? [-4.35, 0, 0]);
  }

  function getDismissedIconPosition(icon, index) {
    return isCompact.value
      ? [
          getCarouselPosition(icon, index)[0],
          getCarouselPosition(icon, index)[1] - 0.3,
          -0.15,
        ]
      : [icon.landscapePosition[0], icon.landscapePosition[1] - 0.35, -0.15];
  }

  const icons = computed(() =>
    iconDefinitions.map((icon, index) => ({
      ...icon,
      isInteractive: !isDetailOpen.value || icon.id === openedIconId.value,
      position: isDetailOpen.value
        ? icon.id === openedIconId.value
          ? getDetailIconPosition(icon)
          : getDismissedIconPosition(icon, index)
        : isCompact.value
          ? getCarouselPosition(icon, index)
          : icon.landscapePosition,
      visualScale: icon.scale,
      visualOpacity:
        isDetailOpen.value && icon.id !== openedIconId.value ? 0 : 1,
      opacityDamping:
        isDetailOpen.value && icon.id !== openedIconId.value ? 9 : 4.5,
    })),
  );

  const focusOverride = computed(() =>
    isCompact.value ? { viewHeight: carouselViewHeight, x: 0, y: 0 } : null,
  );

  function getLabelStyle(icon, index) {
    if (isCompact.value) {
      const compactStep = 34;
      const dragPercent = (dragOffset.value / carouselSpacing) * compactStep;
      const offsetPercent =
        (index - activeIndex.value) * compactStep +
        dragPercent +
        (icon.compactLabelOffset ?? 0);

      return {
        left: `calc(50% + ${offsetPercent}%)`,
        opacity: Math.abs(index - activeIndex.value) > 1 ? 0.45 : 1,
      };
    }

    // maps the icon's world x onto the camera's live horizontal frame so the
    // label stays under it even as the camera reframes across breakpoints
    const { left, right } = cameraFrame.value;
    const percent = ((icon.landscapePosition[0] - left) / (right - left)) * 100;

    return {
      left: `${percent}%`,
    };
  }

  return { icons, focusOverride, getLabelStyle };
}
