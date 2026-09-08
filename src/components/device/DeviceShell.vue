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

defineEmits(["toggle-power"]);
</script>

<template>
  <main class="viewer">
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
        <DeviceControls />
        <DeviceSocials class="lower-social-panel" />
      </div>

      <DeviceVolume />
    </section>
  </main>
</template>

<style>
.viewer {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: clamp(18px, 5vw, 72px) clamp(25px, 3vw, 32px);
  background: var(--page-gradient);
}

.device-panel {
  position: relative;
  z-index: 1;
  border: 3px solid var(--case-edge);
  border-radius: var(--panel-radius, var(--device-radius));
  background:
    linear-gradient(
      var(--light-angle),
      var(--light-shadow),
      var(--light-highlight)
    ),
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
  border: 1px solid #77756e;
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
