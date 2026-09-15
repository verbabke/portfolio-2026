<script setup>
import { ref } from "vue";
import { useProgress } from "@tresjs/cientos";
import BootSequence from "./components/BootSequence.vue";
import PortfolioScene from "./components/PortfolioScene.vue";
import DeviceShell from "./components/device/DeviceShell.vue";

const isPowered = ref(false);
const isSceneMounted = ref(false);
const isSceneVisible = ref(false);
const { hasFinishLoading, progress } = await useProgress();

function togglePower() {
  if (isPowered.value) {
    isSceneVisible.value = false;
    isSceneMounted.value = false;
    isPowered.value = false;
    return;
  }

  isSceneVisible.value = false;
  isSceneMounted.value = true;
  isPowered.value = true;
}
</script>

<template>
  <DeviceShell
    :powered="isPowered"
    :screen-active="isSceneVisible"
    @toggle-power="togglePower"
  >
    <BootSequence
      :powered="isPowered"
      :has-finish-loading="hasFinishLoading"
      :progress="progress"
      @complete="isSceneVisible = true"
    />

    <PortfolioScene
      v-if="isSceneMounted"
      :visible="isSceneVisible"
      :ready="hasFinishLoading"
    />
  </DeviceShell>
</template>
