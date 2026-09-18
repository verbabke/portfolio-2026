<script setup>
import { ref } from "vue";
import { useLoop } from "@tresjs/core";
import { MathUtils } from "three";

const props = defineProps({
  hovered: {
    type: Boolean,
    default: false,
  },
  opacity: {
    type: Number,
    default: 1,
  },
  opacityDamping: {
    type: Number,
    default: 4.5,
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
// higher = snaps into place faster
const liftDamping = 8;
const alignDamping = 12;
const idleSpinDamping = 10;
const positionDamping = 3.8;
const materialState = new WeakMap();
const isolatedMaterials = new WeakSet();

let lift = 0;
let spin = 0;
let smoothX = props.position[0];
let smoothBaseY = props.position[1];
let smoothZ = props.position[2];
let smoothOpacity = props.opacity;
let burstStart = 0;
let burstTarget = null;
let burstElapsed = 0;
let frontFacingTarget = 0;
let phase = "idle";
let wasHovered = false;

function ensureUniqueMaterials(object) {
  if (isolatedMaterials.has(object)) {
    return;
  }

  object.traverse((child) => {
    if (!child.material) {
      return;
    }

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => material?.clone?.() ?? material);
      return;
    }

    child.material = child.material.clone?.() ?? child.material;
  });

  isolatedMaterials.add(object);
}

function applyOpacity(object, opacity) {
  object.traverse((child) => {
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    for (const material of materials) {
      if (!material) {
        continue;
      }

      if (!materialState.has(material)) {
        materialState.set(material, {
          opacity: material.opacity,
          transparent: material.transparent,
          depthWrite: material.depthWrite,
        });
      }

      const baseState = materialState.get(material);

      if (!baseState) {
        continue;
      }

      const nextOpacity = baseState.opacity * opacity;
      const isFaded = opacity < 0.999;

      material.opacity = nextOpacity;
      material.transparent = isFaded ? true : baseState.transparent;
      material.depthWrite = isFaded ? nextOpacity > 0.08 : baseState.depthWrite;
    }
  });
}

useLoop().onBeforeRender(({ delta, elapsed }) => {
  if (!icon.value) return;

  ensureUniqueMaterials(icon.value);

  const targetLift = props.hovered ? 3 : 0;
  lift = MathUtils.damp(lift, targetLift, liftDamping, delta);

  if (props.hovered) {
    if (!wasHovered) {
      frontFacingTarget = Math.round(spin / fullTurn) * fullTurn;
      phase = "align";
    }

    if (phase === "align") {
      spin = MathUtils.damp(spin, frontFacingTarget, alignDamping, delta);

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
    spin = MathUtils.damp(spin, frontFacingSpin, idleSpinDamping, delta);
  }

  wasHovered = props.hovered;

  smoothX = MathUtils.damp(smoothX, props.position[0], positionDamping, delta);
  smoothBaseY = MathUtils.damp(
    smoothBaseY,
    props.position[1],
    positionDamping,
    delta,
  );
  smoothZ = MathUtils.damp(smoothZ, props.position[2], positionDamping, delta);
  smoothOpacity = MathUtils.damp(
    smoothOpacity,
    props.opacity,
    props.opacityDamping,
    delta,
  );

  icon.value.position.set(
    smoothX,
    smoothBaseY +
      Math.sin(elapsed * 1.25 + props.floatDelay) * 0.14 +
      lift * 0.32,
    smoothZ,
  );
  icon.value.rotation.y = spin;
  applyOpacity(icon.value, smoothOpacity);
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
