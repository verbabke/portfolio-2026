<script setup>
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
  MeshStandardMaterial,
  OrthographicCamera,
} from "three";
import ProjectTileIcon from "./ProjectTileIcon.vue";

extend({
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
});

defineProps({
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
    required: true,
  },
});
</script>

<template>
  <!-- A small canvas of its own  -->
  <!-- the main scene sits behind the opaque detail view. -->
  <TresCanvas :alpha="true" :clear-alpha="0" :fps-limit="30">
    <TresOrthographicCamera
      make-default
      :args="[-2.4, 2.4, 2.4, -2.4, 0.1, 100]"
      :position="[0, 0, 30]"
      :look-at="[0, 0, 0]"
    />
    <TresAmbientLight :intensity="1.25" />
    <TresDirectionalLight :position="[3, 5, 4]" :intensity="1.75" />

    <ProjectTileIcon
      focused
      spin
      :color="color"
      :mark="mark"
      :text-color="textColor"
      :position="[0, -0.8, 0]"
    />

    <EffectComposerPmndrs>
      <PixelationPmndrs :granularity="2" />
      <HueSaturationPmndrs :saturation="0.2" />
      <BrightnessContrastPmndrs :brightness="0.05" :contrast="0.13" />
    </EffectComposerPmndrs>
  </TresCanvas>
</template>
