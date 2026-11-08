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
      class="icon-label select-none"
      :class="{
        'icon-label-active': isDetailOpen
          ? icon.id === openedIconId && isRevealingDetail
          : isIconFocused(index),
        'icon-label-dismissed':
          (isDetailOpen && (icon.id !== openedIconId || isCompact)) ||
          (!isDetailOpen &&
            !isPositionSettled &&
            icon.id === previousOpenedIconId),
        'icon-label-pending':
          isDetailOpen && icon.id === openedIconId && !isRevealingDetail,
      }"
      :style="
        isPositionSettled || (isDetailOpen && icon.id === openedIconId)
          ? getLabelStyle(icon, index)
          : (frozenStyles[icon.id] ?? getLabelStyle(icon, index))
      "
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
  color: var(--screen-text);
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
  bottom: 120px;
  font-size: 14px;
  transition:
    left 300ms cubic-bezier(0.2, 0.75, 0.25, 1),
    opacity 180ms ease,
    transform 180ms ease,
    color 180ms ease;
}

@media (max-width: 640px) {
  .icon-label {
    bottom: 120px;
    font-size: 14px;
  }
}

/* The icons shrink with the screen width, so the label grows as it narrows. */
@media (min-width: 641px) and (max-width: 1140px) {
  .icon-label {
    bottom: clamp(64px, calc(64px + (900px - 100vw) / 30), 72px);
    font-size: clamp(14px, calc(14px + (1140px - 100vw) / 250), 16px);
  }
}
</style>
