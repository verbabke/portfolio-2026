<script setup>
import { computed } from "vue";
import { Align, RoundedBox, Text3D } from "@tresjs/cientos";
import IconMotion from "../IconMotion.vue";

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  mark: {
    type: String,
    required: true,
  },
  textColor: {
    type: String,
    default: "#101312",
  },
  focused: {
    type: Boolean,
    default: false,
  },
  floatDelay: {
    type: Number,
    default: 0,
  },
  position: {
    type: Array,
    default: () => [0, 0, 0],
  },
  iconOffset: {
    type: Array,
    default: () => [0, 0, 0.2],
  },
  scale: {
    type: Number,
    default: 1,
  },
  // Idle spin
  spin: {
    type: Boolean,
    default: false,
  },
  opacity: {
    type: Number,
    default: 1,
  },
});
const faces = computed(() => [
  { z: 0.32, rotation: 0 },
  ...(props.spin ? [{ z: -0.32, rotation: Math.PI }] : []),
]);
</script>

<template>
  <TresGroup :position="props.position">
    <IconMotion
      :hovered="props.focused"
      :spin-while-hovered="props.spin"
      :burst="!props.spin"
      :position="props.iconOffset"
      :opacity="props.opacity"
      :opacity-damping="12"
      :float-delay="props.floatDelay"
    >
      <RoundedBox
        :args="[
          3.3 * props.scale,
          3.3 * props.scale,
          0.62 * props.scale,
          5,
          0.22 * props.scale,
        ]"
      >
        <TresMeshStandardMaterial
          :color="props.color"
          :roughness="0.48"
          :metalness="0.04"
        />
      </RoundedBox>
      <TresGroup
        v-for="face in faces"
        :key="face.z"
        :position="[0, 0, face.z * props.scale]"
        :rotation="[0, face.rotation, 0]"
      >
        <Align>
          <Suspense>
            <Text3D
              font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
              :text="props.mark"
              :size="0.82 * props.scale"
              :height="0.1 * props.scale"
              :curve-segments="3"
              :bevel-enabled="true"
              :bevel-thickness="0.025 * props.scale"
              :bevel-size="0.018 * props.scale"
              :bevel-segments="2"
            >
              <TresMeshStandardMaterial
                :color="props.textColor"
                :roughness="0.48"
              />
            </Text3D>
            <template #fallback></template>
          </Suspense>
        </Align>
      </TresGroup>
    </IconMotion>
  </TresGroup>
</template>
