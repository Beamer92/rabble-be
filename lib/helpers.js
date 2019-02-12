const redis = require('redis')
const { redisAsPromised } = require("../redis");

const fetchGames = () => {
    return redisAsPromised.get('games')
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

module.exports = {fetchGames, createGame}