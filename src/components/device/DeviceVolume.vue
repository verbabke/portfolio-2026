<script setup>
import { ref } from "vue";
import { Volume2 } from "@lucide/vue";

const volumeWheelTextureOffset = ref(48);
const isAdjustingVolume = ref(false);
const volumeDragStart = ref({ offset: 0, y: 0 });

function startVolumeAdjust(event) {
  isAdjustingVolume.value = true;
  volumeDragStart.value = {
    offset: volumeWheelTextureOffset.value,
    y: event.clientY,
  };
  event.currentTarget.setPointerCapture(event.pointerId);
}

function adjustVolume(event) {
  if (!isAdjustingVolume.value) return;
  volumeWheelTextureOffset.value =
    volumeDragStart.value.offset +
    (event.clientY - volumeDragStart.value.y) * 1.5;
}

function endVolumeAdjust(event) {
  isAdjustingVolume.value = false;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
}
</script>

<template>
  <div class="side-volume-control">
    <button
      class="volume-wheel"
      :style="{ backgroundPosition: `0 ${volumeWheelTextureOffset}px` }"
      type="button"
      aria-label="Volume wheel"
      @pointerdown="startVolumeAdjust"
      @pointermove="adjustVolume"
      @pointerup="endVolumeAdjust"
      @pointercancel="endVolumeAdjust"
    ></button>
    <div class="side-volume-marker" aria-hidden="true">
      <Volume2 :size="14" />
      <span class="emboss-txt select-none">Vol</span>
    </div>
  </div>
</template>

<style>
.side-volume-control {
  position: absolute;
  top: clamp(92px, 20%, 176px);
  right: 0;
  z-index: 2;
  width: 0;
  height: 112px;
}

.volume-wheel {
  position: absolute;
  top: 50%;
  right: -30px;
  width: 22px;
  height: 73px;
  padding: 0;
  border: 2px solid #44262b;
  border-radius: 5px;
  background: repeating-linear-gradient(
    0deg,
    #843c4a 0 3px,
    #b35462 3px 5px,
    #542932 5px 7px
  );
  box-shadow:
    inset 2px 0 3px #f38b9359,
    inset -3px 0 4px #241317a8,
    0 0 0 2px #242522,
    1px 2px 3px #1d1d1aa8;
  cursor: ns-resize;
  touch-action: none;
  user-select: none;
  transition: filter 120ms ease;
  transform: translateY(-50%);
}

.volume-wheel:active {
  cursor: grabbing;
  filter: brightness(1.1);
}

.side-volume-marker {
  position: absolute;
  top: 50%;
  right: calc(var(--console-padding) / 2 - 2px);
  display: grid;
  justify-items: center;
  gap: 6px;
  color: #8b8a8a;
  transform: translate(50%, -50%);
}

.side-volume-marker svg {
  filter: drop-shadow(-0.5px -0.5px #d8d3c7)
    drop-shadow(0.5px 0.5px rgba(70, 69, 64, 0.45));
}

.side-volume-marker .emboss-txt {
  font-size: clamp(10px, 1.5vw, 14px);
  writing-mode: vertical-rl;
  text-orientation: upright;
}

@media (max-width: 640px) {
  .side-volume-control {
    display: none;
  }
}
</style>
