import { createApp, h, Suspense } from "vue";
import "./style.css";
import App from "./App.vue";

createApp({
  render: () => h(Suspense, null, { default: () => h(App) }),
}).mount("#app");
