<script setup>
import { computed } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  sections: {
    type: Array,
    default: () => [],
  },
  activeSectionId: {
    type: String,
    default: "",
  },
  activePanelIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["close", "select-section", "select-panel"]);

const activeSection = computed(
  () =>
    props.sections.find((section) => section.id === props.activeSectionId) ??
    props.sections[0] ??
    null,
);
const activePanel = computed(
  () => activeSection.value?.panels?.[props.activePanelIndex] ?? null,
);
</script>

<template>
  <Transition name="menu-fade">
    <section v-if="visible && activeSection" class="device-menu">
      <header class="menu-statusbar">
        <div>
          <p class="menu-label">Mode</p>
          <strong>Game Select</strong>
        </div>
        <div>
          <p class="menu-label">Status</p>
          <strong>{{ activeSection.status }}</strong>
        </div>
        <button
          type="button"
          class="menu-return"
          aria-label="Return to startup scene"
          @click="$emit('close')"
        >
          Exit
        </button>
      </header>

      <div class="menu-body">
        <nav class="menu-tabs" aria-label="Device sections">
          <button
            v-for="section in sections"
            :key="section.id"
            type="button"
            class="menu-tab"
            :class="{ 'menu-tab-active': section.id === activeSection.id }"
            @click="$emit('select-section', section.id)"
          >
            <span class="menu-tab-title">{{ section.title }}</span>
            <small>{{ section.subtitle }}</small>
          </button>
        </nav>

        <article class="menu-panel">
          <div class="panel-header">
            <div>
              <p class="menu-label">{{ activeSection.accent }}</p>
              <h1>{{ activeSection.title }}</h1>
            </div>
            <p class="panel-counter">
              {{ String(activePanelIndex + 1).padStart(2, "0") }} /
              {{ String(activeSection.panels.length).padStart(2, "0") }}
            </p>
          </div>

          <div v-if="activePanel" class="panel-card">
            <p class="panel-meta">{{ activePanel.meta }}</p>
            <h2>{{ activePanel.title }}</h2>
            <p class="panel-body-copy">{{ activePanel.body }}</p>

            <ul class="panel-bullets">
              <li v-for="bullet in activePanel.bullets" :key="bullet">
                {{ bullet }}
              </li>
            </ul>

            <footer class="panel-links">
              <a
                v-for="link in activePanel.links"
                :key="`${activePanel.id}-${link.label}`"
                class="panel-link"
                :href="link.href"
                :target="link.href.startsWith('http') ? '_blank' : undefined"
                :rel="link.href.startsWith('http') ? 'noreferrer' : undefined"
              >
                {{ link.label }}
              </a>
            </footer>
          </div>

          <div
            v-if="activeSection.panels.length > 1"
            class="panel-selectors"
            role="tablist"
            aria-label="Content cards"
          >
            <button
              v-for="(panel, index) in activeSection.panels"
              :key="panel.id"
              type="button"
              class="panel-selector"
              :class="{
                'panel-selector-active': index === activePanelIndex,
              }"
              :aria-pressed="index === activePanelIndex"
              @click="$emit('select-panel', index)"
            >
              {{ panel.title }}
            </button>
          </div>
        </article>
      </div>

      <footer class="menu-legend">
        <span>L/R : change section</span>
        <span>U/D : change card</span>
        <span>Start : open menu</span>
        <span>Select : return</span>
      </footer>
    </section>
  </Transition>
</template>

<style scoped>
.device-menu {
  position: absolute;
  inset: 0;
  z-index: 12;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  padding: clamp(10px, 1.8vw, 18px);
  background:
    radial-gradient(circle at top right, #b5ffd71c, transparent 34%),
    linear-gradient(180deg, #09100d, #0d1914 45%, #07120e);
  color: #d8ffe8;
  font-family: "Share Tech Mono", monospace;
}

.device-menu::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, #ffffff06 0 1px, transparent 1px 90px),
    repeating-linear-gradient(0deg, #18362a22 0 1px, transparent 1px 4px);
  mix-blend-mode: screen;
}

.menu-statusbar,
.menu-body,
.menu-legend {
  position: relative;
  z-index: 1;
}

.menu-statusbar {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
  gap: 10px;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #6de6b74a;
}

.menu-label,
.panel-meta,
.panel-counter,
.menu-tab small,
.menu-legend {
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.menu-statusbar strong,
.menu-tab-title,
.panel-card h2,
.panel-header h1 {
  font-family: "Press Start 2P", monospace;
}

.menu-statusbar strong {
  display: block;
  margin-top: 4px;
  font-size: clamp(0.6rem, 1vw, 0.82rem);
  color: #97f2c7;
}

.menu-return,
.menu-tab,
.panel-selector,
.panel-link {
  border: 1px solid #6de6b759;
  color: inherit;
  background: linear-gradient(180deg, #102019, #0c1712);
}

.menu-return {
  padding: 10px 12px;
  font: inherit;
  cursor: pointer;
}

.menu-body {
  display: grid;
  grid-template-columns: minmax(170px, 220px) minmax(0, 1fr);
  gap: clamp(12px, 2vw, 18px);
  min-height: 0;
  padding: 12px 0;
}

.menu-tabs {
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 0;
}

.menu-tab {
  display: grid;
  gap: 5px;
  padding: 12px;
  text-align: left;
  cursor: pointer;
}

.menu-tab-title {
  font-size: clamp(0.65rem, 1vw, 0.82rem);
  line-height: 1.4;
  text-transform: uppercase;
}

.menu-tab small {
  color: #a4cab6;
  font-size: clamp(0.62rem, 0.92vw, 0.76rem);
}

.menu-tab-active {
  box-shadow: inset 0 0 0 1px #9df0b9;
  background: linear-gradient(180deg, #143024, #0c1813);
}

.menu-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-height: 0;
  padding: 2px 0 0;
}

.panel-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.panel-header h1 {
  margin: 6px 0 0;
  font-size: clamp(0.9rem, 1.65vw, 1.25rem);
  line-height: 1.4;
  text-transform: uppercase;
}

.panel-counter {
  color: #97f2c7;
  font-size: clamp(0.62rem, 0.9vw, 0.74rem);
}

.panel-card {
  min-height: 0;
  margin-top: 12px;
  padding: clamp(12px, 1.8vw, 16px);
  border: 1px solid #6de6b733;
  background: linear-gradient(180deg, #10201ae6, #0c1512d9);
  overflow: auto;
}

.panel-meta {
  color: #8ff7c9;
  font-size: clamp(0.62rem, 0.88vw, 0.74rem);
}

.panel-card h2 {
  margin: 10px 0 0;
  font-size: clamp(0.8rem, 1.4vw, 1rem);
  line-height: 1.5;
  text-transform: uppercase;
}

.panel-body-copy,
.panel-bullets {
  font: 600 clamp(0.82rem, 1.2vw, 0.96rem) / 1.5 "Rajdhani", sans-serif;
}

.panel-body-copy {
  margin: 12px 0 0;
  color: #effff6;
}

.panel-bullets {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #d2f8e4;
}

.panel-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.panel-link {
  padding: 8px 10px;
  font-size: clamp(0.7rem, 0.96vw, 0.8rem);
  text-decoration: none;
}

.panel-selectors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.panel-selector {
  padding: 8px 10px;
  font: inherit;
  font-size: clamp(0.68rem, 0.92vw, 0.78rem);
  cursor: pointer;
}

.panel-selector-active {
  box-shadow: inset 0 0 0 1px #9df0b9;
}

.menu-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid #6de6b74a;
  color: #9ccbb4;
  font-size: clamp(0.56rem, 0.9vw, 0.72rem);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 180ms ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1000px) {
  .menu-body {
    grid-template-columns: minmax(0, 1fr);
  }

  .menu-tabs {
    grid-auto-flow: column;
    grid-auto-columns: minmax(160px, 1fr);
    overflow: auto;
  }
}

@media (max-width: 640px) {
  .device-menu {
    padding: 10px;
  }

  .menu-statusbar {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .menu-statusbar > :nth-child(2) {
    display: none;
  }

  .panel-header {
    flex-direction: column;
  }

  .menu-legend {
    gap: 8px;
  }
}
</style>