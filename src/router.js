import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import { projects } from "./data/projects";
import { portfolioPages } from "./data/portfolioPages";
import { seo } from "./data/seo";

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
  const defaults = {
    image: seo.defaultImage,
    ogType: "website",
    twitterCard: seo.twitterCard,
    canonical: new URL(
      getPortfolioPath(state.iconId, state.projectId),
      seo.siteUrl,
    ).href,
  };

  if (state.projectId) {
    const index = projects.findIndex(
      (project) => project.id === state.projectId,
    );
    const project = projects[index];
    const firstImage = project.content?.flatMap(
      (panel) => panel.images ?? [],
    )[0]?.src;

    return {
      ...defaults,
      title: `${project.title} | ${seo.siteName}`,
      description: project.descriptionShort,
      image: firstImage ?? seo.defaultImage,
      ogType: "article",
      type: "CreativeWork",
      ...seo.projectOverrides[project.id],
      project,
      index,
    };
  }

  if (route.name === "projects") {
    return {
      ...defaults,
      ...seo.pages.projects,
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
      ...defaults,
      title: `${page.title} | ${seo.siteName}`,
      description: firstParagraph ?? seo.pages.home.description,
      type: "WebPage",
      ...seo.pages[route.name],
      page,
    };
  }

  return {
    ...defaults,
    ...seo.pages.home,
    type: "WebSite",
  };
}
