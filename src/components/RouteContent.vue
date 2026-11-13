<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { projects } from "../data/projects";
import { portfolioPages } from "../data/portfolioPages";
import SectionPage from "./SectionPage.vue";
import ProjectDetail from "./project/ProjectDetail.vue";

const props = defineProps({
  routeName: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["navigate"]);
const projectIndex = computed(() =>
  projects.findIndex((project) => project.id === props.projectId),
);
const project = computed(() => projects[projectIndex.value] ?? null);
const projectDescription =
  "Selected interactive web, design, and physical technology projects by Bjorn Verbakel.";
</script>

<template>
  <SectionPage
    v-if="routeName === 'about' || routeName === 'contact'"
    :page="portfolioPages[routeName]"
    compact
    @home="emit('navigate', '/')"
  />

  <ProjectDetail
    v-else-if="routeName === 'project' && project"
    :project="project"
    :index="projectIndex"
    @home="emit('navigate', '/')"
    @list="emit('navigate', '/projects/')"
  />

  <main v-else class="route-project-list content-scroll">
    <nav aria-label="Breadcrumb">
      <RouterLink class="content-action ui-panel" to="/">
        Portfolio home
      </RouterLink>
    </nav>
    <header>
      <h1 class="content-title">Projects</h1>
      <p class="content-copy">{{ projectDescription }}</p>
    </header>
    <nav class="route-project-links" aria-label="Projects">
      <RouterLink
        v-for="(item, index) in projects"
        :key="item.id"
        class="route-project-link ui-panel"
        :to="`/projects/${item.id}/`"
      >
        <strong class="content-panel-title">{{ item.title }}</strong>
        <span class="content-copy">{{ item.descriptionShort }}</span>
        <span class="content-meta">{{ item.type }}</span>
      </RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.route-project-list {
  position: absolute;
  inset: 0;
  z-index: 3;
}

.route-project-list > nav:first-child {
  display: flex;
}

.route-project-links {
  display: grid;
  gap: 12px;
}

.route-project-link {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 14px;
  background: var(--ui-bg);
  color: var(--ui-text);
  text-decoration: none;
}

.route-project-link:hover {
  outline: 2px solid var(--border-color);
}
</style>
