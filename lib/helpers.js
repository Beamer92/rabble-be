const redis = require('redis')
const { redisAsPromised } = require("../redis");

const redisFlush = () => {
  return redisAsPromised.flush()
  .then(result => {
    if(!result) {
    console.log('Could not flush redis cache')
    return }
  })
  .catch(err => {
    throw err
  })
}

const getLobby = () => {
  return redisAsPromised.smembers('lobby')
  .then(result => {
    if(result) return result
    return false
  })
  .catch(err => {
    throw err
  })
}

const addToLobby = (gameId) => {
  return redisAsPromised.sadd('lobby', gameId)
  .then(result => {
    if(result) return result
    throw 'No Lobby, something went wrong'
  })
  .catch(err => {
    throw err
  })
};

const createGame = (gameId) => {
  const gridmap = [['A', 'B', 'T'], ['E', 'L', 'F'], ['R','D','O']]
  return redisAsPromised.hmset(gameId, 'map', JSON.stringify(gridmap), 'user1', 'null', 'user2', 'null', 'user3', 'null', 'user4', 'null')
  .then(result => {
    return result
  })
  .catch(err => {
    throw err
  })
}

const getGame = (gameId) => {
  return redisAsPromised.hgetall(gameId)
  .then(result => {
    return result
  })
  .catch(err => {
    throw err
  })
}

const getGameItem = (gameId, key) => {
  return redisAsPromised.hmget(gameId, key)
  .then(result => {
    return JSON.parse(result)
  })
  .catch(err => {
    throw err
  })
}

const retireGame = (gameId) => {
  return redisAsPromised.del(gameId)
  .then(result => {
    return result
  })
  .catch(err => {
    throw err
  })
}

const addUserToGame = (gameId, username) => {

}

const removeUserFromGame = (gameId, username) => {
  
}

// HMSET (Hash Map Set), GameID, 
// map: array
// user1: username
// user2: username
// user3: username
// user4: null

// HMSET username
// position: array
// letters: string




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

module.exports = {redisFlush, getLobby, addToLobby, createGame, getGame, getGameItem, retireGame} 