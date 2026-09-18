<script setup>
import { computed, ref } from "vue";
import { TresCanvas, extend } from "@tresjs/core";
import {
  BrightnessContrastPmndrs,
  EffectComposerPmndrs,
  HueSaturationPmndrs,
  PixelationPmndrs,
} from "@tresjs/post-processing";
import {
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
} from "three";
import OrthographicFitCamera from "./OrthographicFitCamera.vue";
import SceneIcon from "./SceneIcon.vue";

extend({
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  ready: {
    type: Boolean,
    default: false,
  },
});

const pixelSize = 4;
const hoveredIcon = ref(null);
const iconRefs = new Map();

const compactAspectThreshold = 1.1;
const carouselSpacing = 7;
const carouselViewHeight = 15;
const aspectRatio = ref(1);
const activeIndex = ref(0);
const isCompact = computed(() => aspectRatio.value < compactAspectThreshold);
const openedIconId = ref(null);
const iconDefinitions = [
  {
    id: "profile",
    path: "/models/profile.glb",
    landscapePosition: [-10, 0, 0],
    compactOffsetY: 1.6,
    detailPosition: [-12, -0.95, 0],
    compactDetailPosition: [-1.35, -0.45, 0],
    floatDelay: 0,
    scale: 1.3,
  },
  {
    id: "folder",
    path: "/models/folder.glb",
    landscapePosition: [0, -1.5, 0],
    detailPosition: [-12, -2.3, 0],
    compactDetailPosition: [-1.2, 0.35, 0],
    floatDelay: 2,
    scale: 1,
  },
  {
    id: "envelope",
    path: "/models/envelope.glb",
    landscapePosition: [10, -1, 0],
    detailPosition: [-12, -1.85, 0],
    compactDetailPosition: [-1.28, 0.1, 0],
    floatDelay: 4,
    scale: 1,
  },
];

const isDetailOpen = computed(() => Boolean(openedIconId.value));

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

// active icon sits at x=0, neighbors peek out on either side, dragOffset just nudges all of it while swiping
function getCarouselPosition(icon, index) {
  const slotOffset = (index - activeIndex.value) * carouselSpacing;
  return [slotOffset + dragOffset.value, icon.compactOffsetY ?? 0, 0];
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
    visualOpacity: isDetailOpen.value && icon.id !== openedIconId.value ? 0 : 1,
    opacityDamping:
      isDetailOpen.value && icon.id !== openedIconId.value ? 9 : 4.5,
  })),
);
const focusOverride = computed(() =>
  isCompact.value ? { viewHeight: carouselViewHeight, x: 0, y: 0 } : null,
);

function setIconRef(id, instance) {
  if (instance) {
    iconRefs.set(id, instance);
    return;
  }

  iconRefs.delete(id);
}

function getSceneObjects() {
  return icons.value.map((icon) => iconRefs.get(icon.id)).filter(Boolean);
}

// carousel selection
function selectIcon(index) {
  activeIndex.value = Math.max(0, Math.min(index, iconDefinitions.length - 1));
}

function selectPrevious() {
  if (isDetailOpen.value) {
    return;
  }

  selectIcon(activeIndex.value - 1);
}

function selectNext() {
  if (isDetailOpen.value) {
    return;
  }

  selectIcon(activeIndex.value + 1);
}

function openDetail(index) {
  selectIcon(index);
  hoveredIcon.value = null;
  endDrag();
  openedIconId.value = iconDefinitions[index]?.id ?? null;
}

function closeDetail() {
  hoveredIcon.value = null;
  openedIconId.value = null;
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
const dragCommitThresholdPx = 40;
const dragOffset = ref(0);
const isDragging = ref(false);
let dragStartX = null;
let dragPointerId = null;
let dragTravelPx = 1;

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

function handleDragCancel() {
  endDrag();
}

defineExpose({
  closeDetail,
  selectPrevious,
  selectNext,
});
</script>

<template>
  <div
    class="scene"
    :class="{
      'scene-visible': visible,
      'scene-compact': isCompact,
      'scene-dragging': isDragging,
    }"
    @pointerdown="handleDragStart"
    @pointermove="handleDragMove"
    @pointerup="handleDragEnd"
    @pointercancel="handleDragCancel"
  >
    <TresCanvas clear-color="#a9ebd4" :fps-limit="30">
      <OrthographicFitCamera
        :visible="visible"
        :ready="ready"
        :get-scene-objects="getSceneObjects"
        :focus-override="focusOverride"
        @aspect-change="aspectRatio = $event"
      />
      <TresAmbientLight :intensity="1.25" />
      <TresDirectionalLight :position="[3, 5, 4]" :intensity="1.75" />

      <SceneIcon
        v-for="(icon, index) in icons"
        :ref="(instance) => setIconRef(icon.id, instance)"
        :key="icon.id"
        :hovered="
          isDetailOpen
            ? icon.id === openedIconId
            : !icon.isInteractive
              ? false
              : isCompact
                ? index === activeIndex
                : hoveredIcon === icon.id
        "
        :interactive="icon.isInteractive"
        :opacity="icon.visualOpacity"
        :opacity-damping="icon.opacityDamping"
        :path="icon.path"
        :position="icon.position"
        :float-delay="icon.floatDelay"
        :scale="icon.visualScale"
        @hover-change="(hovered) => (hoveredIcon = hovered ? icon.id : null)"
        @select="handleIconSelect(index)"
      />

      <EffectComposerPmndrs>
        <PixelationPmndrs :granularity="pixelSize" />
        <HueSaturationPmndrs :saturation="0.2" />
        <BrightnessContrastPmndrs :brightness="0.05" :contrast="0.13" />
      </EffectComposerPmndrs>
    </TresCanvas>

    <div
      v-if="isCompact && !isDetailOpen"
      class="carousel-controls"
      @pointerdown.stop
      @pointermove.stop
      @pointerup.stop
    >
      <button
        type="button"
        class="nes-btn is-success"
        aria-label="Previous"
        @click="selectPrevious"
      >
        Prev
      </button>

      <div class="carousel-indicator" role="group" aria-label="Carousel items">
        <button
          v-for="(icon, index) in icons"
          :key="icon.id"
          type="button"
          class="nes-btn"
          :class="index === activeIndex ? 'is-primary' : ''"
          :aria-label="`Show ${icon.id}`"
          :aria-pressed="index === activeIndex"
          @click="selectIcon(index)"
        >
          {{ index + 1 }}
        </button>
      </div>

      <button
        type="button"
        class="nes-btn is-success"
        aria-label="Next"
        @click="selectNext"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.scene {
  position: absolute;
  inset: 0;
  visibility: hidden;
  font-family: "Press Start 2P", monospace;
}

.scene-visible {
  visibility: visible;
}

.scene-compact {
  touch-action: pan-y;
  cursor: grab;
}

.scene-dragging {
  cursor: grabbing;
}

.carousel-controls {
  position: absolute;
  inset-inline: 0;
  bottom: clamp(10px, 4vw, 20px);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 3vw, 18px);
  pointer-events: none;
}

.carousel-controls > * {
  pointer-events: auto;
}

.carousel-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}
</style>
