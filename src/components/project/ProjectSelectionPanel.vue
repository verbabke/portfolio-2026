<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { projects } from "../../data/projects";
import { useIndexedFocus } from "../../composables/useIndexedFocus";
import { useSnapScrollList } from "../../composables/useSnapScrollList";
import { projectMark, tileColor, tileTextColor } from "../../utils/projectTile";
import ProjectTile from "./ProjectTile.vue";
import ProjectDetail from "./ProjectDetail.vue";
import FadeTransition from "../FadeTransition.vue";
import Breadcrumb from "../Breadcrumb.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  // The project showing
  // -1 for the project list
  projectIndex: {
    type: Number,
    default: -1,
  },
});
const emit = defineEmits(["tile-layout", "open", "home", "list"]);

const focus = useIndexedFocus(projects.length);
const { focusedIndex } = focus;
const carouselRef = ref(null);
const detailRef = ref(null);
const selectedProject = computed(() => projects[props.projectIndex] ?? null);
const cardRefs = new Map();
let layoutFrame = 0;

const {
  scrollItemIntoCenter,
  consumeClickSuppression,
  isPointerActive,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
  onWheel,
} = useSnapScrollList({
  listRef: carouselRef,
  itemRefs: cardRefs,
  isEnabled: () => props.visible && !selectedProject.value,
  onSettle: (index) => {
    if (index !== focus.getFocusedIndex()) {
      focus.setFocusedIndex(index);
    }
  },
});

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      focus.setFocusedIndex(Math.max(props.projectIndex, 0));
      emitTileLayout();
      nextTick(() => scrollItemIntoCenter(focus.getFocusedIndex(), false));
    }
  },
);

watch(selectedProject, (project) => {
  if (!project) {
    nextTick(() => scrollItemIntoCenter(focus.getFocusedIndex(), false));
  }
});

function isItemFocused(index) {
  return focus.getFocusedIndex() === index;
}

function activeIndex() {
  const focused = focus.getFocusedIndex();
  return focused < 0 ? focusedIndex.value : focused;
}

function handleCardFocus(index) {
  if (!isPointerActive()) {
    focus.setFocusedIndex(index);
  }
}

function setCardRef(index, component) {
  if (component) cardRefs.set(index, component.$el);
  else cardRefs.delete(index);
}

function moveFocus(step) {
  focusedIndex.value = focus.moveFocus(step);
}

function handleCardClick(index) {
  if (consumeClickSuppression()) {
    return;
  }

  // A tap on the focused tile opens it
  // A tap on any other tile focuses it.
  if (index === focus.getFocusedIndex()) {
    openProject(index);
  } else {
    focus.setFocusedIndex(index);
  }
}

function openProject(index) {
  focus.setFocusedIndex(index);
  emit("open", index);
}

function openFocusedProject() {
  if (!selectedProject.value && focus.getFocusedIndex() >= 0) {
    openProject(focus.getFocusedIndex());
  }
}

function handleCarouselScroll() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(emitTileLayout);
}

function handleDirection(direction) {
  if (selectedProject.value) {
    if (direction === "top") detailRef.value?.scrollBy(-1);
    if (direction === "bottom") detailRef.value?.scrollBy(1);
    return;
  }

  if (direction === "top") moveFocus(-1);
  if (direction === "bottom") moveFocus(1);
}

async function emitTileLayout() {
  await nextTick();

  if (!props.visible || selectedProject.value || !carouselRef.value) {
    emit("tile-layout", []);
    return;
  }

  const focusedTile = Math.max(focus.getFocusedIndex(), 0);

  emit(
    "tile-layout",
    projects.map((project, index) => {
      const offset = index - focusedTile;
      const card = cardRefs.get(index);
      const icon = card?.querySelector(".project-tile-icon");

      if (!card || !icon) {
        return null;
      }

      const cardRect = card.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const scale = cardRect.width / card.offsetWidth || 1;
      const cardPositionX = cardRect.left + cardRect.width / 2;
      const cardPositionY = cardRect.top + cardRect.height / 2;
      const color = tileColor(project, index);

      return {
        id: project.id,
        mark: projectMark(project),
        color,
        textColor: tileTextColor(color),
        focused: index === focusedTile,
        backdropOpacity: offset === 0 ? 0.96 : 0.24,
        iconOpacity: offset === 0 ? 1 : 0.6,
        floatDelay: index * 0.7,
        x: iconRect.left + iconRect.width / 2,
        y: iconRect.top + iconRect.height / 2 + 8 * scale,
        size: icon.offsetWidth * scale,
        cardPositionX,
        cardPositionY,
        cardWidth: cardRect.width,
        cardHeight: cardRect.height,
      };
    }),
  );
}

watch(
  [focusedIndex, selectedProject, () => props.compact, () => props.visible],
  () => {
    emitTileLayout();

    if (props.visible && !selectedProject.value && !isPointerActive()) {
      nextTick(() => scrollItemIntoCenter(focus.getFocusedIndex()));
    }
  },
  { flush: "post" },
);

onMounted(() => {
  focus.setFocusedIndex(0);
  emitTileLayout();
  window.addEventListener("resize", emitTileLayout);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", emitTileLayout);
  cancelAnimationFrame(layoutFrame);
});

defineExpose({
  focusPrevious: () => moveFocus(-1),
  focusNext: () => moveFocus(1),
  handleDirection,
  openFocusedProject,
});
</script>

<template>
  <FadeTransition>
    <div
      v-if="visible"
      class="projects-panel fade-layer"
      :class="{ 'projects-panel-compact': compact }"
    >
      <FadeTransition>
        <ProjectDetail
          v-if="selectedProject"
          ref="detailRef"
          :key="projectIndex"
          :project="selectedProject"
          :index="projectIndex"
          @home="emit('home')"
          @list="emit('list')"
        />
        <div v-else class="project-list fade-layer">
          <Breadcrumb
            class="project-path-slot"
            :trail="['home', 'projects']"
            @select="emit('home')"
          />
          <div
            class="project-carousel-drag-surface"
            aria-hidden="true"
            @pointerdown.stop="onPointerDown"
          ></div>
          <div
            ref="carouselRef"
            class="project-carousel"
            role="region"
            aria-label="Projects"
            tabindex="0"
            @scroll.passive="handleCarouselScroll"
            @wheel="onWheel"
            @pointerdown.stop="onPointerDown"
            @pointermove.stop="onPointerMove"
            @pointerup.stop="onPointerEnd"
            @pointercancel.stop="onPointerEnd"
            @lostpointercapture.stop="onPointerEnd"
            @keydown.up.prevent
            @keydown.down.prevent
          >
            <ProjectTile
              v-for="(project, index) in projects"
              :ref="(component) => setCardRef(index, component)"
              :key="project.id"
              :project="project"
              :focused="isItemFocused(index)"
              :offset="index - activeIndex()"
              @focus="handleCardFocus(index)"
              @select="handleCardClick(index)"
            />
            <div class="project-carousel-end-space" aria-hidden="true"></div>
          </div>
          <div class="project-carousel-indicator" aria-hidden="true">
            {{ String(focusedIndex + 1).padStart(2, "0") }} /
            {{ String(projects.length).padStart(2, "0") }}
          </div>
        </div>
      </FadeTransition>
    </div>
  </FadeTransition>
</template>

<style scoped>
.projects-panel,
.project-list {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.projects-panel {
  z-index: 3;
}

.project-path-slot {
  position: absolute;
  top: var(--screen-pad);
  left: var(--screen-pad);
  z-index: 2;
  pointer-events: auto;
}

.project-carousel-drag-surface {
  position: absolute;
  inset: 0 0 0 34%;
  touch-action: none;
  pointer-events: auto;
}

.project-carousel {
  --edge: 110px;
  /* How far the next tile's top edge sits from the list centre, minus the gap and the peek. */
  --reach: 169px;
  --gap-max: 50px;
  position: absolute;
  z-index: 1;
  inset: 0 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0px, calc(50% - var(--reach)), var(--gap-max));
  width: min(66%, 800px);
  overflow-x: hidden;
  overflow-y: auto;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior-y: contain;
  scroll-padding-block: 50%;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  pointer-events: auto;
}

.project-carousel::-webkit-scrollbar {
  display: none;
}

.project-carousel::before {
  content: "";
  flex: 0 0 max(0px, calc(50% - var(--edge)));
  pointer-events: none;
}

.project-carousel-end-space {
  flex: 0 0 max(120px, calc(50% - var(--edge) + 120px));
  width: 1px;
  pointer-events: none;
}

.projects-panel-compact .project-carousel {
  --edge: 100px;
  --gap-max: 98px;
  width: 100%;
}

.projects-panel-compact .project-carousel-drag-surface {
  left: 0;
}

@media (max-width: 640px) {
  .project-carousel {
    --reach: 156px;
  }
}

.project-carousel-indicator {
  position: absolute;
  right: 12px;
  top: var(--screen-pad);
  color: var(--screen-text);
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.45);
  font-size: 9px;
  line-height: 1;
}
</style>
