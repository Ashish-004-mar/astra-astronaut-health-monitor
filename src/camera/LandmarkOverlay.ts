import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
export function smooth(
  points: NormalizedLandmark[],
  previous: NormalizedLandmark[],
) {
  return points.map((p, i) => ({
    ...p,
    x: previous[i] ? previous[i].x * 0.35 + p.x * 0.65 : p.x,
    y: previous[i] ? previous[i].y * 0.35 + p.y * 0.65 : p.y,
  }));
}
export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  points: NormalizedLandmark[],
  connections: { start: number; end: number }[],
  reveal: number,
  pose = false,
) {
  const valid = (p: NormalizedLandmark | undefined) =>
    p && (!pose || (p.visibility ?? 0) > 0.6);
  const w = ctx.canvas.width,
    h = ctx.canvas.height;
  ctx.strokeStyle = pose ? "#72f5d6" : "#67cdd5";
  ctx.fillStyle = "#a2fff0";
  ctx.lineWidth = pose ? 2 : 0.65;
  ctx.globalAlpha = pose ? 0.85 : 0.4;
  connections
    .slice(0, Math.floor(connections.length * reveal))
    .forEach(({ start, end }) => {
      const a = points[start],
        b = points[end];
      if (valid(a) && valid(b)) {
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      }
    });
  ctx.globalAlpha = 0.9;
  points.forEach((p) => {
    if (valid(p)) {
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, pose ? 2.8 : 1.05, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
}
