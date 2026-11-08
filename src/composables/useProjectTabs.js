import { computed, ref } from "vue";
import { projects } from "../data/projects";
import { tileColor } from "../utils/projectTile";

// Which projects are open as taskbar tabs, and which one is showing
// -1 means the project list is showing
export function useProjectTabs() {
  const openIndexes = ref([]);
  const activeProjectIndex = ref(-1);

  const tabs = computed(() =>
    openIndexes.value.map((index) => ({
      index,
      id: projects[index].id,
      title: projects[index].title,
      color: tileColor(projects[index], index),
    })),
  );

  function openProject(index) {
    if (!openIndexes.value.includes(index)) {
      openIndexes.value.push(index);
    }

    activeProjectIndex.value = index;
  }

  function closeProject(index) {
    openIndexes.value = openIndexes.value.filter((open) => open !== index);

    if (activeProjectIndex.value === index) {
      activeProjectIndex.value = -1;
    }
  }

  function showList() {
    activeProjectIndex.value = -1;
  }

  return { tabs, activeProjectIndex, openProject, closeProject, showList };
}
