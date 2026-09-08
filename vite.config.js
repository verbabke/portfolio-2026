import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import templateCompilerOptions from "@tresjs/core/template-compiler-options";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(templateCompilerOptions), tailwindcss()],
});
