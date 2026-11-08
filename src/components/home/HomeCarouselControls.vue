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
    class="absolute inset-x-0 bottom-[clamp(10px,4vw,20px)] z-1 flex items-center justify-center gap-3 pointer-events-none *:pointer-events-auto"
    @pointerdown.stop
    @pointermove.stop
    @pointerup.stop
  >
    <button
      type="button"
      class="carousel-key content-action ui-panel"
      aria-label="Previous"
      @click="$emit('previous')"
    >
      &lt;
    </button>

    <div
      class="flex items-center gap-2"
      role="group"
      aria-label="Carousel items"
    >
      <button
        v-for="(icon, index) in icons"
        :key="icon.id"
        type="button"
        class="carousel-key content-action ui-panel"
        :class="{ 'carousel-key-active': index === activeIndex }"
        :aria-label="`Show ${icon.id}`"
        :aria-pressed="index === activeIndex"
        @click="$emit('select', index)"
      >
        {{ index + 1 }}
      </button>
    </div>

    <button
      type="button"
      class="carousel-key content-action ui-panel"
      aria-label="Next"
      @click="$emit('next')"
    >
      &gt;
    </button>
  </div>
</template>

<style scoped>
.carousel-key {
  min-width: 38px;
  justify-content: center;
  padding: 8px;
  font-family: inherit;
  cursor: pointer;
}

.carousel-key-active {
  background: var(--border-color);
  color: var(--ui-bg);
}
</style>
