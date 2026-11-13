import { onBeforeUnmount } from "vue";

export function useHoldScroll(getScrollElement) {
  const scrollSpeed = 300;
  let frame = 0;
  let activeDirection = null;
  let lastTime = 0;

  function stopScrolling(direction = activeDirection) {
    if (direction !== activeDirection) return;
    cancelAnimationFrame(frame);
    frame = 0;
    activeDirection = null;
    lastTime = 0;
  }

  function startScrolling(direction) {
    if (direction !== "top" && direction !== "bottom") return;

    const element = getScrollElement();
    if (!element) return;

    stopScrolling();
    activeDirection = direction;
    const sign = direction === "top" ? -1 : 1;
    element.scrollTop += sign * 8;
    lastTime = performance.now();

    function scroll(time) {
      if (getScrollElement() !== element) {
        stopScrolling();
        return;
      }

      const elapsed = Math.min(time - lastTime, 50);
      element.scrollTop += (sign * scrollSpeed * elapsed) / 1000;
      lastTime = time;
      frame = requestAnimationFrame(scroll);
    }

    frame = requestAnimationFrame(scroll);
  }

  onBeforeUnmount(() => stopScrolling());

  return { startScrolling, stopScrolling };
}
