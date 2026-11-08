<script setup>
import Breadcrumb from "./Breadcrumb.vue";
import ContentText from "./ContentText.vue";

defineProps({
  page: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["home"]);
</script>

<template>
  <article
    class="fade-layer absolute inset-0 z-3 pointer-events-none"
    :aria-label="page.title"
  >
    <Breadcrumb
      v-if="!compact"
      class="absolute z-4 top-(--screen-pad) left-(--screen-pad) pointer-events-auto"
      :trail="['home', page.title]"
      @select="$emit('home')"
    />

    <div
      class="section-page-content content-scroll absolute inset-y-0 right-0 w-[min(66%,800px)]"
      :class="{ 'section-page-compact': compact }"
    >
      <Breadcrumb
        v-if="compact"
        :trail="['home', page.title]"
        @select="$emit('home')"
      />

      <header class="flex! flex-col gap-2.5 text-(--screen-text)">
        <h1 class="content-title">{{ page.title }}</h1>
        <p v-if="page.subtitle" class="content-meta">
          {{ page.subtitle }}
        </p>
      </header>

      <template v-for="(panel, panelIndex) in page.panels" :key="panelIndex">
        <section v-if="panel.paragraphs?.length" class="content-panel ui-panel">
          <template
            v-for="(paragraph, paragraphIndex) in panel.paragraphs"
            :key="paragraphIndex"
          >
            <h2 v-if="paragraph.title" class="content-panel-title">
              {{ paragraph.title }}
            </h2>
            <ContentText :text="paragraph.text" />
          </template>
        </section>
      </template>

      <nav
        v-if="page.links?.length"
        class="content-actions"
        aria-label="Contact links"
      >
        <a
          v-for="link in page.links"
          :key="link.label"
          class="content-action ui-panel"
          :href="link.href"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noreferrer' : undefined"
        >
          {{ link.label }}
          <span class="content-action-icon" aria-hidden="true">↗</span>
        </a>
      </nav>
    </div>
  </article>
</template>

<style scoped>
.section-page-content.section-page-compact {
  width: 100%;
}
</style>
