<script setup>
defineEmits(["direction"]);
</script>

<template>
  <section class="button-panel sticker-txt" aria-label="Console controls">
    <div class="d-pad">
      <div class="d-pad-face">
        <button
          v-for="direction in ['top', 'right', 'bottom', 'left']"
          :key="direction"
          class="d-pad-direction"
          :class="`d-pad-${direction}`"
          type="button"
          :aria-label="direction"
          @click="$emit('direction', direction)"
        ></button>
        <button
          class="d-pad-center"
          type="button"
          aria-label="Confirm"
        ></button>
      </div>
    </div>
    <div class="console-buttons">
      <button
        v-for="label in ['Select', 'Start']"
        :key="label"
        class="console-button select-none"
        type="button"
      >
        {{ label }}
      </button>
    </div>
  </section>
</template>

<style>
.button-panel {
  --d-pad-size: clamp(104px, 13vw, 140px);
  --console-button-width: 72px;
  --console-panel-gap: 16px;
  position: relative;
  z-index: 1;
  order: 2;
  display: flex;
  max-height: 150px;
  justify-content: space-between;
  gap: var(--console-panel-gap);
  margin-bottom: 12px;
  padding: 12px;
  border-top: 2px solid #111312;
  border-left: 2px solid #4c4d49;
  border-radius: 28px;
  background: linear-gradient(135deg, #202321, #373a37 55%, #181a19);
  box-shadow:
    inset 2px 2px 3px #ffffff1f,
    inset -3px -4px 7px #00000099;
}
.d-pad {
  align-self: center;
  position: relative;
  flex: 0 0 auto;
  width: var(--d-pad-size);
  aspect-ratio: 1;
  border: 2px solid #070808;
  border-radius: 50%;
  background: #202020;
  box-shadow:
    inset 1px 1px 2px #ffffff1f,
    inset -3px -4px 6px #000000b3,
    0 2px 3px #00000080;
}
.d-pad-face {
  position: absolute;
  inset: 3px;
  border: 1px solid #090a0a;
  border-radius: 50%;
  background: linear-gradient(135deg, #383b39, #202321 68%);
  box-shadow:
    inset 1px 1px 2px #ffffff22,
    inset -2px -3px 4px #00000080,
    0 1px 2px #00000066;
  transition:
    transform 80ms linear,
    background 80ms linear;
}
.d-pad-direction {
  position: absolute;
  z-index: 1;
  inset: 0;
  cursor: pointer;
  border: 0;
  background: transparent;
}
.d-pad-direction::before {
  content: "";
  position: absolute;
  width: 14%;
  aspect-ratio: 1;
  border: solid #a19f98;
  border-width: 0 7px 7px 0;
  filter: drop-shadow(2px 2px #121313);
  transform: rotate(var(--arrow-rotation));
}
.d-pad-top {
  clip-path: polygon(28% 4%, 72% 4%, 61% 42%, 39% 42%);
}
.d-pad-top::before {
  top: 12%;
  left: 43%;
  --arrow-rotation: 225deg;
}
.d-pad-right {
  clip-path: polygon(58% 39%, 96% 28%, 96% 72%, 58% 61%);
}
.d-pad-right::before {
  top: 43%;
  right: 12%;
  --arrow-rotation: 315deg;
}
.d-pad-bottom {
  clip-path: polygon(39% 58%, 61% 58%, 72% 96%, 28% 96%);
}
.d-pad-bottom::before {
  bottom: 12%;
  left: 43%;
  --arrow-rotation: 45deg;
}
.d-pad-left {
  clip-path: polygon(4% 28%, 42% 39%, 42% 61%, 4% 72%);
}
.d-pad-left::before {
  top: 43%;
  left: 12%;
  --arrow-rotation: 135deg;
}
.d-pad-direction:active::before {
  border-color: #737570;
  filter: drop-shadow(1px 1px #080909);
  transform: translate(1px, 1px) rotate(var(--arrow-rotation));
}
.d-pad:has(.d-pad-top:active) .d-pad-face {
  transform: translateY(-1px);
  background: linear-gradient(to bottom, #3d413f, #202321 72%);
}
.d-pad:has(.d-pad-right:active) .d-pad-face {
  transform: translateX(1px);
  background: linear-gradient(to right, #3d413f, #202321 72%);
}
.d-pad:has(.d-pad-bottom:active) .d-pad-face {
  transform: translateY(1px);
  background: linear-gradient(to bottom, #202321, #3d413f);
}
.d-pad:has(.d-pad-left:active) .d-pad-face {
  transform: translateX(-1px);
  background: linear-gradient(to right, #202321, #3d413f);
}
.d-pad-center,
.console-button {
  cursor: pointer;
  border: 1px solid #080909;
  background: var(--control-surface);
  box-shadow:
    inset 1px 1px #ffffff22,
    inset -2px -2px #00000080;
}
.d-pad-center {
  position: absolute;
  top: 35%;
  left: 35%;
  z-index: 2;
  width: 30%;
  aspect-ratio: 1;
  border-width: 2px;
  border-radius: 50%;
}
.d-pad-center:active,
.console-button:active {
  background: var(--control-pressed);
  box-shadow:
    inset 2px 2px 3px #00000080,
    inset -1px -1px #ffffff1a;
  transform: translate(1px, 1px);
}
.console-buttons {
  display: flex;
  gap: 12px;
  padding: 5px;
  border: 2px solid #090a0a;
  border-radius: 16px;
  box-shadow:
    inset 2px 2px 2px #11111136,
    inset -3px -4px 6px #000000b3,
    0 1px 2px #ffffff1f;
}
.console-button {
  position: relative;
  width: var(--console-button-width);
  border-radius: 8px;
  font-size: 14px;
  color: #939393;
}
.console-button::after {
  content: "";
  position: absolute;
  right: 30%;
  bottom: 12%;
  left: 30%;
  height: clamp(4px, 0.7vw, 6px);
  border: 1px solid #080909;
  border-radius: 999px;
  box-shadow:
    inset 0 1px #ffffff38,
    inset 0 -1px #000000b3,
    0 1px 2px #000000b3;
}

@media (max-width: 800px) {
  .button-panel {
    --d-pad-size: clamp(96px, 30vw, 124px);
    --console-button-width: clamp(54px, 19vw, 72px);
    --console-panel-gap: clamp(8px, 3vw, 16px);
    order: 3;
    padding: clamp(9px, 3vw, 12px);
  }

  .console-buttons {
    justify-content: center;
    gap: clamp(6px, 2vw, 12px);
    flex-direction: column;
  }

  .console-button {
    height: 100%;
  }
}

@media (max-width: 640px) {
  .button-panel {
    --console-button-width: clamp(48px, 19vw, 60px);
    flex-grow: 1;
    justify-content: space-evenly;
  }

  .console-buttons {
    gap: clamp(4px, 1.5vw, 8px);
    flex-direction: row;
  }

  .console-button {
    height: 100%;
    font-size: clamp(10px, 2.5vw, 14px);
  }
}
</style>
