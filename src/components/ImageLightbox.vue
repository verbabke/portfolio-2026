<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import FadeTransition from "./FadeTransition.vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  // Which image is open, or -1 when closed.
  index: {
    type: Number,
    default: -1,
  },
});

const emit = defineEmits(["update:index"]);

const image = computed(() => props.images[props.index] ?? null);
const closeButton = ref(null);
const isMounted = ref(false);

function close() {
  emit("update:index", -1);
}

function step(by) {
  const count = props.images.length;
  emit("update:index", (props.index + by + count) % count);
}

function onKeydown(event) {
  if (event.key === "Escape") close();
  else if (event.key === "ArrowLeft") step(-1);
  else if (event.key === "ArrowRight") step(1);
}

watch(image, async (value) => {
  if (!value) {
    window.removeEventListener("keydown", onKeydown);
    return;
  }

  window.addEventListener("keydown", onKeydown);
  await nextTick();
  closeButton.value?.focus();
});

onMounted(() => {
  isMounted.value = true;
});

onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport v-if="isMounted" to="body">
    <FadeTransition>
      <div
        v-if="image"
        class="modal-overlay lightbox fade-layer"
        role="dialog"
        aria-modal="true"
        :aria-label="image.alt"
        @click="close"
      >
        <div class="lightbox-bar" @click.stop>
          <span class="content-meta">
            {{ index + 1 }} / {{ images.length }}
          </span>
          <button
            ref="closeButton"
            type="button"
            class="content-action ui-panel"
            @click="close"
          >
            Close
          </button>
        </div>

        <div class="lightbox-stage">
          <button
            v-if="images.length > 1"
            type="button"
            class="content-action ui-panel lightbox-step"
            aria-label="Previous image"
            @click.stop="step(-1)"
          >
            &lt;
          </button>
          <img
            :key="image.src"
            class="lightbox-image"
            :src="image.src"
            :alt="image.alt"
            @click.stop
          />
          <button
            v-if="images.length > 1"
            type="button"
            class="content-action ui-panel lightbox-step"
            aria-label="Next image"
            @click.stop="step(1)"
          >
            &gt;
          </button>
        </div>

        <p
          v-if="image.caption"
          class="content-copy lightbox-caption"
          @click.stop
        >
          {{ image.caption }}
        </p>
      </div>
    </FadeTransition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  color: #fff;
  cursor: zoom-out;
}

.lightbox-bar .content-meta {
  color: inherit;
}

.lightbox-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
}

.lightbox-stage {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 0;
}

.lightbox-step {
  flex: none;
  justify-content: center;
  min-width: 38px;
  padding: 8px;
  font-family: inherit;
  cursor: pointer;
}

.lightbox-image {
  min-width: 0;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 2px solid var(--border-color);
  background: var(--ui-bg);
  cursor: default;
}

.lightbox-caption {
  text-align: center;
  cursor: default;
}
</style>
