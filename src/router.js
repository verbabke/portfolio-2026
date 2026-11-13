import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import { projects } from "./data/projects";
import { portfolioPages } from "./data/portfolioPages";

const routeStateComponent = { render: () => null };

export const portfolioRoutes = [
  { path: "/", name: "home", component: routeStateComponent },
  { path: "/about/", name: "about", component: routeStateComponent },
  { path: "/contact/", name: "contact", component: routeStateComponent },
  { path: "/projects/", name: "projects", component: routeStateComponent },
  {
    path: "/projects/:projectId/",
    name: "project",
    component: routeStateComponent,
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export function createPortfolioRouter(history = createWebHistory()) {
  return createRouter({
    history,
    routes: portfolioRoutes,
    scrollBehavior: () => ({ top: 0 }),
  });
}

export function createServerRouter() {
  return createPortfolioRouter(createMemoryHistory());
}

export function getRouteState(route) {
  if (route.name === "about" || route.name === "contact") {
    return { iconId: String(route.name), projectId: null };
  }

  if (route.name === "projects") {
    return { iconId: "projects", projectId: null };
  }

  if (route.name === "project") {
    const projectId = String(route.params.projectId);
    const projectExists = projects.some((project) => project.id === projectId);

    return projectExists
      ? { iconId: "projects", projectId }
      : { iconId: "projects", projectId: null };
  }

  return { iconId: null, projectId: null };
}

export function getPortfolioPath(iconId, projectId = null) {
  if (iconId === "projects") {
    return projectId
      ? `/projects/${encodeURIComponent(projectId)}/`
      : "/projects/";
  }

  return iconId ? `/${encodeURIComponent(iconId)}/` : "/";
}

export function getRouteMetadata(route) {
  const state = getRouteState(route);

  if (state.projectId) {
    const index = projects.findIndex(
      (project) => project.id === state.projectId,
    );
    const project = projects[index];
    const firstImage = project.content?.flatMap(
      (panel) => panel.images ?? [],
    )[0]?.src;

    return {
      title: `${project.title} | Bjorn Verbakel`,
      description: project.descriptionShort,
      image: firstImage ?? "/img/logo/verbabke-logo-horizontal.png",
      type: "CreativeWork",
      project,
      index,
    };
  }

  if (route.name === "projects") {
    return {
      title: "Projects | Bjorn Verbakel",
      description:
        "Selected interactive web, design, and physical technology projects by Bjorn Verbakel.",
      image: "/img/logo/verbabke-logo-horizontal.png",
      type: "CollectionPage",
    };
  }

  if (route.name === "about" || route.name === "contact") {
    const page = portfolioPages[route.name];
    const firstParagraph = page.panels
      .flatMap((panel) => panel.paragraphs ?? [])
      .map((paragraph) => paragraph.text)
      .find(Boolean);

    return {
      title: `${page.title} | Bjorn Verbakel`,
      description: firstParagraph ?? "Portfolio of Bjorn Verbakel.",
      image: "/img/logo/verbabke-logo-horizontal.png",
      type: "WebPage",
      page,
    };
  }

  return {
    title: "Bjorn Verbakel | Portfolio",
    description:
      "Portfolio of Bjorn Verbakel, an ICT student and designer building interactive 3D web experiences and physical technology projects.",
    image: "/img/logo/verbabke-logo-horizontal.png",
    type: "WebSite",
  };
}
