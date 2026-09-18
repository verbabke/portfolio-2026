<script setup>
import { onBeforeUnmount, shallowRef, watch } from "vue";
import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  panel: {
    type: Object,
    required: true,
  },
  sections: {
    type: Array,
    default: () => [],
  },
  activeSectionId: {
    type: String,
    default: "",
  },
  panelIndex: {
    type: Number,
    default: 0,
  },
  panelCount: {
    type: Number,
    default: 1,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const texture = shallowRef(null);
let canvas;
let context;

function getCanvas() {
  if (!canvas && typeof document !== "undefined") {
    canvas = document.createElement("canvas");
    canvas.width = 1200;
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

  const visibleLines = lines.slice(0, maxLines);
  visibleLines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function drawBulletList(ctx, bullets, x, y, maxWidth, lineHeight) {
  bullets.slice(0, 3).forEach((bullet, index) => {
    const lineY = y + index * lineHeight;
    ctx.fillStyle = "#8ff1c6";
    ctx.fillRect(x, lineY - 10, 10, 10);
    ctx.fillStyle = "#e7fff2";
    drawWrappedText(ctx, bullet, x + 24, lineY, maxWidth - 24, 24, 2);
  });
}

function renderTexture() {
  const ctx = getCanvas();

  if (!ctx || !texture.value || !props.section || !props.panel) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#11261d");
  gradient.addColorStop(0.55, "#0a1511");
  gradient.addColorStop(1, "#07100d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(150, 255, 205, 0.06)";
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.strokeStyle = "rgba(144, 255, 203, 0.38)";
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  ctx.fillStyle = "#9af7cb";
  ctx.font = '24px "Share Tech Mono"';
  ctx.fillText("BOOT MODE : HANDHELD OS", 54, 64);
  ctx.fillText(`STATUS : ${String(props.section.status).toUpperCase()}`, 54, 98);
  ctx.fillText(
    `CARD ${String(props.panelIndex + 1).padStart(2, "0")} / ${String(props.panelCount).padStart(2, "0")}`,
    930,
    64,
  );

  const sidebarX = 54;
  const sidebarY = 138;
  const sidebarWidth = 270;
  const sidebarHeight = 470;

  ctx.strokeStyle = "rgba(110, 236, 184, 0.18)";
  ctx.strokeRect(sidebarX, sidebarY, sidebarWidth, sidebarHeight);

  props.sections.forEach((section, index) => {
    const tabY = sidebarY + 18 + index * 142;
    const isActive = section.id === props.activeSectionId;

    ctx.fillStyle = isActive ? "#133326" : "#0d1814";
    ctx.fillRect(sidebarX + 14, tabY, sidebarWidth - 28, 120);

    ctx.strokeStyle = isActive ? "#9af7cb" : "rgba(110, 236, 184, 0.22)";
    ctx.strokeRect(sidebarX + 14, tabY, sidebarWidth - 28, 120);

    ctx.fillStyle = isActive ? "#dfffee" : "#8fc8af";
    ctx.font = '28px "Press Start 2P"';
    ctx.fillText(section.title.toUpperCase(), sidebarX + 34, tabY + 42);
    ctx.font = '21px "Share Tech Mono"';
    drawWrappedText(
      ctx,
      section.subtitle.toUpperCase(),
      sidebarX + 34,
      tabY + 82,
      sidebarWidth - 70,
      26,
      2,
    );
  });

  const contentX = 358;
  const contentY = 138;
  const contentWidth = 788;
  const contentHeight = 470;

  ctx.fillStyle = "rgba(9, 18, 14, 0.94)";
  ctx.fillRect(contentX, contentY, contentWidth, contentHeight);
  ctx.strokeStyle = "rgba(110, 236, 184, 0.22)";
  ctx.strokeRect(contentX, contentY, contentWidth, contentHeight);

  ctx.fillStyle = "#8ff1c6";
  ctx.font = '22px "Share Tech Mono"';
  ctx.fillText(String(props.panel.meta).toUpperCase(), contentX + 26, contentY + 42);

  ctx.fillStyle = "#f1fff7";
  ctx.font = '32px "Press Start 2P"';
  drawWrappedText(ctx, props.panel.title.toUpperCase(), contentX + 26, contentY + 96, contentWidth - 52, 42, 2);

  ctx.fillStyle = "#e6fff1";
  ctx.font = '30px "Rajdhani"';
  drawWrappedText(ctx, props.panel.body, contentX + 26, contentY + 168, contentWidth - 52, 34, 4);

  ctx.font = '28px "Rajdhani"';
  drawBulletList(ctx, props.panel.bullets ?? [], contentX + 26, contentY + 324, contentWidth - 52, 68);

  ctx.fillStyle = "#95f8ca";
  ctx.font = '22px "Share Tech Mono"';
  ctx.fillText("LINK PORTS", contentX + 26, contentY + contentHeight - 64);

  (props.panel.links ?? []).slice(0, 3).forEach((link, index) => {
    const pillX = contentX + 170 + index * 188;

    ctx.fillStyle = "#112a20";
    ctx.fillRect(pillX, contentY + contentHeight - 90, 160, 42);
    ctx.strokeStyle = "rgba(153, 247, 203, 0.44)";
    ctx.strokeRect(pillX, contentY + contentHeight - 90, 160, 42);
    ctx.fillStyle = "#effff7";
    ctx.fillText(String(link.label).toUpperCase(), pillX + 14, contentY + contentHeight - 62);
  });

  ctx.fillStyle = "#98ceb4";
  ctx.font = '21px "Share Tech Mono"';
  ctx.fillText("L/R CHANGE SECTION", 54, 704);
  ctx.fillText("U/D CHANGE CARD", 380, 704);
  ctx.fillText("START NEXT CARD", 680, 704);
  ctx.fillText("SELECT RETURN", 944, 704);

  texture.value.needsUpdate = true;
}

watch(
  () => [
    props.section,
    props.panel,
    props.sections,
    props.activeSectionId,
    props.panelIndex,
    props.panelCount,
    props.compact,
  ],
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
  return {
    minX: 0.4,
    maxX: 14.2,
    minY: -4.7,
    maxY: 4.7,
  };
}

defineExpose({
  getBounds,
});
</script>

<template>
  <TresGroup :position="compact ? [2.9, 0, -1.4] : [5.3, 0.1, -1.2]">
    <TresMesh :position="[0.1, -0.14, -0.18]">
      <TresPlaneGeometry :args="compact ? [13, 8.6] : [13.8, 9.2]" />
      <TresMeshBasicMaterial color="#07100d" :opacity="0.82" transparent />
    </TresMesh>

    <TresMesh>
      <TresPlaneGeometry :args="compact ? [12.6, 8.2] : [13.4, 8.8]" />
      <TresMeshBasicMaterial :map="texture" :tone-mapped="false" />
    </TresMesh>
  </TresGroup>
</template>