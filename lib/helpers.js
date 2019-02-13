const redis = require('redis')
const { redisAsPromised } = require("../redis");

const redisFlush = () => {
  return redisAsPromised.flush()
  .then(result => {
    if(!result) {
    console.log('Could not flush redis cache')
    return }
  })
}

const getLobby = () => {
  return redisAsPromised.smembers('lobby')
  .then(result => {
    if(result) return result
    return false
  })
}

const addToLobby = (gameId) => {
  return redisAsPromised.sadd('lobby', `game-${gameId}`)
  .then(result => {
    if(result) return result
    throw 'No Lobby, something went wrong'
  })
};

// const fetchGames = () => {
//     return redisAsPromised.get('games') //this is a single thing with a store of json data
//     .then(result => {
//       if(!result) {
//         return 'No Games'
//       } else {
//         return JSON.parse(result);
//       }
//   })
// }



// const launchGames = () => {
//   return redisAsPromised.set(['games', ""])
//   .then(result => {
//     return result
//   })
//   .catch(err => {
//     throw err
//   })
// }

module.exports = {redisFlush, getLobby, addToLobby} 