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
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";
import OrthographicFitCamera from "./OrthographicFitCamera.vue";
import HomeIcon from "./home/HomeIcon.vue";
import HomeIconLabel from "./home/HomeIconLabel.vue";
import HomeCarouselControls from "./home/HomeCarouselControls.vue";
import Taskbar from "./Taskbar.vue";
import FadeTransition from "./FadeTransition.vue";
import SectionPage from "./SectionPage.vue";
import ProjectSelectionPanel from "./project/ProjectSelectionPanel.vue";
import ProjectTileIcon from "./project/ProjectTileIcon.vue";
import { iconDefinitions } from "../data/portfolioIcons";
import { portfolioPages } from "../data/portfolioPages";
import { useSceneNavigation } from "../composables/useSceneNavigation";
import { useIconLayout } from "../composables/useIconLayout";
import { useProjectTiles } from "../composables/useProjectTiles";
import { useProjectTabs } from "../composables/useProjectTabs";

extend({
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
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
const screenColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--screen-bg")
  .trim();
const aspectRatio = ref(1);
const isCompact = computed(() => aspectRatio.value < compactAspectThreshold);
const cameraFrame = ref({ left: -8, right: 8, top: 8, bottom: -8 });
const sceneElement = ref(null);

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
  activateFocusedIcon: activateMenuIcon,
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

const { projectTileLayout, projectTileModels } = useProjectTiles({
  sceneElement,
  cameraFrame,
});

const { tabs, activeProjectIndex, openProject, closeProject, showList } =
  useProjectTabs();

// Leaving Projects returns it to the list
// The tabs stay open
watch(openedIconId, (id, previous) => {
  if (previous === "projects" && id !== "projects") {
    showList();
  }
});

function selectProjectTab(index) {
  if (openedIconId.value !== "projects") {
    handleIconSelect(
      iconDefinitions.findIndex((icon) => icon.id === "projects"),
    );
  }

  openProject(index);
}

function setIconRef(id, instance) {
  if (instance) {
    iconRefs.set(id, instance);
    return;
  }

  iconRefs.delete(id);
}

function getSceneObjects() {
  return iconDefinitions
    .map((icon) => {
      const instance = iconRefs.get(icon.id);
      const position = instance?.getObject3D?.()?.position;

      if (!position) return null;

      return {
        getBounds() {
          const bounds = instance.getBounds();
          if (!bounds) return null;

          const dx = icon.landscapePosition[0] - position.x;
          const dy = icon.landscapePosition[1] - position.y;

          return {
            minX: bounds.minX + dx,
            maxX: bounds.maxX + dx,
            minY: bounds.minY + dy,
            maxY: bounds.maxY + dy,
          };
        },
      };
    })
    .filter(Boolean);
}

// dismissed icons/labels fade out over 200ms
// hold position/reveal changes until that fade-out has finished so labels never shift while still visible
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
function activateFocusedIcon() {
  if (openedIconId.value === "projects") {
    projectPanel.value?.openFocusedProject();
    return;
  }

  activateMenuIcon();
}

// Return goes from an open project back to the list, then out of the section.
function handleBack() {
  if (openedIconId.value === "projects" && activeProjectIndex.value >= 0) {
    showList();
    return;
  }

  closeDetail();
}

function handleDirection(direction) {
  if (openedIconId.value === "projects") {
    projectPanel.value?.handleDirection(direction);
    return;
  }

  if (direction === "left") {
    selectPrevious();
  } else if (direction === "right") {
    selectNext();
  }
}

defineExpose({
  activateFocusedIcon,
  closeDetail,
  handleBack,
  selectPrevious,
  selectNext,
  handleDirection,
});
</script>

<template>
  <div
    ref="sceneElement"
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
    <div
      v-for="tile in projectTileModels"
      :key="`${tile.id}-backdrop`"
      class="project-focus-backdrop ui-panel"
      :style="{ ...tile.backdropStyle, opacity: tile.backdropOpacity }"
      aria-hidden="true"
    />

    <TresCanvas
      class="scene-canvas"
      :clear-color="screenColor"
      :alpha="true"
      :clear-alpha="0"
      :fps-limit="30"
    >
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

      <HomeIcon
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
        :interactive="
          icon.isInteractive &&
          (openedIconId !== 'projects' || activeProjectIndex < 0)
        "
        :spin-while-hovered="!isDetailOpen"
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

      <ProjectTileIcon
        v-for="tile in projectTileModels"
        :key="tile.id"
        :position="tile.position"
        :icon-offset="tile.iconOffset"
        :scale="tile.scale"
        :color="tile.color"
        :text-color="tile.textColor"
        :mark="tile.mark"
        :focused="tile.focused"
        :opacity="tile.iconOpacity"
        :float-delay="tile.floatDelay"
      />

      <EffectComposerPmndrs>
        <PixelationPmndrs :granularity="pixelSize" />
        <HueSaturationPmndrs :saturation="0.2" />
        <BrightnessContrastPmndrs :brightness="0.05" :contrast="0.13" />
      </EffectComposerPmndrs>
    </TresCanvas>

    <HomeIconLabel
      :icons="icons"
      :is-detail-open="isDetailOpen"
      :opened-icon-id="openedIconId"
      :is-revealing-detail="isRevealingDetail"
      :is-position-settled="isPositionSettled"
      :is-compact="isCompact"
      :is-icon-focused="isIconFocused"
      :get-label-style="getLabelStyle"
    />

    <HomeCarouselControls
      v-if="isCompact && !isDetailOpen"
      :icons="icons"
      :active-index="activeIndex"
      @select="selectIcon"
      @previous="selectPrevious"
      @next="selectNext"
    />

    <FadeTransition>
      <SectionPage
        v-if="isRevealingDetail && openedIconId && openedIconId !== 'projects'"
        :page="portfolioPages[openedIconId]"
        :compact="isCompact"
        @home="closeDetail"
      />
    </FadeTransition>

    <ProjectSelectionPanel
      ref="projectPanel"
      :visible="isRevealingDetail && openedIconId === 'projects'"
      :compact="isCompact"
      :project-index="activeProjectIndex"
      @tile-layout="projectTileLayout = $event"
      @open="openProject"
      @home="closeDetail"
      @list="showList"
    />
  </div>

  <Taskbar
    v-show="visible"
    :tabs="tabs"
    :active-index="activeProjectIndex"
    @back="closeDetail"
    @select="selectProjectTab"
    @close="closeProject"
  />
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.scene {
  position: absolute;
  inset: 0 0 var(--header-height) 0;
  visibility: hidden;
  font-family: "Press Start 2P", monospace;
}

.section-path {
  position: absolute;
  top: var(--screen-pad);
  left: var(--screen-pad);
  z-index: 5;
}

.project-focus-backdrop {
  position: absolute;
  z-index: 0;
  background: var(--ui-bg);
  pointer-events: none;
  transition:
    left 300ms cubic-bezier(0.2, 0.75, 0.25, 1),
    top 300ms cubic-bezier(0.2, 0.75, 0.25, 1),
    width 300ms cubic-bezier(0.2, 0.75, 0.25, 1),
    height 300ms cubic-bezier(0.2, 0.75, 0.25, 1),
    opacity 300ms ease;
}

.scene-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
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
