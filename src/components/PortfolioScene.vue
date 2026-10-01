<script setup>
import { computed, ref, watch } from "vue";
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
import IconLabelLayer from "./IconLabelLayer.vue";
import CarouselControls from "./CarouselControls.vue";
import ProjectSelectionPanel from "./ProjectSelectionPanel.vue";
import { iconDefinitions } from "../data/portfolioIcons";
import { useSceneNavigation } from "../composables/useSceneNavigation";
import { useIconLayout } from "../composables/useIconLayout";

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
const iconRefs = new Map();

const compactAspectThreshold = 1.1;
const aspectRatio = ref(1);
const isCompact = computed(() => aspectRatio.value < compactAspectThreshold);
const cameraFrame = ref({ left: -8, right: 8 });

const {
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
  handleDragCancel,
} = useSceneNavigation(iconDefinitions, isCompact);

const { icons, focusOverride, getLabelStyle } = useIconLayout({
  iconDefinitions,
  isCompact,
  isDetailOpen,
  openedIconId,
  activeIndex,
  dragOffset,
  carouselSpacing,
  cameraFrame,
});

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

// dismissed icons/labels fade out over 180ms; hold position/reveal changes
// until that fade-out has finished so labels never shift while still visible
const detailFadeOutMs = 200;
const isPositionSettled = ref(true);
let settleTimer = null;

watch(isDetailOpen, () => {
  clearTimeout(settleTimer);
  isPositionSettled.value = false;
  settleTimer = setTimeout(() => {
    isPositionSettled.value = true;
  }, detailFadeOutMs);
});

const isRevealingDetail = computed(
  () => isDetailOpen.value && isPositionSettled.value,
);

const projectPanel = ref(null);

function handleVerticalDirection(direction) {
  if (openedIconId.value !== "folder" || !projectPanel.value) {
    return;
  }

  if (direction === "top") {
    projectPanel.value.focusPrevious();
  } else if (direction === "bottom") {
    projectPanel.value.focusNext();
  }
}

defineExpose({
  activateFocusedIcon,
  closeDetail,
  selectPrevious,
  selectNext,
  handleVerticalDirection,
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
    <TresCanvas clear-color="#c7e4db" :fps-limit="30">
      <OrthographicFitCamera
        :visible="visible"
        :ready="ready"
        :get-scene-objects="getSceneObjects"
        :focus-override="focusOverride"
        @aspect-change="aspectRatio = $event"
        @frame-change="cameraFrame = $event"
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
                : hoveredIcon === icon.id ||
                  (showSelectionFocus && index === activeIndex)
        "
        :interactive="icon.isInteractive"
        :focused="isIconFocused(index)"
        :focus-frame-offset="icon.focusFrameOffset"
        :opacity="icon.visualOpacity"
        :opacity-damping="icon.opacityDamping"
        :path="icon.path"
        :position="icon.position"
        :float-delay="icon.floatDelay"
        :scale="icon.visualScale"
        :hit-offset-y="icon.hitOffsetY"
        @hover-change="(hovered) => handleHoverChange(icon.id, hovered)"
        @select="handleIconSelect(index)"
      />

      <EffectComposerPmndrs>
        <PixelationPmndrs :granularity="pixelSize" />
        <HueSaturationPmndrs :saturation="0.2" />
        <BrightnessContrastPmndrs :brightness="0.05" :contrast="0.13" />
      </EffectComposerPmndrs>
    </TresCanvas>

    <IconLabelLayer
      :icons="icons"
      :is-detail-open="isDetailOpen"
      :opened-icon-id="openedIconId"
      :is-revealing-detail="isRevealingDetail"
      :is-position-settled="isPositionSettled"
      :is-compact="isCompact"
      :is-icon-focused="isIconFocused"
      :get-label-style="getLabelStyle"
    />

    <CarouselControls
      v-if="isCompact && !isDetailOpen"
      :icons="icons"
      :active-index="activeIndex"
      @select="selectIcon"
      @previous="selectPrevious"
      @next="selectNext"
    />

    <ProjectSelectionPanel
      ref="projectPanel"
      :visible="isRevealingDetail && openedIconId === 'folder'"
    />

    <button
      v-if="isDetailOpen"
      type="button"
      class="return-btn nes-btn nes-btn-compact nes-cursor-pointer"
      aria-label="Return"
      @click="closeDetail"
    >
      Return
    </button>
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

.return-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  text-transform: uppercase;
}
</style>
