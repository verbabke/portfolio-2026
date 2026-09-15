<script setup>
import { ref } from "vue";
import { Box3, Vector3 } from "three";
import { GLTFModel } from "@tresjs/cientos";
import IconMotion from "./IconMotion.vue";

const props = defineProps({
  hovered: {
    type: Boolean,
    default: false,
  },
  path: {
    type: String,
    required: true,
  },
  position: {
    type: Array,
    default: () => [0, 0, 0],
  },
  floatDelay: {
    type: Number,
    default: 0,
  },
  scale: {
    type: Number,
    default: 1,
  },
  hitArea: {
    type: Array,
    default: () => [6.2, 7],
  },
  hitDepth: {
    type: Number,
    default: 2,
  },
});

const icon = ref(null);
const boundsBox = new Box3();
const boundsSize = new Vector3();
const boundsCenter = new Vector3();

const emit = defineEmits(["hover-change"]);

function getObject3D() {
  return icon.value?.getObject3D?.() ?? null;
}

function getBounds() {
  const object = getObject3D();

  if (!object) {
    return null;
  }

  boundsBox.setFromObject(object);

  if (boundsBox.isEmpty()) {
    return null;
  }

  boundsBox.getCenter(boundsCenter);
  boundsBox.getSize(boundsSize);

  return {
    minX: boundsCenter.x - boundsSize.x / 2,
    maxX: boundsCenter.x + boundsSize.x / 2,
    minY: boundsCenter.y - boundsSize.y / 2,
    maxY: boundsCenter.y + boundsSize.y / 2,
  };
}

defineExpose({
  getBounds,
  getObject3D,
});
</script>

<template>
  <IconMotion
    ref="icon"
    :hovered="hovered"
    :position="position"
    :float-delay="floatDelay"
  >
    <GLTFModel
      :path="path"
      :scale="scale"
      :position="[0, 0, 0]"
      :rotation="[0, Math.PI / 2, 0]"
    />
  </IconMotion>

  <TresMesh
    :position="[position[0], position[1] + 0.25, hitDepth]"
    @pointerenter="emit('hover-change', true)"
    @pointerleave="emit('hover-change', false)"
  >
    <TresPlaneGeometry :args="hitArea" />
    <TresMeshBasicMaterial transparent :opacity="0" :depth-write="false" />
  </TresMesh>
</template>
