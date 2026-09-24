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
import IconLabelLayer from "./IconLabelLayer.vue";
import CarouselControls from "./CarouselControls.vue";
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

defineExpose({
  activateFocusedIcon,
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
</style>
