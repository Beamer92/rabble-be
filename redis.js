"use strict";
import redis from "redis";

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export let client = () => {
    return new Promise((resolve, reject) => {
        let connector = redis.createClient(process.env.REDIS_URL);

        connector.on("error", () => {
            reject("Redis Connection failed");
        });

        connector.on("connect", () => {
            resolve(connector);
        });
    });
};