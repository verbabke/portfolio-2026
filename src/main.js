import { createSSRApp, h, Suspense } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPortfolioRouter } from "./router";
import { createWebHistory } from "vue-router";

const app = createSSRApp({
  render: () => h(Suspense, null, { default: () => h(App) }),
});
const router = createPortfolioRouter(
  createWebHistory(import.meta.env.BASE_URL),
);

app.use(router);
await router.isReady();
app.mount("#app");
