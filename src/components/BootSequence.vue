<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  powered: {
    type: Boolean,
    default: false,
  },
  hasFinishLoading: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const minBootTime = 2000;

const emit = defineEmits(["complete", "reveal"]);

const isBooting = ref(false);
const timedProgress = ref(0);
const logoAspect = ref(1);
const displayedProgress = computed(() =>
  Math.min(props.progress, Math.round(timedProgress.value)),
);
const isVisible = computed(
  () => props.powered && (isBooting.value || !props.hasFinishLoading),
);
let progressTimer;

function updateBootProgress(startTime) {
  const elapsed = window.performance.now() - startTime;
  const progressTarget = Math.min((elapsed / minBootTime) * 100, 100);
  const delayedTarget = Math.max(0, progressTarget - Math.random() * 9);
  timedProgress.value = Math.max(
    timedProgress.value,
    Math.round(delayedTarget),
  );

  if (elapsed >= minBootTime) {
    timedProgress.value = 100;
    isBooting.value = false;
    return;
  }

  progressTimer = window.setTimeout(
    () => updateBootProgress(startTime),
    Math.min(80 + Math.random() * 180, minBootTime - elapsed),
  );
}

watch(
  () => props.powered,
  (powered) => {
    window.clearTimeout(progressTimer);
    isBooting.value = powered;
    timedProgress.value = 0;

    if (powered) {
      updateBootProgress(window.performance.now());
    }
  },
);

function handleFadeOutComplete() {
  if (props.powered) {
    emit("complete");
  }
}

function handleFadeOutStart() {
  if (props.powered) {
    emit("reveal");
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(progressTimer);
});
</script>

<template>
  <Transition
    name="fade-overlay"
    @before-leave="handleFadeOutStart"
    @after-leave="handleFadeOutComplete"
  >
    <div v-show="isVisible" class="boot-overlay">
      <div class="boot-sequence" :style="{ '--logo-aspect': logoAspect }">
        <img
          src="/img/logo/verbabke-logo-full.png"
          alt="Logo"
          class="logo render-pixelated filter-screen-text"
          @load="
            logoAspect =
              $event.target.naturalWidth / $event.target.naturalHeight
          "
        />
        <progress
          class="nes-progress is-primary boot-progress"
          :value="displayedProgress"
          max="100"
          aria-label="Loading progress"
        ></progress>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.boot-overlay {
  position: absolute;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  container-type: size;
  isolation: isolate;
  background: var(--screen-bg);
  color: #050505;
  padding: 24px;
}

.boot-progress {
  width: 100%;
  height: 16px;
  margin: 0;
}

.boot-overlay::after {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: var(--screen-overlay);
  box-shadow: var(--screen-glow);
  content: "";
  pointer-events: none;
}

.logo {
  display: block;
  width: 100%;
  height: auto;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 200ms ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

.fade-overlay-enter-to,
.fade-overlay-leave-from {
  opacity: 1;
}

.boot-sequence {
  position: relative;
  z-index: 0;
  display: grid;
  width: min(100%, max(0px, (100cqh - 28px) * var(--logo-aspect)));
  gap: 12px;
  min-width: 0;
  min-height: 0;
  max-width: 300px;
}
</style>
