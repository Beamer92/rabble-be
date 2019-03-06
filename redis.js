const redis = require('redis')
const {promisify} = require('util')

const client = redis.createClient(process.env.REDIS_URL || undefined)

const redisAsPromised = {
  del: promisify(client.del).bind(client),
  sadd: promisify(client.sadd).bind(client), //add-to/create a set
  srem: promisify(client.srem).bind(client),
  smembers: promisify(client.smembers).bind(client), //get members of a set
  flush: promisify(client.flushall).bind(client),
  hmset: promisify(client.hmset).bind(client),
  hmget: promisify(client.hmget).bind(client),
  hgetall: promisify(client.hgetall).bind(client)
}

module.exports = {redisAsPromised}
