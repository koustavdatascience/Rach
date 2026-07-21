export function createWatchdog(onStall: () => void, stallMs = 3000) {
  let lastTick = performance.now();
  let armed = true;

  function heartbeat() {
    lastTick = performance.now();
  }

  const interval = setInterval(() => {
    if (armed && performance.now() - lastTick > stallMs) {
      armed = false; // fire once per scene load
      onStall();
    }
  }, 500);

  return {
    heartbeat,
    rearm() {
      armed = true;
      lastTick = performance.now();
    },
    stop() {
      clearInterval(interval);
    },
  };
}
