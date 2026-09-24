<script setup>
import { computed, onBeforeUnmount, shallowRef, watch } from "vue";
import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const texture = shallowRef(null);
const panelPosition = computed(() =>
  props.compact ? [0, -3.35, -0.6] : [4.7, 0.15, -0.6],
);
const panelSize = computed(() => (props.compact ? [10.6, 6.2] : [10.4, 7.4]));

let canvas;
let context;

function ensureContext() {
  if (!canvas && typeof document !== "undefined") {
    canvas = document.createElement("canvas");
    canvas.width = 1120;
    canvas.height = 760;
    context = canvas.getContext("2d");
    texture.value = new CanvasTexture(canvas);
    texture.value.colorSpace = SRGBColorSpace;
    texture.value.minFilter = LinearFilter;
    texture.value.magFilter = LinearFilter;
  }

  return context;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(candidate).width <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function renderTexture() {
  const ctx = ensureContext();

  if (!ctx || !texture.value) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#10261d");
  gradient.addColorStop(1, "#07120d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(154, 247, 203, 0.08)";
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.strokeStyle = "rgba(154, 247, 203, 0.42)";
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  ctx.fillStyle = "#8ff1c6";
  ctx.font = '22px "Share Tech Mono"';
  ctx.fillText(String(props.detail.label).toUpperCase(), 52, 66);

  ctx.fillStyle = "#f0fff7";
  ctx.font = '34px "Press Start 2P"';
  drawWrappedText(
    ctx,
    String(props.detail.title).toUpperCase(),
    52,
    132,
    canvas.width - 104,
    42,
    2,
  );

  ctx.fillStyle = "#e9fff4";
  ctx.font = '34px "Rajdhani"';
  drawWrappedText(ctx, props.detail.body, 52, 250, canvas.width - 104, 42, 5);

  ctx.fillStyle = "rgba(143, 241, 198, 0.12)";
  ctx.fillRect(52, canvas.height - 146, canvas.width - 104, 88);
  ctx.strokeStyle = "rgba(154, 247, 203, 0.26)";
  ctx.strokeRect(52, canvas.height - 146, canvas.width - 104, 88);

  ctx.fillStyle = "#9af7cb";
  ctx.font = '24px "Share Tech Mono"';
  ctx.fillText(String(props.detail.hint).toUpperCase(), 78, canvas.height - 93);

  texture.value.needsUpdate = true;
}

watch(
  () => props.detail,
  () => renderTexture(),
  { immediate: true, deep: true },
);

if (typeof document !== "undefined") {
  document.fonts?.ready.then(() => renderTexture());
}

onBeforeUnmount(() => {
  texture.value?.dispose?.();
});

function getBounds() {
  const [width, height] = panelSize.value;
  const [x, y] = panelPosition.value;

  return {
    minX: x - width / 2,
    maxX: x + width / 2,
    minY: y - height / 2,
    maxY: y + height / 2,
  };
}

defineExpose({
  getBounds,
});
</script>

<template>
  <TresGroup :position="panelPosition">
    <TresMesh :position="[0.14, -0.14, -0.18]">
      <TresPlaneGeometry :args="[panelSize[0] + 0.32, panelSize[1] + 0.32]" />
      <TresMeshBasicMaterial color="#07120d" transparent :opacity="0.9" />
    </TresMesh>

    <TresMesh>
      <TresPlaneGeometry :args="panelSize" />
      <TresMeshBasicMaterial :map="texture" :tone-mapped="false" />
    </TresMesh>
  </TresGroup>
</template>
