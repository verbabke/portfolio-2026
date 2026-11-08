<script setup>
defineProps({
  // Page names from the root down
  // Last one is the current page
  trail: {
    type: Array,
    required: true,
  },
});

defineEmits(["select"]);
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
      <button v-else type="button" @click="$emit('select', index)">
        {{ label }}
      </button>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  color: var(--screen-text);
}

.breadcrumb button {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  cursor: pointer;
  outline: none;
}

.breadcrumb button:hover {
  text-decoration: underline;
}

.breadcrumb-current {
  opacity: 0.6;
}
</style>
