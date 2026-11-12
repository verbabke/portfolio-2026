<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import FadeTransition from "./FadeTransition.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
const closeButton = ref(null);

function onKeydown(event) {
  if (event.key === "Escape") emit("close");
  if (event.key === "Tab") {
    event.preventDefault();
    closeButton.value?.focus();
  }
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      window.removeEventListener("keydown", onKeydown);
      return;
    }

    window.addEventListener("keydown", onKeydown);
    await nextTick();
    closeButton.value?.focus();
  },
);

onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport to="body">
    <FadeTransition>
      <div v-if="visible" class="modal-overlay warning-overlay fade-layer">
        <section
          class="warning-dialog content-panel ui-panel"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="webgl-warning-title"
          aria-describedby="webgl-warning-description"
        >
          <h2 id="webgl-warning-title" class="content-panel-title">
            WebGL unavailable
          </h2>
          <p id="webgl-warning-description" class="content-copy">
            Unfortunately, your browser does not support WebGL. Please enable
            WebGL, then reload the page. This website requires WebGL to display
            its 3D content.
          </p>
          <button
            ref="closeButton"
            type="button"
            class="content-action ui-panel"
            @click="emit('close')"
          >
            Close
          </button>
        </section>
      </div>
    </FadeTransition>
  </Teleport>
</template>

<style scoped>
.warning-overlay {
  display: grid;
  place-items: center;
  padding: 20px;
}

.warning-dialog {
  width: min(100%, 440px);
  max-height: 100%;
  overflow: auto;
  font-family: "Press Start 2P", monospace;
}

.warning-dialog button {
  align-self: start;
}
</style>
