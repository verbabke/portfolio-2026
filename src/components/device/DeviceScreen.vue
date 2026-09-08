<script setup>
defineProps({
  powered: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="screen-bezel">
    <div class="screen" :class="{ 'screen-off': !powered }">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.screen-bezel {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: clamp(10px, 1.6vw, 17px);
  border-radius: var(--bezel-radius);
  background: var(--bezel-dark);
  box-shadow: var(--surface-inset);
}

.screen-bezel::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: -4px;
  padding: 4px;
  border: 1px solid #77756e;
  border-radius: var(--bezel-radius);
  background: var(--metal-gradient);
  box-shadow: var(--metal-inset);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.screen {
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;
  aspect-ratio: 2.48 / 1;
  overflow: hidden;
  isolation: isolate;
  border-radius: var(--screen-radius);
  clip-path: inset(0 round var(--screen-radius));
  background: var(--screen-color);
}

.screen-off {
  background: #101312;
}

.screen-off::before,
.screen-off::after {
  display: none;
}

.screen::before {
  content: "";
  position: absolute;
  z-index: 2;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: var(--screen-glow);
}

.screen::after {
  content: "";
  position: absolute;
  z-index: 3;
  inset: 0;
  pointer-events: none;
  background: var(--screen-overlay);
  mix-blend-mode: multiply;
}

.screen canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 1000px) {
  .screen {
    aspect-ratio: 1.7 / 1;
    min-height: clamp(300px, 50svh, 500px);
  }
}

@media (max-width: 640px) {
  .screen-bezel {
    display: flex;
    min-height: 0;
  }

  .screen {
    flex: 1 1 auto;
    min-height: 0;
    aspect-ratio: auto;
  }
}
</style>
