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

const minBootTime = 1200;

const emit = defineEmits(["complete"]);

const isBooting = ref(false);
const timedProgress = ref(0);
const displayedProgress = computed(() =>
  Math.min(props.progress, Math.round(timedProgress.value)),
);
const isVisible = computed(
  () => props.powered && (isBooting.value || !props.hasFinishLoading),
);
let bootTimer;
let progressTimer;

function advanceProgress(startTime) {
  const elapsed = window.performance.now() - startTime;
  const progressTarget = Math.min((elapsed / minBootTime) * 100, 100);
  const delayedTarget = Math.max(0, progressTarget - Math.random() * 9);
  timedProgress.value = Math.max(
    timedProgress.value,
    Math.round(delayedTarget),
  );

  if (elapsed >= minBootTime) {
    timedProgress.value = 100;
    return;
  }

  progressTimer = window.setTimeout(
    () => advanceProgress(startTime),
    80 + Math.random() * 180,
  );
}

watch(
  () => props.powered,
  (powered) => {
    window.clearTimeout(bootTimer);
    window.clearTimeout(progressTimer);
    isBooting.value = powered;
    timedProgress.value = 0;

    if (powered) {
      advanceProgress(window.performance.now());
      bootTimer = window.setTimeout(() => {
        isBooting.value = false;
      }, minBootTime);
    }
  },
);

watch(isVisible, (visible) => {
  if (!visible && props.powered) {
    emit("complete");
  }
});

onBeforeUnmount(() => {
  window.clearTimeout(bootTimer);
  window.clearTimeout(progressTimer);
});
</script>

<template>
  <Transition name="fade-overlay">
    <div v-show="isVisible" class="boot-overlay">
      <div class="boot-sequence">
        <p class="boot-blink">INITIALIZING...</p>
        <div class="boot-progress" aria-label="Loading progress">
          <span :style="{ width: `${displayedProgress}%` }"></span>
        </div>
        <p>LOADING ASSETS {{ displayedProgress }}%</p>
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
  background: #07120e;
  color: #9df0b9;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 8px #38e89a;
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
  display: grid;
  width: min(62%, 300px);
  gap: 12px;
}

.boot-sequence p {
  margin: 0;
  font-size: clamp(11px, 1.5vw, 16px);
  letter-spacing: 0.08em;
}

.boot-sequence .boot-blink {
  animation: boot-blink 600ms steps(2, end) infinite;
}

.boot-progress {
  height: 10px;
  padding: 2px;
  border: 1px solid #9df0b9;
}

.boot-progress span {
  display: block;
  height: 100%;
  background: #9df0b9;
  box-shadow: 0 0 8px #38e89a;
  transition: width 120ms linear;
}

@keyframes boot-blink {
  50% {
    opacity: 0.35;
  }
}
</style>
