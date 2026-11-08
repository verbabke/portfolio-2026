<script setup>
import DeviceControls from "./DeviceControls.vue";
import DeviceScreen from "./DeviceScreen.vue";
import DeviceTopbar from "./DeviceTopbar.vue";
import DeviceSpeaker from "./DeviceSpeaker.vue";
import DeviceSocials from "./DeviceSocials.vue";
import DeviceVolume from "./DeviceVolume.vue";

defineProps({
  powered: {
    type: Boolean,
    default: false,
  },
  screenActive: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle-power", "direction", "confirm", "back"]);
</script>

<template>
  <main class="viewer grid min-h-svh place-items-center">
    <section class="device-shell device-panel" aria-label="Portfolio device">
      <div class="console">
        <DeviceTopbar
          :powered="powered"
          @toggle-power="$emit('toggle-power')"
        />

        <DeviceScreen :powered="screenActive">
          <slot></slot>
        </DeviceScreen>

        <DeviceSpeaker />
        <DeviceControls
          @direction="$emit('direction', $event)"
          @confirm="$emit('confirm')"
          @back="$emit('back')"
        />
        <DeviceSocials class="lower-social-panel" />
      </div>

      <DeviceVolume />
    </section>
  </main>
</template>

<style>
.viewer {
  padding: clamp(18px, 5vw, 72px) clamp(25px, 3vw, 32px);
  background: radial-gradient(
    circle at 50% 45%,
    var(--page-glow),
    var(--page-background) 72%
  );
  display: grid;
}

.device-panel {
  --round-control-size: clamp(28px, 3.4vw, 38px);
  --device-radius: clamp(24px, 5vw, 52px);
  --bezel-radius: clamp(17px, 3vw, 30px);
  --screen-radius: clamp(10px, 2vw, 18px);
  --case-light: #d8d3c7;
  --case-mid: #aaa69b;
  --case-edge: #716f68;
  --bezel-dark: #151918;
  --bezel-edge: #5d5d56;
  --screen-shadow: #05231c;
  --light-highlight: #ffffff52;
  --light-shadow: #1b1c1a66;
  --metal-trim: #77756e;
  --case-gradient: linear-gradient(
    110deg,
    var(--case-mid),
    var(--case-light) 44%,
    #9b9991
  );
  --metal-gradient: linear-gradient(
    135deg,
    #b4afa2,
    #8e8c84 48%,
    var(--case-mid)
  );
  --surface-raised:
    inset 2px 2px 4px #ffffff33, inset -4px -6px 12px #45464188,
    0 24px 46px #050606a8;
  --surface-inset:
    inset 0 0 0 2px var(--bezel-edge), inset 0 0 0 7px #0a0c0c,
    0 2px 2px #e6e0d4;
  --metal-inset: inset 0 2px 2px #d9d4c8, inset 0 -3px 5px #6c6b65;
  --metal-ring-shadow:
    inset 2px 2px 3px var(--light-highlight), inset 0 -1px 0 #b6b1a5,
    inset -2px -4px 6px var(--light-shadow), 0 4px 7px #111111a8;
  --screen-glow: inset 0 0 32px var(--screen-shadow), inset 0 0 4px 2px #e7fff4;
  --panel-border: #30312e;
  --panel-surface: linear-gradient(135deg, #96938a, #aaa69b 65%, #898780);
  --panel-inset:
    inset 2px 2px 3px var(--light-highlight),
    inset -3px -4px 6px var(--light-shadow);
  --vent-surface: #3b3b3b;
  --vent-shadow:
    inset 2px 2px 3px #000000bf, inset -1px -1px 2px #ffffff1f,
    1px 1px 2px #ffffff2e;
  --control-surface: linear-gradient(135deg, #4a4e4c, #1a1d1c);
  --control-pressed: linear-gradient(135deg, #3d413f, #202321);
  position: relative;
  z-index: 1;
  border: 3px solid var(--case-edge);
  border-radius: var(--panel-radius, var(--device-radius));
  background:
    linear-gradient(135deg, var(--light-shadow), var(--light-highlight)),
    var(--panel-background, var(--case-gradient));
  background-blend-mode: soft-light;
  box-shadow: var(--surface-raised);
}

.device-panel::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: -9px;
  padding: 7px;
  border: 1px solid var(--metal-trim);
  border-radius: calc(var(--device-radius) + 8px);
  background: var(--metal-gradient);
  box-shadow: var(--metal-ring-shadow);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.device-shell {
  --console-padding: clamp(10px, 2.4vw, 40px);
  width: min(100%, 1080px);
  min-width: 0;
  max-width: 100%;
}

.console {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: var(--console-padding) var(--console-padding) 0;
  border-radius: inherit;
  column-gap: clamp(12px, 3vw, 48px);
  row-gap: clamp(12px, 2.4vw, 24px);
}

@media (max-width: 1000px) {
  .device-shell {
    --round-control-size: clamp(32px, 4vw, 38px);
  }
}

@media (max-width: 640px) {
  .device-shell {
    --console-padding: clamp(12px, 4vw, 18px);
    --round-control-size: clamp(32px, 9vw, 38px);
    --device-radius: clamp(20px, 8vw, 32px);
    --bezel-radius: clamp(14px, 6vw, 24px);
    --screen-radius: clamp(8px, 4vw, 14px);
    width: 100%;
    height: calc(100svh - 24px);
    min-height: 0;
  }

  .viewer {
    padding: 12px;
  }

  .console {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto auto;
    height: 100%;
    column-gap: 0;
    row-gap: 24px;
  }
}
</style>
