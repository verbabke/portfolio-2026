<script setup>
import { nextTick, ref, watch } from "vue";
import { projects } from "../data/projects";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const hoveredIndex = ref(null);
const focusedIndex = ref(0);
const showKeyboardFocus = ref(false);
const listRef = ref(null);
const itemRefs = new Map();

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      hoveredIndex.value = null;
      focusedIndex.value = 0;
      showKeyboardFocus.value = false;
    }
  },
);

function setItemRef(index, instance) {
  if (instance) {
    itemRefs.set(index, instance);
    return;
  }

  itemRefs.delete(index);
}

function isItemFocused(index) {
  if (hoveredIndex.value !== null) {
    return hoveredIndex.value === index;
  }

  return showKeyboardFocus.value && focusedIndex.value === index;
}

function handleItemHover(index, hovered) {
  hoveredIndex.value = hovered ? index : null;

  if (hovered) {
    showKeyboardFocus.value = false;
  }
}

async function scrollFocusedItemIntoView() {
  await nextTick();

  // Scroll fully to top if the first item is focused
  if (focusedIndex.value === 0) {
    listRef.value?.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Scroll fully to bottom if the last item is focused
  if (focusedIndex.value === projects.length - 1) {
    listRef.value?.scrollTo({
      top: listRef.value.scrollHeight,
      behavior: "smooth",
    });
    return;
  }

  itemRefs.get(focusedIndex.value)?.scrollIntoView({
    block: "nearest",
    behavior: "smooth",
  });
}

function focusPrevious() {
  hoveredIndex.value = null;
  showKeyboardFocus.value = true;
  focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
  scrollFocusedItemIntoView();
}

function focusNext() {
  hoveredIndex.value = null;
  showKeyboardFocus.value = true;
  focusedIndex.value = Math.min(focusedIndex.value + 1, projects.length - 1);
  scrollFocusedItemIntoView();
}

defineExpose({
  focusPrevious,
  focusNext,
});
</script>

<template>
  <div v-if="visible" class="projects-panel" aria-label="Projects">
    <ul ref="listRef" class="projects-list">
      <li
        v-for="(project, index) in projects"
        :ref="(instance) => setItemRef(index, instance)"
        :key="project.id"
        class="projects-list-item"
        :class="{ 'projects-list-item-focused': isItemFocused(index) }"
        @mouseenter="handleItemHover(index, true)"
        @mouseleave="handleItemHover(index, false)"
      >
        <span class="projects-list-marker">{{
          isItemFocused(index) ? "›" : ""
        }}</span>
        <div class="projects-list-text">
          <h3 class="projects-list-title">{{ project.title }}</h3>
          <p class="projects-list-description">{{ project.description }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Layout only — style this however you like. */
.projects-panel {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.projects-list {
  position: absolute;
  inset: 0 0 0 auto;
  width: min(45%, 360px);
  padding: 48px 0 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto;
  margin: 0 auto;
}

.projects-list-item {
  list-style: none;
  display: flex;
  padding: 8px 12px;
  gap: 8px;
}

.projects-list-marker {
  width: 1em;
  flex: none;
}

.projects-list-item-focused {
  background-color: rgba(0, 5, 81, 0.05);
}
</style>
