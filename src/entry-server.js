import { createSSRApp, h, Suspense } from "vue";
import App from "./App.vue";
import { createServerRouter } from "./router";

export function createServerApp() {
  const app = createSSRApp({
    render: () => h(Suspense, null, { default: () => h(App) }),
  });
  const router = createServerRouter();

  app.use(router);

  return { app, router };
}
