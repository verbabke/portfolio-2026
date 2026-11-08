<template>
  <Transition name="fade">
    <slot />
  </Transition>
</template>

<style>
.fade-layer {
  will-change: opacity;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
