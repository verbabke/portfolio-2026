<script setup>
import { ref } from "vue";
import { useProgress } from "@tresjs/cientos";
import BootSequence from "./components/BootSequence.vue";
import PortfolioScene from "./components/PortfolioScene.vue";
import DeviceShell from "./components/device/DeviceShell.vue";
import WebGLWarning from "./components/WebGLWarning.vue";

const isPowered = ref(false);
const isSceneMounted = ref(false);
const isSceneVisible = ref(false);
const hasBootCompleted = ref(false);
const portfolioScene = ref(null);
const showWebGLWarning = ref(false);
let powerTrigger = null;
const { hasFinishLoading, progress } = await useProgress();

function webGLAvailable() {
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function closeWebGLWarning() {
  showWebGLWarning.value = false;
  powerTrigger?.focus();
}

function togglePower() {
  if (isPowered.value) {
    hasBootCompleted.value = false;
    isSceneVisible.value = false;
    isSceneMounted.value = false;
    isPowered.value = false;
    return;
  }

  if (!webGLAvailable()) {
    powerTrigger = document.activeElement;
    showWebGLWarning.value = true;
    return;
  }

  hasBootCompleted.value = false;
  isSceneVisible.value = false;
  isSceneMounted.value = true;
  isPowered.value = true;
}

function handleBootComplete() {
  hasBootCompleted.value = true;
  isSceneVisible.value = true;
}

function handleBootReveal() {
  isSceneVisible.value = true;
}

function handleDirection(direction) {
  portfolioScene.value?.handleDirection?.(direction);
}

function handleConfirm() {
  portfolioScene.value?.activateFocusedIcon?.();
}

function handleBack() {
  portfolioScene.value?.handleBack?.();
}
</script>

<template>
  <DeviceShell
    :powered="isPowered"
    :screen-active="isSceneVisible"
    @toggle-power="togglePower"
    @direction="handleDirection"
    @confirm="handleConfirm"
    @back="handleBack"
  >
    <BootSequence
      v-if="!hasBootCompleted"
      :powered="isPowered"
      :has-finish-loading="hasFinishLoading"
      :progress="progress"
      @reveal="handleBootReveal"
      @complete="handleBootComplete"
    />

    <PortfolioScene
      v-if="isSceneMounted"
      ref="portfolioScene"
      :visible="isSceneVisible"
      :ready="hasFinishLoading"
    />
  </DeviceShell>

  <WebGLWarning :visible="showWebGLWarning" @close="closeWebGLWarning" />
</template>
