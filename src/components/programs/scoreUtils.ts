// Deterministic score generator so schedule table and matrix show the same scores
export function getDeterministicScore(seed: string): { score1: number; score2: number } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const score1 = Math.abs(hash) % 8;
  const score2 = Math.abs((hash >> 4) + 17) % 8;
  return { score1, score2 };
}
