export type Point = { x: number; y: number };

export function calculateCircleScore(points: Point[]): number {
  if (points.length < 10) return 0; // Too few points

  // 1. Calculate Centroid
  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const centerX = sumX / points.length;
  const centerY = sumY / points.length;

  // 2. Calculate Mean Radius
  let sumRadius = 0;
  const radii: number[] = [];
  for (const p of points) {
    const r = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
    radii.push(r);
    sumRadius += r;
  }
  const meanRadius = sumRadius / points.length;

  if (meanRadius === 0) return 0;

  // 3. Calculate Standard Deviation of Radius
  let sumSqDiff = 0;
  for (const r of radii) {
    sumSqDiff += Math.pow(r - meanRadius, 2);
  }
  const stdDev = Math.sqrt(sumSqDiff / points.length);

  // 4. Calculate Circularity Score (based on deviation)
  // Lower deviation is better.
  // A simple heuristic: 100 * (1 - (stdDev / meanRadius))
  // But we want to be lenient.
  
  const circularity = 100 * (1 - (stdDev / meanRadius));
  
  // 5. Closure Check
  const start = points[0];
  const end = points[points.length - 1];
  const distanceStartEnd = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
  
  // Penalize if the gap is large relative to the radius.
  // Gap tolerance: 15% of radius.
  const gapPenalty = Math.max(0, (distanceStartEnd / meanRadius) * 20); // Heuristic penalty
  
  let finalScore = circularity - gapPenalty;
  
  // 6. Clamp score
  return Math.max(0, Math.min(100, finalScore));
}
