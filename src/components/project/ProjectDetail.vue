<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { projectMark, tileColor, tileTextColor } from "../../utils/projectTile";
import ProjectDetailIcon from "./ProjectDetailIcon.vue";
import Breadcrumb from "../Breadcrumb.vue";
import FadeTransition from "../FadeTransition.vue";
import ImageGallery from "../ImageGallery.vue";
import ImageLightbox from "../ImageLightbox.vue";
import ContentText from "../ContentText.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  // Position in the project list, picks the tile color.
  index: {
    type: Number,
    default: 0,
  },
  preloadImages: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["home", "list"]);

const contentRef = ref(null);
const color = computed(() => tileColor(props.project, props.index));
const textColor = computed(() => tileTextColor(color.value));
const mark = computed(() => projectMark(props.project));
const actionLinks = computed(() => [
  ...(props.project.liveUrl
    ? [{ label: "Visit project", href: props.project.liveUrl, external: true }]
    : []),
  ...(props.project.repoUrl
    ? [{ label: "View source", href: props.project.repoUrl, external: true }]
    : []),
  ...(props.project.links ?? []),
]);

// Boxes in the order they show
const panels = computed(
  () =>
    props.project.content ?? [
      { text: props.project.descriptionLong },
      ...(props.project.img?.length ? [{ images: props.project.img }] : []),
    ],
);

// Every image in the project
const allImages = computed(() => panels.value.flatMap((p) => p.images ?? []));
const panelOffsets = computed(() => {
  let total = 0;
  return panels.value.map((p) => {
    const offset = total;
    total += p.images?.length ?? 0;
    return offset;
  });
});
const openImage = ref(-1);

const iconReady = ref(false);
const showDetailIcon = ref(false);
let iconViewport;
const updateIconViewport = (event) => {
  showDetailIcon.value = event.matches;
};
const iconDelayMs = 260;
let iconTimer = 0;

onMounted(() => {
  iconViewport = window.matchMedia("(min-width: 500px)");
  showDetailIcon.value = iconViewport.matches;
  iconViewport.addEventListener("change", updateIconViewport);
  iconTimer = setTimeout(() => {
    iconReady.value = true;
  }, iconDelayMs);
});

onBeforeUnmount(() => {
  clearTimeout(iconTimer);
  iconViewport?.removeEventListener("change", updateIconViewport);
});

defineExpose({ getScrollElement: () => contentRef.value });
</script>

<template>
  <article
    ref="contentRef"
    class="project-detail content-scroll fade-layer"
    aria-label="Project details"
  >
    <Breadcrumb
      :trail="['home', 'projects', project.title]"
      :paths="['/', '/projects/']"
      @select="$emit($event === 0 ? 'home' : 'list')"
    />

    <header class="project-detail-head">
      <div v-if="showDetailIcon" class="project-detail-icon">
        <FadeTransition>
          <ProjectDetailIcon
            v-if="iconReady"
            :color="color"
            :mark="mark"
            :text-color="textColor"
          />
        </FadeTransition>
      </div>
      <div class="flex flex-col gap-3">
        <h1 class="content-title">{{ project.title }}</h1>
        <p class="content-meta">{{ project.type }}</p>
        <ul v-if="project.skills?.length" class="project-detail-skills">
          <li v-for="skill in project.skills" :key="skill.alt">
            <img :src="skill.icon" alt="" class="filter-screen-text" />
            <span>{{ skill.alt }}</span>
          </li>
        </ul>
      </div>
    </header>

    <section
      v-for="(panel, panelIndex) in panels"
      :key="panelIndex"
      class="content-panel ui-panel"
      :class="
        panel.side &&
        panel.text &&
        panel.images?.length &&
        `panel-side-${panel.side}`
      "
    >
      <h2 v-if="panel.title" class="content-panel-title">{{ panel.title }}</h2>
      <ContentText v-if="panel.text" :text="panel.text" />
      <div
        v-if="panel.images?.length || panel.videos?.length"
        class="project-media"
      >
        <ImageGallery
          v-if="panel.images?.length"
          :images="panel.images"
          :columns="panel.columns"
          :loading="preloadImages ? 'eager' : 'lazy'"
          @open="openImage = panelOffsets[panelIndex] + $event"
        />
        <div v-if="panel.videos?.length" class="project-video-grid">
          <figure v-for="(video, videoIndex) in panel.videos" :key="video.src">
            <video
              :src="video.src"
              :poster="video.poster"
              :aria-label="
                video.title ||
                video.caption ||
                `Project video ${videoIndex + 1}`
              "
              controls
              playsinline
              preload="metadata"
            ></video>
            <figcaption v-if="video.caption" class="content-copy">
              {{ video.caption }}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <nav
      v-if="actionLinks.length"
      class="content-actions"
      aria-label="Project links"
    >
      <a
        v-for="link in actionLinks"
        :key="link.href"
        class="content-action ui-panel"
        :href="link.href"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noreferrer' : undefined"
      >
        {{ link.label }}
        <span class="content-action-icon" aria-hidden="true">↗</span>
      </a>
    </nav>
    <ImageLightbox v-model:index="openImage" :images="allImages" />
  </article>
</template>

<style scoped>
.project-detail {
  position: absolute;
  inset: 0;
}

.project-detail-head {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 24px;
  color: var(--screen-text);
}

@media (width < 500px) {
  .project-detail-head {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Text and images next to each other; stacked on narrow screens. */
@media (min-width: 641px) {
  .panel-side-left,
  .panel-side-right {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    column-gap: 16px;
  }

  .panel-side-left > :deep(.image-gallery) {
    order: -1;
  }

  .panel-side-left > .project-media {
    order: -1;
  }

  .panel-side-left > .content-panel-title,
  .panel-side-right > .content-panel-title {
    grid-column: 1 / -1;
  }
}

.project-detail-icon {
  width: 120px;
  height: 120px;
}

.project-media {
  display: grid;
  gap: 12px;
}

.project-video-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}

.project-video-grid figure {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  margin: 0;
}

.project-video-grid video {
  display: block;
  width: 100%;
  max-height: 420px;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--border-color);
  background: #101312;
  object-fit: contain;
}

.project-detail-skills img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.project-detail-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11px;
  text-transform: uppercase;
}

.project-detail-skills li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
