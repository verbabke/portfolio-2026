<script setup>
import { ref } from "vue";
import { useLoop } from "@tresjs/core";

const props = defineProps({
  hovered: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Array,
    default: () => [0, 0, 0],
  },
  floatDelay: {
    type: Number,
    default: 0,
  },
});

const icon = ref(null);
const fullTurn = Math.PI * 2;
const spinCount = 2;
let lift = 0;
let spin = 0;
let burstStart = 0;
let burstTarget = null;
let burstElapsed = 0;
let frontFacingTarget = 0;
let phase = "idle";
let wasHovered = false;

useLoop().onBeforeRender(({ delta, elapsed }) => {
  if (!icon.value) return;

  const targetLift = props.hovered ? 3 : 0;
  const easing = 1 - Math.exp(-8 * delta);
  lift += (targetLift - lift) * easing;

  if (props.hovered) {
    if (!wasHovered) {
      frontFacingTarget = Math.round(spin / fullTurn) * fullTurn;
      phase = "align";
    }

    if (phase === "align") {
      spin += (frontFacingTarget - spin) * (1 - Math.exp(-12 * delta));

      if (Math.abs(frontFacingTarget - spin) < 0.001) {
        spin = frontFacingTarget;
        burstStart = spin;
        burstTarget = spin + fullTurn * spinCount;
        burstElapsed = 0;
        phase = "burst";
      }
    } else if (phase === "burst") {
      burstElapsed += delta;
      const progress = Math.min(burstElapsed / (spinCount * 0.28), 1);
      const easedProgress =
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      spin = burstStart + (burstTarget - burstStart) * easedProgress;

      if (progress === 1) {
        spin = burstTarget;
        burstTarget = null;
        phase = "slow";
      }
    } else {
      spin += 0.35 * delta;
    }
  } else {
    burstTarget = null;
    phase = "idle";
    const frontFacingSpin = Math.round(spin / fullTurn) * fullTurn;
    spin += (frontFacingSpin - spin) * (1 - Math.exp(-10 * delta));
  }

  wasHovered = props.hovered;
  icon.value.position.set(
    props.position[0],
    props.position[1] +
      Math.sin(elapsed * 1.25 + props.floatDelay) * 0.14 +
      lift * 0.32,
    props.position[2],
  );
  icon.value.rotation.y = spin;
});

function getObject3D() {
  return icon.value;
}

defineExpose({
  getObject3D,
});
</script>

<template>
  <TresGroup ref="icon" :position="position">
    <slot />
  </TresGroup>
</template>
