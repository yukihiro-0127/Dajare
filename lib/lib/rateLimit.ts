type RateRecord = {
  count: number;
  resetAt: number;
};

const limiterStore = new Map<string, RateRecord>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = limiterStore.get(key);
  if (!record || record.resetAt < now) {
    limiterStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  limiterStore.set(key, record);
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}
