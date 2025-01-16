import Redis from "ioredis";

const redis = new Redis({
  port: 6379,
  host: "localhost",
  db: 0,
});

// Set maxmemory and maxmemory-policy dynamically
(async () => {
  // Set the maximum memory limit Redis can use (e.g., 256 MB)
  // Once this limit is reached, the eviction policy will determine how keys are removed.
  await redis.config("SET", "maxmemory", "256mb");

  // Set the eviction policy to "volatile-ttl"
  // This policy evicts keys with the shortest remaining time-to-live (TTL) first.
  await redis.config("SET", "maxmemory-policy", "volatile-ttl");
})();

export default redis;
