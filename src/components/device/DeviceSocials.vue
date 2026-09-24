<script setup>
const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/verbabke",
    brand: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bjorn-verbakel",
    brand: "linkedin",
  },
  { label: "Mail", href: "mailto:contact@bjornverbakel.com", brand: "mail" },
];
</script>

<template>
  <section class="social-panel" aria-label="Social links">
    <nav class="social-links" aria-label="Social media">
      <p class="emboss-txt select-none">LINK</p>
      <a
        v-for="socialLink in socialLinks"
        :key="socialLink.label"
        class="device-button social-button"
        :class="`social-button-${socialLink.brand}`"
        :href="socialLink.href"
        :aria-label="socialLink.label"
        :target="socialLink.brand !== 'mail' ? '_blank' : undefined"
        :rel="socialLink.brand !== 'mail' ? 'noreferrer' : undefined"
      >
        <svg
          v-if="socialLink.brand === 'github'"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.9.68 1.8v2.67c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
          />
        </svg>
        <svg
          v-else-if="socialLink.brand === 'linkedin'"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M5.37 3.1a2.14 2.14 0 1 1 0 4.28 2.14 2.14 0 0 1 0-4.28ZM3.5 8.98h3.74V20.5H3.5V8.98Zm6.08 0h3.59v1.57h.05c.5-.95 1.72-1.95 3.54-1.95 3.78 0 4.48 2.49 4.48 5.73v6.17H17.5v-5.47c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.89v5.56H9.58V8.98Z"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.2.2 6.8 5.1 6.8-5.1H5.2Zm13.6 2.75-6.2 4.65a1 1 0 0 1-1.2 0L5.2 8.45V18.5c0 .17.13.3.3.3h13a.3.3 0 0 0 .3-.3V8.45Z"
          />
        </svg>
      </a>
    </nav>
  </section>
</template>

<style scoped>
.social-panel {
  display: flex;
  min-width: 0;
  justify-content: flex-end;
}

.social-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.social-links .emboss-txt {
  margin: 0;
}

.top-social-panel {
  display: none;
}

.lower-social-panel {
  order: 3;
}

.social-button {
  cursor:
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: var(--round-control-size);
  aspect-ratio: 1;
  border: 1px solid #161817;
  border-radius: 50%;
  box-shadow:
    inset 1px 1px #ffffff42,
    inset -2px -2px #2b2c2c,
    1px 2px 3px #00000080;
  color: #f5f4ed;
}

.social-button svg {
  width: 52%;
  height: 52%;
  fill: currentColor;
}

.social-button-github {
  background: linear-gradient(145deg, #62666a, #17191b);
}

.social-button-linkedin {
  background: linear-gradient(145deg, #2f89bb, #075378);
}

.social-button-mail {
  background: linear-gradient(145deg, #d56c4d, #863422);
}

@media (max-width: 1000px) {
  .lower-social-panel {
    display: none;
  }

  .top-social-panel {
    order: initial;
    display: flex;
    flex: 0 0 auto;
    width: auto;
    gap: 6px;
  }

  .top-social-panel .social-links {
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }
}

@media (max-width: 640px) {
  .top-social-panel {
    display: none;
  }

  .lower-social-panel {
    display: flex;
    flex: 1 0 100%;
    order: 2;
  }

  .lower-social-panel .social-links {
    flex-direction: row;
    align-items: center;
  }

  .top-social-panel .emboss-txt {
    display: none;
  }
}
</style>
