<script setup>
defineProps({
  // { src, alt, caption? }
  images: {
    type: Array,
    required: true,
  },
  columns: {
    type: Number,
    default: 2,
  },
});

defineEmits(["open"]);
</script>

<template>
  <div class="image-gallery" :style="{ '--columns': columns }">
    <figure
      v-for="(image, index) in images"
      :key="image.src"
      class="image-gallery-item"
    >
      <button
        type="button"
        :aria-label="`Enlarge image: ${image.alt}`"
        @click="$emit('open', index)"
      >
        <img :src="image.src" :alt="image.alt" loading="lazy" />
      </button>
      <figcaption v-if="image.caption" class="content-copy">
        {{ image.caption }}
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.image-gallery {
  --gap: 12px;
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      min(
        100%,
        max(
          180px,
          calc((100% - (var(--columns) - 1) * var(--gap)) / var(--columns))
        )
      ),
      1fr
    )
  );
}

.image-gallery-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  margin: 0;
}

.image-gallery-item button {
  display: block;
  padding: 0;
  border: 1px solid var(--border-color);
  background: transparent;
  line-height: 0;
  cursor: zoom-in;
  transition:
    box-shadow 120ms ease,
    transform 120ms ease;
}

.image-gallery-item button:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 var(--border-color);
}

.image-gallery-item button:focus-visible {
  outline: 2px solid var(--screen-text);
  outline-offset: 3px;
}

.image-gallery-item img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
