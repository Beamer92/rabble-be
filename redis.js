const redis = require('redis')
const {promisify} = require('util')

const client = redis.createClient();

const redisAsPromised = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client)
};

module.exports = {redisAsPromised}