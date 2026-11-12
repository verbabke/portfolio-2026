<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  // Index of the project showing
  // -1 when the list is showing
  activeIndex: {
    type: Number,
    default: -1,
  },
});

defineEmits(["back", "select", "close"]);

// Keep in step with the tab heights in the styles below.
const idleHeight = 24;
const activeHeight = 29;

function tabHeight(tab) {
  return tab.index === props.activeIndex ? activeHeight : idleHeight;
}

// Slanted left side with a rounded top corner
// The slant is the same angle at both heights
function leftEdge(height) {
  const x = 0.5 + 0.5 * (height - 5);
  return `M0.5 ${height}L${x} 5Q${x + 1.4} 0.5 ${x + 5} 0.5H18`;
}

function rightEdge(height) {
  return `M0 0.5H4Q7.5 0.5 7.5 4V${height}`;
}
</script>

<template>
  <header class="taskbar">
    <button
      type="button"
      class="taskbar-home"
      aria-label="Home"
      @click="$emit('back')"
    >
      <img
        src="/img/logo/verbabke-logo-icon-sm.png"
        class="render-pixelated filter-ui-text nes-cursor-pointer"
        alt=""
      />
    </button>

    <div v-if="tabs.length" class="taskbar-tabs" role="tablist">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="taskbar-tab"
        :class="{ 'taskbar-tab-active': tab.index === activeIndex }"
        role="tab"
        :aria-selected="tab.index === activeIndex"
      >
        <svg
          class="taskbar-tab-cap"
          :viewBox="`0 0 18 ${tabHeight(tab)}`"
          aria-hidden="true"
        >
          <path
            class="tab-fill"
            :d="`${leftEdge(tabHeight(tab))}V${tabHeight(tab)}Z`"
          />
          <path class="tab-line" :d="leftEdge(tabHeight(tab))" />
        </svg>

        <div class="taskbar-tab-body">
          <button
            type="button"
            class="taskbar-tab-main"
            @click="$emit('select', tab.index)"
          >
            <span
              class="taskbar-tab-swatch"
              :style="{ background: tab.color }"
            ></span>
            <span class="taskbar-tab-title">{{ tab.title }}</span>
          </button>
          <button
            type="button"
            class="taskbar-tab-close"
            :aria-label="`Close ${tab.title}`"
            @click="$emit('close', tab.index)"
          >
            <svg viewBox="0 0 8 8" aria-hidden="true">
              <path
                d="M1 1l6 6M7 1L1 7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
              />
            </svg>
          </button>
        </div>

        <svg
          class="taskbar-tab-cap taskbar-tab-cap-end"
          :viewBox="`0 0 8 ${tabHeight(tab)}`"
          aria-hidden="true"
        >
          <path class="tab-fill" :d="`${rightEdge(tabHeight(tab))}H0Z`" />
          <path class="tab-line" :d="rightEdge(tabHeight(tab))" />
        </svg>
      </div>
    </div>
  </header>
</template>

<style scoped>
.taskbar {
  position: absolute;
  z-index: 4;
  inset: auto 0 0;
  display: flex;
  height: var(--header-height);
  align-items: stretch;
  padding: 4px;
  background: var(--ui-bg);

  border-top: 4px solid var(--border-color);
}

/* Sits above the screen's own scanline layer, so it carries its own. */
.taskbar::after {
  position: absolute;
  inset: 0;
  background: var(--screen-overlay);
  content: "";
  pointer-events: none;
}

.taskbar-home {
  display: flex;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.taskbar-home img {
  display: block;
  height: 100%;
  width: auto;
}

/* Tabs stand on the taskbar's top edge and overlap, like browser tabs. */
.taskbar-tabs {
  position: absolute;
  right: 12px;
  bottom: 100%;
  display: flex;
  align-items: flex-end;
  max-width: calc(100% - 200px);
}

.taskbar-tab {
  --tab-bg: #e9e4c6;
  position: relative;
  display: flex;
  flex: 0 1 165px;
  align-items: stretch;
  min-width: 0;
  height: 24px;
  margin-left: -10px;
  color: var(--ui-text);
  font:
    600 13px / 1 "Rajdhani",
    sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* The open tab sits in front and joins the taskbar, covering its top border. */
.taskbar-tab-active {
  --tab-bg: var(--ui-bg);
  z-index: 10;
  height: 29px;
  margin-bottom: -1px;
}

/* Slanted left side and rounded right corner, drawn at the tab's exact size. */
.taskbar-tab-cap {
  flex: none;
  width: 18px;
  height: 100%;
  overflow: visible;
}

.taskbar-tab-cap-end {
  width: 8px;
}

.tab-fill {
  fill: var(--tab-bg);
  shape-rendering: crispEdges;
}

.tab-line {
  fill: none;
  stroke: var(--border-color);
  shape-rendering: crispEdges;
}

.taskbar-tab-body {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
  border-top: 1px solid var(--border-color);
  background: var(--tab-bg);
}

/* Scanlines only, lined up with the screen's own: tabs differ in height and sit above the screen's bottom edge. */
.taskbar-tab::after {
  position: absolute;
  inset: 0;
  background: var(--scanlines);
  background-position: 0 mod(calc(var(--header-height) - 1px), 4px);
  clip-path: polygon(0 100%, 12px 0, calc(100% - 3px) 0, 100% 3px, 100% 100%);
  content: "";
  pointer-events: none;
}

.taskbar-tab-active::after {
  background-position: 0 mod(calc(var(--header-height) - 2px), 4px);
}

.taskbar-tab button {
  display: flex;
  align-items: center;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
}

.taskbar-tab-main {
  flex: 1 1 auto;
  gap: 7px;
  min-width: 0;
  height: 100%;
  padding: 0 4px 0 2px;
}

.taskbar button {
  outline: none;
}

.taskbar-tab-swatch {
  flex: none;
  width: 10px;
  height: 10px;
  border: 1px solid var(--border-color);
}

.taskbar-tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.taskbar-tab-close {
  flex: none;
  justify-content: center;
  width: 22px;
  height: 100%;
  padding: 0;
  opacity: 0.7;
}

.taskbar-tab-close:hover {
  opacity: 1;
}

.taskbar-tab-close svg {
  width: 8px;
  height: 8px;
}

@media (max-width: 640px) {
  .taskbar-tabs {
    display: none;
  }
}

@media (max-width: 500px) {
  /* .taskbar {
    display: none;
  } */

  .taskbar-home {
    display: none;
  }
}
</style>
