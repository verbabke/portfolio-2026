import { computed, ref, watch } from "vue";

// Matches the page fade, so the tiles leave with the list around them.
const tileFadeMs = 250;

// Maps the project panel's measured card layout (screen px) into scene-space
// tile props and the CSS backdrop box behind each tile.
export function useProjectTiles({ sceneElement, cameraFrame }) {
  const projectTileLayout = ref([]);
  // Outlives the layout while the tiles fade out, and starts hidden to fade in.
  const renderedLayout = ref([]);
  const isShown = ref(false);
  let hideTimer = 0;

  watch(projectTileLayout, (layout) => {
    clearTimeout(hideTimer);

    if (!layout.length) {
      isShown.value = false;
      hideTimer = setTimeout(() => {
        renderedLayout.value = [];
      }, tileFadeMs);
      return;
    }

    const wasEmpty = !renderedLayout.value.length;
    renderedLayout.value = layout;

    if (!wasEmpty) {
      isShown.value = true;
      return;
    }

    isShown.value = false;
    requestAnimationFrame(() => {
      isShown.value = true;
    });
  });

  const projectTileModels = computed(() => {
    const bounds = sceneElement.value?.getBoundingClientRect();
    const frame = cameraFrame.value;
    const frameHeight = frame.top - frame.bottom;

    if (!bounds?.height || !frameHeight) {
      return [];
    }

    const worldUnitsPerPixel = frameHeight / bounds.height;
    const toWorldX = (x) =>
      frame.left +
      ((x - bounds.left) / bounds.width) * (frame.right - frame.left);
    const toWorldY = (y) =>
      frame.top - ((y - bounds.top) / bounds.height) * frameHeight;

    return renderedLayout.value.map((tile) => ({
      ...tile,
      backdropOpacity: isShown.value ? tile.backdropOpacity : 0,
      iconOpacity: isShown.value ? tile.iconOpacity : 0,
      position: [
        toWorldX(tile.cardPositionX),
        toWorldY(tile.cardPositionY),
        tile.focused ? 1.5 : 0,
      ],
      iconOffset: [
        (tile.x - tile.cardPositionX) * worldUnitsPerPixel,
        -(tile.y - tile.cardPositionY) * worldUnitsPerPixel,
        0.2,
      ],
      scale: (tile.size * worldUnitsPerPixel) / 3.3,
      backdropStyle: {
        left: `${tile.cardPositionX - tile.cardWidth / 2 - bounds.left}px`,
        top: `${tile.cardPositionY - tile.cardHeight / 2 - bounds.top}px`,
        width: `${tile.cardWidth}px`,
        height: `${tile.cardHeight}px`,
        zIndex: tile.focused ? 1 : 0,
      },
    }));
  });

  return { projectTileLayout, projectTileModels };
}
