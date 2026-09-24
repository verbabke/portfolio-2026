<script setup>
defineProps({
  icons: {
    type: Array,
    required: true,
  },
  isDetailOpen: {
    type: Boolean,
    default: false,
  },
  isCompact: {
    type: Boolean,
    default: false,
  },
  isIconFocused: {
    type: Function,
    required: true,
  },
  getLabelStyle: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div
    v-if="!isDetailOpen"
    class="icon-label-layer"
    :class="{ 'icon-label-layer-compact': isCompact }"
    aria-hidden="true"
  >
    <div
      v-for="(icon, index) in icons"
      :key="`${icon.id}-label`"
      class="icon-label"
      :class="{ 'icon-label-active': isIconFocused(index) }"
      :style="getLabelStyle(icon, index)"
    >
      {{ icon.label }}
    </div>
  </div>
</template>

<style scoped>
.icon-label-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.icon-label {
  --label-lift: 0px;
  position: absolute;
  bottom: 70px;
  color: #0b2b24;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  transform: translateX(-50%) translateY(var(--label-lift));
  transition:
    left 180ms ease,
    opacity 180ms ease,
    transform 180ms ease,
    color 180ms ease;
}

.icon-label-active {
  --label-lift: -10px;
}

.icon-label-layer-compact .icon-label {
  bottom: 140px;
  font-size: clamp(10px, 2vw, 13px);
}

@media (max-width: 1000px) {
  .icon-label {
    bottom: 120px;
    font-size: clamp(10px, 3vw, 14px);
  }
}
</style>
