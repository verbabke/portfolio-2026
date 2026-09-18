<script setup>
import { ref } from "vue";
import { useProgress } from "@tresjs/cientos";
import BootSequence from "./components/BootSequence.vue";
import PortfolioScene from "./components/PortfolioScene.vue";
import DeviceShell from "./components/device/DeviceShell.vue";

const isPowered = ref(false);
const isSceneMounted = ref(false);
const isSceneVisible = ref(false);
const hasBootCompleted = ref(false);
const portfolioScene = ref(null);
const { hasFinishLoading, progress } = await useProgress();

function togglePower() {
  if (isPowered.value) {
    hasBootCompleted.value = false;
    isSceneVisible.value = false;
    isSceneMounted.value = false;
    isPowered.value = false;
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

function handleDirection(direction) {
  if (direction === "left") {
    portfolioScene.value?.selectPrevious();
  } else if (direction === "right") {
    portfolioScene.value?.selectNext();
  }
}
</script>

<template>
  <DeviceShell
    :powered="isPowered"
    :screen-active="isSceneVisible"
    @toggle-power="togglePower"
    @direction="handleDirection"
  >
    <BootSequence
      v-if="!hasBootCompleted"
      :powered="isPowered"
      :has-finish-loading="hasFinishLoading"
      :progress="progress"
      @complete="handleBootComplete"
    />

    <PortfolioScene
      v-if="isSceneMounted"
      ref="portfolioScene"
      :visible="isSceneVisible"
      :ready="hasFinishLoading"
    />
  </DeviceShell>
</template>
