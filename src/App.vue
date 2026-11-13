<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useProgress } from "@tresjs/cientos";
import { useRoute, useRouter } from "vue-router";
import BootSequence from "./components/BootSequence.vue";
import PortfolioScene from "./components/PortfolioScene.vue";
import DeviceShell from "./components/device/DeviceShell.vue";
import RouteContent from "./components/RouteContent.vue";
import WebGLWarning from "./components/WebGLWarning.vue";
import { getRouteMetadata, getRouteState } from "./router";

const route = useRoute();
const router = useRouter();
const routeState = computed(() => getRouteState(route));
const isPowered = ref(Boolean(routeState.value.iconId));
const isSceneMounted = ref(false);
const isSceneVisible = ref(isPowered.value);
const hasBootCompleted = ref(isPowered.value);
const portfolioScene = ref(null);
const showWebGLWarning = ref(false);
const isMounted = ref(false);
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

function updateMetadata() {
  if (typeof document === "undefined") return;

  const metadata = getRouteMetadata(route);
  const canonical = new URL(route.fullPath, window.location.origin).href;
  document.title = metadata.title;

  const setMeta = (selector, attribute, value) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      document.head.append(element);
    }
    element.setAttribute(attribute, value);
  };

  setMeta('meta[name="description"]', "name", "description");
  document.head.querySelector('meta[name="description"]').content =
    metadata.description;
  setMeta('meta[property="og:title"]', "property", "og:title");
  document.head.querySelector('meta[property="og:title"]').content =
    metadata.title;
  setMeta('meta[property="og:description"]', "property", "og:description");
  document.head.querySelector('meta[property="og:description"]').content =
    metadata.description;
  setMeta('meta[property="og:url"]', "property", "og:url");
  document.head.querySelector('meta[property="og:url"]').content = canonical;
  setMeta('meta[property="og:image"]', "property", "og:image");
  document.head.querySelector('meta[property="og:image"]').content = new URL(
    metadata.image,
    window.location.origin,
  ).href;

  let canonicalLink = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.append(canonicalLink);
  }
  canonicalLink.href = canonical;
}

function activateDirectRoute() {
  if (!routeState.value.iconId) return;

  if (!webGLAvailable()) {
    powerTrigger = document.querySelector('[aria-label="Power"]');
    showWebGLWarning.value = true;
    return;
  }

  isPowered.value = true;
  isSceneVisible.value = true;
  hasBootCompleted.value = true;
  isSceneMounted.value = true;
}

function navigateTo(path) {
  if (route.fullPath !== path) router.push(path);
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

watch(
  () => route.fullPath,
  () => {
    updateMetadata();
    if (isMounted.value && routeState.value.iconId && !isSceneMounted.value) {
      activateDirectRoute();
    }
  },
);

onMounted(() => {
  isMounted.value = true;
  updateMetadata();
  activateDirectRoute();
});

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

function handleDirectionStart(direction) {
  portfolioScene.value?.startScrolling?.(direction);
}

function handleDirectionEnd(direction) {
  portfolioScene.value?.stopScrolling?.(direction);
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
    @direction-start="handleDirectionStart"
    @direction-end="handleDirectionEnd"
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
      :route-icon-id="routeState.iconId"
      :route-project-id="routeState.projectId"
      @navigate="navigateTo"
    />

    <RouteContent
      v-else-if="route.name !== 'home' && isPowered"
      :route-name="route.name"
      :project-id="routeState.projectId"
      @navigate="navigateTo"
    />
  </DeviceShell>

  <WebGLWarning :visible="showWebGLWarning" @close="closeWebGLWarning" />
</template>
