const redis = require('redis')
const {promisify} = require('util')

const client = redis.createClient();

const redisAsPromised = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client), 
  sadd: promisify(client.sadd).bind(client), 
  smembers: promisify(client.smembers).bind(client), 
  flush: promisify(client.flushall).bind(client),
  hmset: promisify(client.hmset).bind(client)

};

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