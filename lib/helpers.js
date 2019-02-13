const redis = require('redis')
const { redisAsPromised } = require("../redis");

const fetchGames = () => {
    return redisAsPromised.get('games') //this is a single thing with a store of json data
    .then(result => {
      if(!result) {
        return 'No Games'
      } else {
        return JSON.parse(result);
      }
  })
}

const createGame = game => {
    
};

const launchGames = () => {
  return redisAsPromised.set(['games', ""])
  .then(result => {
    return result
  })
  .catch(err => {
    throw err
  })
}

module.exports = {fetchGames, createGame, launchGames}