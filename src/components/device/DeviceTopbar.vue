<script setup>
import DeviceSocials from "./DeviceSocials.vue";
import DeviceSpeaker from "./DeviceSpeaker.vue";

defineProps({
  powered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle-power"]);
</script>

<template>
  <div class="device-topbar flex flex-1 justify-between gap-2">
    <div class="device-controls">
      <div class="battery-indicator" role="img" aria-label="Battery indicator">
        <span
          class="led"
          :class="powered ? 'led-green' : 'led-off'"
          aria-hidden="true"
        ></span>
        <p class="emboss-txt select-none">Bat</p>
      </div>
      <button
        class="device-button power-button nes-cursor-pointer"
        type="button"
        aria-label="Power"
        :aria-pressed="powered"
        @click="$emit('toggle-power')"
      >
        <span aria-hidden="true"></span>
      </button>
    </div>

    <div class="screen-top-vents" aria-hidden="true">
      <span v-for="index in 12" :key="index"></span>
    </div>

    <DeviceSocials class="top-social-panel" />
    <DeviceSpeaker class="top-speaker-panel" />
  </div>
</template>

<style>
.device-controls {
  z-index: 2;
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.2vw, 14px);
}

.battery-indicator {
  display: grid;
  justify-items: center;
  gap: 4px;
}

.power-button {
  position: relative;
  width: var(--round-control-size);
  aspect-ratio: 1;
  border: 1px solid #161817;
  border-radius: 50%;
  background: linear-gradient(145deg, #818181, #1c1e1d);
  box-shadow:
    inset 1px 1px #ffffff42,
    inset -2px -2px #2b2c2c,
    1px 2px 3px #00000080;
}

.power-button span {
  position: absolute;
  top: 29%;
  left: 27%;
  width: 46%;
  height: 46%;
  border: 3px solid #c8c4ba;
  border-top-color: transparent;
  border-radius: 50%;
}

.power-button span::before {
  content: "";
  position: absolute;
  top: -45%;
  left: calc(50% - 1.5px);
  width: 3px;
  height: 68%;
  border-radius: 2px;
  background: #c8c4ba;
}

.led-off {
  background: #25302b;
  box-shadow: inset 0 1px 2px #00000080;
}

.screen-top-vents {
  position: absolute;
  top: -12px;
  left: 50%;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  width: min(42%, 400px);
  height: clamp(35px, 4vw, 52px);
  margin: 0;
  padding: 0 10px 20px;
  gap: clamp(8px, 1.4vw, 16px);
  border: 1px solid #6b6a67;
  border-radius: 4px 4px 16px 16px;
  background: linear-gradient(135deg, #1b1c1a4d, #ffffff3d), #a4a29b;
  background-blend-mode: soft-light;
  box-shadow:
    inset 1px 1px 3px #ffffff38,
    inset -3px -3px 5px #1b1c1a52,
    inset 0px 0 1px #5f5e58,
    inset 1px -2px 2px #bbb7ab;
  transform: translateX(-50%);
}
.screen-top-vents span {
  display: block;
  border-bottom: 1px solid #5b5b56;
  border-radius: 0 0 999px 999px;
  background: linear-gradient(90deg, #706f69, #8a8780 50%, #696964);
  box-shadow: inset 0 1px #4c4c47;
}

@media (max-width: 640px) {
  .screen-top-vents {
    width: min(48%, 200px);
    height: clamp(24px, 5vw, 32px);
    padding: 0 6px 12px;
    gap: 6px;
  }
}
</style>
