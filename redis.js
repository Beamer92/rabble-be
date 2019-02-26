const redis = require('redis')
const {promisify} = require('util')

const client = redis.createClient()

const redisAsPromised = {
  get: promisify(client.get).bind(client), //get an object-like thing by it's key
  set: promisify(client.set).bind(client), //like an object
  del: promisify(client.del).bind(client),
  sadd: promisify(client.sadd).bind(client), //add-to/create a set
  srem: promisify(client.srem).bind(client),
  smembers: promisify(client.smembers).bind(client), //get members of a set
  flush: promisify(client.flushall).bind(client),
  hmset: promisify(client.hmset).bind(client),
  hmget: promisify(client.hmget).bind(client),
  hdel: promisify(client.hdel).bind(client), //removes specified fields from hash stored at key
  hexists: promisify(client.hexists).bind(client),
  hgetall: promisify(client.hgetall).bind(client)
}

module.exports = {redisAsPromised}

// HSET , key=Lobby, gameid, gameid, gameid

// HMSET (Hash Map Set), GameID, 
// map: array
// user1: username
// user2: username
// user3: username
// user4: null

// HMSET username
// position: array
// letters: string