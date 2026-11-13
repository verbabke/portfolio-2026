<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useProgress } from "@tresjs/cientos";
import { useRoute, useRouter } from "vue-router";
import BootSequence from "./components/BootSequence.vue";
import PortfolioScene from "./components/PortfolioScene.vue";
import DeviceShell from "./components/device/DeviceShell.vue";
import RouteContent from "./components/RouteContent.vue";
import WebGLWarning from "./components/WebGLWarning.vue";
import { useImagePreload } from "./composables/useImagePreload";
import { getRouteMetadata, getRouteState } from "./router";
import { seo } from "./data/seo";

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
const {
  imagesReady,
  imageProgress,
  hasImagesToPreload,
  preloadImages,
  cancelImagePreload,
} = useImagePreload();
const bootReady = computed(() => hasFinishLoading.value && imagesReady.value);
const bootProgress = computed(() =>
  hasImagesToPreload.value
    ? Math.round((progress.value + imageProgress.value) / 2)
    : progress.value,
);

function preloadRouteImages() {
  const { project, page } = getRouteMetadata(route);
  const content = project ?? page;
  const panels = content?.content ??
    content?.panels ?? [{ images: content?.img ?? [] }];
  preloadImages(
    panels.flatMap((panel) => (panel.images ?? []).map((image) => image.src)),
  );
}

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
  document.title = metadata.title;

  const setMeta = (selector, attribute, name, content) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      document.head.append(element);
    }
    element.setAttribute(attribute, name);
    element.content = content;
  };

  setMeta(
    'meta[name="description"]',
    "name",
    "description",
    metadata.description,
  );
  setMeta('meta[property="og:type"]', "property", "og:type", metadata.ogType);
  setMeta(
    'meta[property="og:title"]',
    "property",
    "og:title",
    metadata.ogTitle ?? metadata.title,
  );
  setMeta(
    'meta[property="og:description"]',
    "property",
    "og:description",
    metadata.ogDescription ?? metadata.description,
  );
  setMeta('meta[property="og:url"]', "property", "og:url", metadata.canonical);
  setMeta(
    'meta[property="og:image"]',
    "property",
    "og:image",
    new URL(metadata.image, seo.siteUrl).href,
  );
  setMeta(
    'meta[property="og:site_name"]',
    "property",
    "og:site_name",
    seo.siteName,
  );
  setMeta(
    'meta[name="twitter:card"]',
    "name",
    "twitter:card",
    metadata.twitterCard,
  );

  let canonicalLink = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.append(canonicalLink);
  }
  canonicalLink.href = metadata.canonical;
}

function activateDirectRoute(skipBoot = false) {
  if (!routeState.value.iconId) return;

  if (!webGLAvailable()) {
    powerTrigger = document.querySelector('[aria-label="Power"]');
    showWebGLWarning.value = true;
    return;
  }

  if (!skipBoot) preloadRouteImages();
  isPowered.value = true;
  isSceneVisible.value = skipBoot;
  hasBootCompleted.value = skipBoot;
  isSceneMounted.value = true;
}

function navigateTo(path) {
  if (route.fullPath !== path) router.push(path);
}

function togglePower() {
  if (isPowered.value) {
    cancelImagePreload();
    hasBootCompleted.value = false;
    isSceneVisible.value = false;
    isSceneMounted.value = false;
    isPowered.value = false;
    navigateTo("/");
    return;
  }

  if (!webGLAvailable()) {
    powerTrigger = document.activeElement;
    showWebGLWarning.value = true;
    return;
  }

  preloadRouteImages();
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

watch(
  () => route.fullPath,
  () => {
    if (isMounted.value && isSceneMounted.value && !hasBootCompleted.value) {
      preloadRouteImages();
    }
  },
);

onMounted(() => {
  isMounted.value = true;
  updateMetadata();
  const navigation = performance.getEntriesByType("navigation")[0];
  activateDirectRoute(navigation?.type === "reload");
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
      :has-finish-loading="bootReady"
      :progress="bootProgress"
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
