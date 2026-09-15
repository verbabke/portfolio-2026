<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { extend, useTresContext } from "@tresjs/core";
import { OrthographicCamera } from "three";

extend({
  OrthographicCamera,
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  ready: {
    type: Boolean,
    default: false,
  },
  getSceneObjects: {
    type: Function,
    required: true,
  },
});

const { sizes } = useTresContext();
const orthographicCamera = ref(null);
const near = 0.1;
const far = 100;
const zoom = 1;
const z = 30;

const cameraSettings = reactive({
  x: 0,
  y: -0.5,
  viewHeight: 16,
});

let fitFrame = 0;

const aspect = computed(() => sizes.aspectRatio.value || 1);

const cameraBounds = computed(() => {
  const top = cameraSettings.viewHeight / 2;
  const right = top * aspect.value;

  return {
    left: -right,
    right,
    top,
    bottom: -top,
  };
});

function applyCameraSettings() {
  const camera = orthographicCamera.value;

  if (!camera) {
    return;
  }

  camera.left = cameraBounds.value.left;
  camera.right = cameraBounds.value.right;
  camera.top = cameraBounds.value.top;
  camera.bottom = cameraBounds.value.bottom;
  camera.near = near;
  camera.far = far;
  camera.zoom = zoom;
  camera.position.set(cameraSettings.x, cameraSettings.y, z);
  camera.lookAt(cameraSettings.x, cameraSettings.y, 0);
  camera.updateProjectionMatrix();
}

function fitScene() {
  const sceneObjects = props.getSceneObjects();

  if (!sceneObjects.length) {
    return;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const object of sceneObjects) {
    const bounds = object.getBounds?.();

    if (!bounds) {
      continue;
    }

    minX = Math.min(minX, bounds.minX);
    minY = Math.min(minY, bounds.minY);
    maxX = Math.max(maxX, bounds.maxX);
    maxY = Math.max(maxY, bounds.maxY);
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return;
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const horizontalHeight = width / Math.max(aspect.value, 0.001);
  const paddedHeight = Math.max(height + 2, horizontalHeight + 1.5) * 1.12;

  cameraSettings.viewHeight = Math.max(paddedHeight, 6);
  cameraSettings.x = minX + width / 2;
  cameraSettings.y = minY + height / 2;
}

function scheduleSceneFit() {
  window.cancelAnimationFrame(fitFrame);
  fitFrame = window.requestAnimationFrame(() => {
    fitScene();
    applyCameraSettings();
  });
}

watch(sizes.aspectRatio, scheduleSceneFit);

watch(
  () => [props.visible, props.ready],
  async ([visible, ready]) => {
    if (!visible || !ready) {
      return;
    }

    await nextTick();
    scheduleSceneFit();
  },
);

onMounted(() => {
  applyCameraSettings();
  scheduleSceneFit();
});

onBeforeUnmount(() => {
  window.cancelAnimationFrame(fitFrame);
});
</script>

<template>
  <TresOrthographicCamera ref="orthographicCamera" />
</template>
