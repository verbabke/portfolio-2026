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
  focused: {
    type: Boolean,
    default: false,
  },
  focusFrameOffset: {
    type: Array,
    default: () => [0, 0.25, 1.1],
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  opacity: {
    type: Number,
    default: 1,
  },
  opacityDamping: {
    type: Number,
    default: 4.5,
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
    default: () => [6.2, 8],
  },
  hitDepth: {
    type: Number,
    default: 2,
  },
  hitOffsetY: {
    type: Number,
    default: 0,
  },
});

const icon = ref(null);
const boundsBox = new Box3();
const boundsSize = new Vector3();
const boundsCenter = new Vector3();

const emit = defineEmits(["hover-change", "select"]);

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
    :hovered="hovered"
    :rotate="false"
    :position="position"
    :float-delay="floatDelay"
  >
    <!-- Kept mounted (not v-if) so its float/lift state doesn't reset when focus switches icons. -->
    <TresGroup :visible="focused" :position="focusFrameOffset">
      <!-- Top-left corner -->
      <TresMesh :position="[-2.65, 3.2, 0]">
        <TresPlaneGeometry :args="[1.2, 0.16]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>
      <TresMesh :position="[-3.17, 2.68, 0]">
        <TresPlaneGeometry :args="[0.16, 1.2]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>

      <!-- Top-right corner -->
      <TresMesh :position="[2.65, 3.2, 0]">
        <TresPlaneGeometry :args="[1.2, 0.16]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>
      <TresMesh :position="[3.17, 2.68, 0]">
        <TresPlaneGeometry :args="[0.16, 1.2]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>

      <!-- Bottom-left corner -->
      <TresMesh :position="[-2.65, -2.7, 0]">
        <TresPlaneGeometry :args="[1.2, 0.16]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>
      <TresMesh :position="[-3.17, -2.18, 0]">
        <TresPlaneGeometry :args="[0.16, 1.2]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>

      <!-- Bottom-right corner -->
      <TresMesh :position="[2.65, -2.7, 0]">
        <TresPlaneGeometry :args="[1.2, 0.16]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>
      <TresMesh :position="[3.17, -2.18, 0]">
        <TresPlaneGeometry :args="[0.16, 1.2]" />
        <TresMeshBasicMaterial color="#0b2b24" />
      </TresMesh>
    </TresGroup>
  </IconMotion>

  <IconMotion
    ref="icon"
    :hovered="hovered"
    :opacity="opacity"
    :opacity-damping="opacityDamping"
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

  <!-- Invisible click/hover target sized independently from the model mesh. -->
  <TresMesh
    v-if="interactive"
    :position="[position[0], position[1] + hitOffsetY, hitDepth]"
    @pointerenter="emit('hover-change', true)"
    @pointerleave="emit('hover-change', false)"
    @click="emit('select')"
  >
    <TresPlaneGeometry :args="hitArea" />
    <TresMeshBasicMaterial transparent :opacity="0" :depth-write="false" />
  </TresMesh>
</template>
