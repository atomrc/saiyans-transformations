export function raf(type, data) {
  let stop = false;
  if (type === 0) {
    const sink = data;
    const frame = () => {
      if (stop) { return; }
      sink(1, null);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame)
    sink(0, (t, d) => {
      if (t === 2) { stop = true; }
    });
  }
}
