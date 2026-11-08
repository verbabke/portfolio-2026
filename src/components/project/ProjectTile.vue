<script setup>
import { computed } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  focused: {
    type: Boolean,
    default: false,
  },
  // Distance from the focused tile
  // Drives the carousel scale and stacking.
  offset: {
    type: Number,
    default: 0,
  },
});

defineEmits(["focus", "select"]);

const style = computed(() => {
  const distance = Math.abs(props.offset);
  const scale = distance === 0 ? 1.1 : distance === 1 ? 0.74 : 0.54;

  return {
    transform: `scale(${scale})`,
    zIndex: String(10 - distance),
  };
});
</script>

<template>
  <button
    type="button"
    class="project-tile"
    data-snap-item
    :style="style"
    :aria-label="`${project.title}, ${project.type}`"
    :aria-pressed="focused"
    @focus="$emit('focus')"
    @click="$emit('select')"
  >
    <!-- the 3D tile is drawn in the scene at this spot. -->
    <span class="project-tile-icon" aria-hidden="true"></span>
    <span v-if="focused" class="project-tile-copy">
      <span class="project-tile-title">{{ project.title }}</span>
      <span class="project-tile-description">
        {{ project.descriptionShort }}
      </span>
    </span>
  </button>
</template>

<style scoped>
.project-tile {
  --raise: 28px;
  position: relative;
  flex: 0 0 auto;
  scroll-snap-align: center;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 110px auto;
  align-items: center;
  justify-items: start;
  width: min(66%, 350px);
  height: 220px;
  gap: 7px;
  padding: 10px 16px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ui-text);
  font: inherit;
  cursor: pointer;
  transition: transform 300ms cubic-bezier(0.2, 0.75, 0.25, 1);
}

.project-tile-icon {
  grid-column: 1;
  grid-row: 1;
  justify-self: center;
  width: 106px;
  height: 106px;
  transform: translateY(calc(-1 * var(--raise)));
}

.project-tile-copy {
  grid-column: 1;
  width: 100%;
  padding: 8px 12px;
  text-align: center;
  transform: translateY(calc(-1 * var(--raise)));
}

.project-tile-title {
  display: block;
  width: 100%;
  max-width: 100%;
  overflow-wrap: anywhere;
  font-size: clamp(12px, 1.1vw, 16px);
  line-height: 1.5;
  color: var(--ui-text);
}

.project-tile-description {
  display: -webkit-box;
  width: 100%;
  overflow: hidden;
  color: var(--ui-text);
  font-family: "Rajdhani", sans-serif;
  font-size: 16px;
  line-height: 1.25;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-align: center;
}

@media (max-width: 640px) {
  .project-tile {
    grid-template-rows: 88px auto;
    width: min(88%, 270px);
    height: 200px;
    gap: 5px;
    padding: 7px 10px;
  }

  .project-tile-icon {
    width: 84px;
    height: 84px;
  }

  .project-tile-description {
    font-size: 15px;
  }
}
</style>
