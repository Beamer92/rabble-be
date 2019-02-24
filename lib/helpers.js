const redis = require('redis')
const { redisAsPromised } = require("../redis");
const wordscore = require('scrabble-score')
const checkWord = require('check-word')
const ENword = checkWord('en')


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
  return redisAsPromised.hmset(gameId, 'map', JSON.stringify(gridmap), 'ulength', '0', 'users', JSON.stringify([]), 'turn', '')
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

const getUser = (username) => {
  return redisAsPromised.hgetall(username)
  .catch(err => {
    throw err
  })
}

const editUser = (username, rover, letters) => {
  return redisAsPromised.hmset(username, 'position', JSON.stringify(rover.position), 'face', rover.face, 'letters', JSON.stringify(letters))
  .catch(err => {
    throw err
  })
}

const editGame = (gameId, mapgrid) => {
  return redisAsPromised.hmset(gameId, 'map', JSON.stringify(mapgrid))
  .catch(err => {
    throw err
  })
}

const nextTurn = (gameId) => {
  return redisAsPromised.hgetall(gameId)
  .then(game=>{
    //get all users with scores already
    //if scores.length === game.ulength, end the game and emit the winner, then start a new game
    //else, cycle through until you get to a user's turn
   
    let users = JSON.parse(game.users)

    let curTurn = users.indexOf(game.turn)
    if(curTurn === users.length -1) {
      curTurn = 0
    }
    else {
      curTurn = curTurn + 1
    }

    //check user for score, if score then go again

    return redisAsPromised.hmset(gameId, 'turn', users[curTurn])
  })
  .then(() => {
    return redisAsPromised.hgetall(gameId)
  })
  .then(result => {
    return result
  })
  .catch(err => {
    throw err
  })
}

const getData = (Id, key) => {
  return redisAsPromised.hmget(Id, key)
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
  return redisAsPromised.hmget(gameId, 'users', 'ulength', 'turn')
  .then(data => {
    let users = JSON.parse(data[0])
    let length = parseInt(data[1])
    if(length >= 4) throw 'Max Users already in this game'
    if(users.includes(username)) throw 'User already in that game'
    length += 1
    users.push(username)
    let turn = (data.turn === undefined && length > 1) ? users[0] : ''
    return redisAsPromised.hmset(gameId, 'users', JSON.stringify(users), 'ulength', length, 'turn', turn)
  })
  .then(() => {
    return redisAsPromised.hmset(username, 'position', '[]', 'face', 'N', 'letters', '[]', 'gameId', gameId, 'score', '-1')
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


const genMap = () => {
  const grid = [[],[],[],[],[],[],[],[], []]
  return grid.map(row => {
    while(row.length < 9){
      let num = Math.floor(Math.random() * 26) + 65
      row.push(String.fromCharCode(num))
    }
    return row
  })
}

const scoreWord = (gameId, username, letters) => {
  return redisAsPromised.hgetall(username)
  .then(result => {
    console.log(result, ' and ', letters)
    let score = parseInt(result.score)
    // let score = -2
    if(score < 0){
      let word = letters.join('').toLowerCase()
      console.log('joined word ',word)
      if(ENword.check(word)){
        score = wordscore(word)
      }
      else{
        score = 0
      } 

      console.log('and the score ', score)
      redisAsPromised.hmset(username, 'score', score.toString())
      .catch(err => {
        console.log(err)
      })
    }
    updateBestScore(username, score)
    return score
  })
  .catch(err => {
    console.log(err)
  })
}

const updateBestScore = (username, score) => {
  //mongoDB call to update user's best score if appropriate
}

module.exports = {redisFlush, getLobby, addToLobby, createGame, getGame, getData, retireGame, addUserToGame, getUser, removeUserFromGame, editUser, editGame, nextTurn, scoreWord} 