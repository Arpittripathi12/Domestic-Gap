const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,   // e.g. redis cloud
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD, // if any
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  }
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error", err);
});

module.exports = redis;