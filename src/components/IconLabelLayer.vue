<script setup>
import { reactive, ref, watch } from "vue";

const props = defineProps({
  icons: {
    type: Array,
    required: true,
  },
  isDetailOpen: {
    type: Boolean,
    default: false,
  },
  openedIconId: {
    type: String,
    default: null,
  },
  isRevealingDetail: {
    type: Boolean,
    default: false,
  },
  isPositionSettled: {
    type: Boolean,
    default: true,
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

const frozenStyles = reactive({});

function captureStyles() {
  props.icons.forEach((icon, index) => {
    frozenStyles[icon.id] = props.getLabelStyle(icon, index);
  });
}

const previousOpenedIconId = ref(props.openedIconId);

watch(
  () => props.isPositionSettled,
  (settled) => {
    if (settled) {
      captureStyles();
      previousOpenedIconId.value = props.openedIconId;
    }
  },
);

watch(
  () => props.openedIconId,
  (id, oldId) => {
    if (oldId && !id) {
      previousOpenedIconId.value = oldId;
    }
  },
);
</script>

<template>
  <div
    class="icon-label-layer"
    :class="{ 'icon-label-layer-compact': isCompact }"
    aria-hidden="true"
  >
    <div
      v-for="(icon, index) in icons"
      :key="`${icon.id}-label`"
      class="icon-label"
      :class="{
        'icon-label-active': isDetailOpen
          ? icon.id === openedIconId && isRevealingDetail
          : isIconFocused(index),
        'icon-label-dismissed':
          (isDetailOpen && icon.id !== openedIconId) ||
          (!isDetailOpen &&
            !isPositionSettled &&
            icon.id === previousOpenedIconId),
        'icon-label-pending':
          isDetailOpen && icon.id === openedIconId && !isRevealingDetail,
      }"
      :style="frozenStyles[icon.id] ?? getLabelStyle(icon, index)"
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
  color: var(--text-color);
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  transform: translateX(-50%) translateY(var(--label-lift));
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    color 180ms ease;
}

.icon-label-active {
  --label-lift: -10px;
}

.icon-label-dismissed {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
  pointer-events: none;
}

.icon-label-pending {
  opacity: 0;
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
