<script setup>
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const segments = computed(() => {
  const result = [];
  const pattern = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)]+)\)/g;
  let cursor = 0;

  for (const match of props.text.matchAll(pattern)) {
    const start = match.index ?? cursor;

    if (start > cursor) {
      result.push({ text: props.text.slice(cursor, start) });
    }

    result.push({ text: match[1], href: match[2] });
    cursor = start + match[0].length;
  }

  if (cursor < props.text.length) {
    result.push({ text: props.text.slice(cursor) });
  }

  return result;
});
</script>

<template>
  <p class="content-copy">
    <template v-for="(segment, index) in segments" :key="index">
      <a
        v-if="segment.href"
        class="content-inline-link"
        :href="segment.href"
        :target="segment.href.startsWith('http') ? '_blank' : undefined"
        :rel="segment.href.startsWith('http') ? 'noreferrer' : undefined"
      >
        {{ segment.text }}
      </a>
      <template v-else>{{ segment.text }}</template>
    </template>
  </p>
</template>
