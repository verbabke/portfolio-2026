import { computed } from "vue";

const carouselViewHeight = 15;
// Where the docked icon sits across the screen
const detailIconScreenX = 0.17;

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
  // active icon sits at x=0,
  // neighbors peek out on either side
  // dragOffset just nudges all of it while swiping
  function getCarouselPosition(icon, index) {
    const slotOffset = (index - activeIndex.value) * carouselSpacing;
    return [slotOffset + dragOffset.value, icon.compactOffsetY ?? 0, 0];
  }

  function getDetailIconPosition(icon) {
    const { left, right } = cameraFrame.value;

    return [left + detailIconScreenX * (right - left), icon.detailY, 0];
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

  // On small screens the page covers the whole screen so icon just fades out.
  function isDocked(icon) {
    return (
      isDetailOpen.value && icon.id === openedIconId.value && !isCompact.value
    );
  }

  const icons = computed(() =>
    iconDefinitions.map((icon, index) => ({
      ...icon,
      isInteractive: !isDetailOpen.value || isDocked(icon),
      position: isDetailOpen.value
        ? isDocked(icon)
          ? getDetailIconPosition(icon)
          : getDismissedIconPosition(icon, index)
        : isCompact.value
          ? getCarouselPosition(icon, index)
          : icon.landscapePosition,
      visualScale: icon.scale,
      visualOpacity: isDetailOpen.value && !isDocked(icon) ? 0 : 1,
      opacityDamping: isDetailOpen.value && !isDocked(icon) ? 9 : 4.5,
    })),
  );

  const focusOverride = computed(() =>
    isCompact.value ? { viewHeight: carouselViewHeight, x: 0, y: 0 } : null,
  );

  // projects the icon's world x through the camera's live frame, so the label
  // stays under it across breakpoints and slides off screen along with it
  function getLabelStyle(icon) {
    const { left, right } = cameraFrame.value;
    const percent = ((icon.position[0] - left) / (right - left)) * 100;

    return { left: `${percent}%` };
  }

  return { icons, focusOverride, getLabelStyle };
}
