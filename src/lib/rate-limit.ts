import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// To bypass errors during local dev if env variables are missing
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? Redis.fromEnv()
  : new Redis({ url: 'https://dummy.upstash.io', token: 'dummy' });

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
});
