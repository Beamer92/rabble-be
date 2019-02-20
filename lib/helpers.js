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
  const gridmap = genMap()
  return redisAsPromised.hmset(gameId, 'map', JSON.stringify(gridmap), 'ulength', '0', 'users', JSON.stringify([]))
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
  return redisAsPromised.hmget(gameId, 'users')
  .then(userList => {
    const uL = JSON.parse(userList)
    const promArr = uL.map(user => {
      return redisAsPromised.del(user)
    })
    return Promise.all(promArr)
  })
  .then(result => {
    console.log('promises ', result)
    return redisAsPromised.del(gameId)
  })
  .catch(err => {
    throw err
  })
}

const addUserToGame = (gameId, username) => {
  return redisAsPromised.hmget(gameId, 'users', 'ulength')
  .then(data => {
    let users = JSON.parse(data[0])
    let length = parseInt(data[1])
    if(length >= 4) throw 'Max Users already in this game'
    if(users.includes(username)) throw 'User already in that game'
    length += 1
    users.push(username)
    return redisAsPromised.hmset(gameId, 'users', JSON.stringify(users), 'ulength', length)
  })
  .then(() => {
    return redisAsPromised.hmset(username, 'position', '[]', 'letters', '[]')
  })
  .catch(err => {
    throw err
  })
}

const removeUserFromGame = (gameId, username) => {
  return redisAsPromised.hmget(gameId, 'users', 'ulength')
  .then(data => {
    let users = JSON.parse(data[0])
    let length = parseInt(data[1])
    if(length <= 0 || !users.includes(username)) throw 'No Users in this game'
    if(length === 1){
      return redisAsPromised.del(gameId)
    }
    else {
      length -= 1
      users.splice(users.indexOf(username), 1)
      return redisAsPromised.hmset(gameId, 'users', JSON.stringify(users), 'ulength', length)
    }
  })
  .then(result => {
    console.log('removed user from game ', result)
    return redisAsPromised.del(username)
  })
  .catch(err => {
    throw err
  })
}

const getUser = (username) => {
  return redisAsPromised.hgetall(username)
  .catch(err => {
    throw err
  })
}

const editUser = (username, letters, position) => {
  return redisAsPromised.hmset(username, 'position', JSON.stringify(position), 'letters', JSON.stringify(letters))
  .catch(err => {
    throw err
  })
}

const genMap = () => {
  const grid = [[],[],[],[],[],[],[],[]]
  return grid.map(row => {
    while(row.length < 8){
      let num = Math.floor(Math.random() * 26) + 65
      row.push(String.fromCharCode(num))
    }
    return row
  })
}

module.exports = {redisFlush, getLobby, addToLobby, createGame, getGame, getGameItem, retireGame, addUserToGame, getUser, removeUserFromGame, editUser} 