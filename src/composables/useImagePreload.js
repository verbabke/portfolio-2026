import { onBeforeUnmount, ref } from "vue";

export function useImagePreload() {
  const imagesReady = ref(true);
  const imageProgress = ref(100);
  const hasImagesToPreload = ref(false);
  let preloadTimeout;
  let preloadGeneration = 0;

  function cancelImagePreload() {
    preloadGeneration += 1;
    window.clearTimeout(preloadTimeout);
    imagesReady.value = true;
    imageProgress.value = 100;
    hasImagesToPreload.value = false;
  }

  function preloadImages(imageSources) {
    cancelImagePreload();
    const sources = [...new Set(imageSources.filter(Boolean))];
    if (!sources.length) return;

    const generation = preloadGeneration;
    let completed = 0;
    imagesReady.value = false;
    imageProgress.value = 0;
    hasImagesToPreload.value = true;

    const loads = sources.map(
      (source) =>
        new Promise((resolve) => {
          const image = new Image();
          const finish = () => {
            if (generation === preloadGeneration && !imagesReady.value) {
              completed += 1;
              imageProgress.value = Math.round(
                (completed / sources.length) * 100,
              );
            }
            resolve();
          };
          image.onload = () => {
            if (image.decode) image.decode().then(finish, finish);
            else finish();
          };
          image.onerror = finish;
          image.src = source;
        }),
    );

    preloadTimeout = window.setTimeout(() => {
      if (generation === preloadGeneration) {
        imagesReady.value = true;
        imageProgress.value = 100;
      }
    }, 8000);

    Promise.all(loads).then(() => {
      if (generation !== preloadGeneration) return;
      window.clearTimeout(preloadTimeout);
      imagesReady.value = true;
      imageProgress.value = 100;
    });
  }

  onBeforeUnmount(cancelImagePreload);

  return {
    imagesReady,
    imageProgress,
    hasImagesToPreload,
    preloadImages,
    cancelImagePreload,
  };
}