export type StepPoint = { x: number; y: number };
export type WalkFrame = { landed: number; movingIndex: number; progress: number; x: number; y: number; lift: number };

/** Each milestone is one landing; only the next foot can move. */
export function getWalkFrame(cursor: number, targets: StepPoint[]): WalkFrame {
  const landed = targets.filter(point => cursor >= point.y).length;
  if (!targets.length || landed === targets.length) {
    return { landed, movingIndex: -1, progress: 1, x: 0, y: 0, lift: 0 };
  }
  const target = targets[landed];
  const entrance = Math.max(0, targets[0].y - 150);
  const start = landed ? targets[landed - 1].y : entrance;
  const progress = Math.max(0, Math.min(1, (cursor - start) / Math.max(1, target.y - start)));
  const origin = landed >= 2 ? targets[landed - 2] : { x: target.x, y: entrance };
  const eased = progress * progress * (3 - 2 * progress);
  return {
    landed,
    movingIndex: progress > 0 ? landed : -1,
    progress,
    x: origin.x + (target.x - origin.x) * eased,
    y: origin.y + (target.y - origin.y) * eased,
    lift: Math.sin(Math.PI * progress),
  };
}
