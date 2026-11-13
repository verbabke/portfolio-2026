<script setup>
defineProps({
  // Page names from the root down
  // Last one is the current page
  trail: {
    type: Array,
    required: true,
  },
  paths: {
    type: Array,
    default: () => ["/"],
  },
});

const emit = defineEmits(["select"]);

function selectCrumb(event, index) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  emit("select", index);
}
</script>

<template>
  <nav
    class="breadcrumb text-[9px] leading-none uppercase select-none"
    aria-label="Breadcrumb"
  >
    <template v-for="(label, index) in trail" :key="index">
      <span v-if="index > 0" aria-hidden="true" class="px-2">/</span>
      <span
        v-if="index === trail.length - 1"
        class="breadcrumb-current"
        aria-current="page"
        >{{ label }}</span
      >
      <a v-else :href="paths[index]" @click="selectCrumb($event, index)">
        {{ label }}
      </a>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  color: var(--screen-text);
  overflow: hidden;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ::-webkit-scrollbar {
    display: none;
  }
}

.breadcrumb a {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  cursor: pointer;
  outline: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-current {
  opacity: 0.6;
}
</style>
