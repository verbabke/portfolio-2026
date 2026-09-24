<script setup>
defineProps({
  icons: {
    type: Array,
    required: true,
  },
  activeIndex: {
    type: Number,
    required: true,
  },
});

defineEmits(["select", "previous", "next"]);
</script>

<template>
  <div
    class="carousel-controls"
    @pointerdown.stop
    @pointermove.stop
    @pointerup.stop
  >
    <button
      type="button"
      class="nes-btn is-success"
      aria-label="Previous"
      @click="$emit('previous')"
    >
      Prev
    </button>

    <div class="carousel-indicator" role="group" aria-label="Carousel items">
      <button
        v-for="(icon, index) in icons"
        :key="icon.id"
        type="button"
        class="nes-btn"
        :class="index === activeIndex ? 'is-primary' : ''"
        :aria-label="`Show ${icon.id}`"
        :aria-pressed="index === activeIndex"
        @click="$emit('select', index)"
      >
        {{ index + 1 }}
      </button>
    </div>

    <button
      type="button"
      class="nes-btn is-success"
      aria-label="Next"
      @click="$emit('next')"
    >
      Next
    </button>
  </div>
</template>

<style scoped>
.carousel-controls {
  position: absolute;
  inset-inline: 0;
  bottom: clamp(10px, 4vw, 20px);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 3vw, 18px);
  pointer-events: none;
}

.carousel-controls > * {
  pointer-events: auto;
}

.carousel-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}
</style>
