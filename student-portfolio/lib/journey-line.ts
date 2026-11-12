export type RoutePoint = { x: number; y: number };

export function createRoutePath(points: RoutePoint[]): string {
  if (!points.length) return "";
  let route = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index++) {
    const from = points[index - 1];
    const to = points[index];
    const middle = (from.y + to.y) / 2;
    route += ` C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}`;
  }
  return route;
}

/** Locate the light on the actual curve, rather than approximating arc length by height. */
export function getLineFrame(cursor: number, length: number, pointAtLength: (distance: number) => RoutePoint) {
  const start = pointAtLength(0);
  if (length <= 0) return { x: start.x, y: start.y, progress: 0 };
  const end = pointAtLength(length);
  const direction = end.y >= start.y ? 1 : -1;
  if ((cursor - start.y) * direction <= 0) return { x: start.x, y: start.y, progress: 0 };
  if ((cursor - end.y) * direction >= 0) return { x: end.x, y: end.y, progress: 1 };
  let low = 0;
  let high = length;
  for (let iteration = 0; iteration < 18; iteration++) {
    const middle = (low + high) / 2;
    if ((pointAtLength(middle).y - cursor) * direction < 0) low = middle;
    else high = middle;
  }
  const distance = (low + high) / 2;
  const point = pointAtLength(distance);
  return { x: point.x, y: point.y, progress: distance / length };
}
