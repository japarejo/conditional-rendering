require("dotenv").config();
import { createClient } from "redis";

(async () => {
  console.log("starting migration");
  const FEATURE_MAP = {
    "pet-list": true,
    "pet-read": true,
    "pet-edit": true,
    "pet-add": true,
    "pet-delete": true,
    "pet-requests-remaining": 5,
    "pet-allowed-types": "dog cat bird snake",
  };

  const client = createClient({
    url: process.env.REDIS_URL,
  });
  client.on("error", (err) => console.error("Redis Client Error", err));

  await client.connect();

  for (const [key, value] of Object.entries(FEATURE_MAP)) {
    await client.set(key, `${typeof value}__${value}`);
  }
  console.log("migration finished");
  await client.disconnect();
})();
