<script setup>
import { ref } from "vue";
import { TresCanvas, extend } from "@tresjs/core";
import {
  BrightnessContrastPmndrs,
  EffectComposerPmndrs,
  HueSaturationPmndrs,
  PixelationPmndrs,
} from "@tresjs/post-processing";
import {
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
} from "three";
import OrthographicFitCamera from "./OrthographicFitCamera.vue";
import SceneIcon from "./SceneIcon.vue";

extend({
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
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
});

const pixelSize = 4;
const hoveredIcon = ref(null);
const iconRefs = new Map();
const icons = [
  {
    id: "profile",
    path: "/models/profile.glb",
    position: [-10, 0, 0],
    floatDelay: 0,
    scale: 1.3,
  },
  {
    id: "folder",
    path: "/models/folder.glb",
    position: [0, -1.5, 0],
    floatDelay: 2,
    scale: 1,
  },
  {
    id: "envelope",
    path: "/models/envelope.glb",
    position: [10, -1, 0],
    floatDelay: 4,
    scale: 1,
  },
];

function setIconRef(id, instance) {
  if (instance) {
    iconRefs.set(id, instance);
    return;
  }

  iconRefs.delete(id);
}

function getSceneObjects() {
  return icons.map((icon) => iconRefs.get(icon.id)).filter(Boolean);
}
</script>

<template>
  <div class="scene" :class="{ 'scene-visible': visible }">
    <TresCanvas clear-color="#a9ebd4" :fps-limit="30">
      <OrthographicFitCamera
        :visible="visible"
        :ready="ready"
        :get-scene-objects="getSceneObjects"
      />
      <TresAmbientLight :intensity="1.25" />
      <TresDirectionalLight :position="[3, 5, 4]" :intensity="1.75" />

      <SceneIcon
        v-for="icon in icons"
        :ref="(instance) => setIconRef(icon.id, instance)"
        :key="icon.id"
        :hovered="hoveredIcon === icon.id"
        :path="icon.path"
        :position="icon.position"
        :float-delay="icon.floatDelay"
        :scale="icon.scale"
        @hover-change="(hovered) => (hoveredIcon = hovered ? icon.id : null)"
      />

      <EffectComposerPmndrs>
        <PixelationPmndrs :granularity="pixelSize" />
        <HueSaturationPmndrs :saturation="0.2" />
        <BrightnessContrastPmndrs :brightness="0.05" :contrast="0.13" />
      </EffectComposerPmndrs>
    </TresCanvas>
  </div>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

.scene-visible {
  visibility: visible;
}
</style>
