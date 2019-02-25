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

const rotateTurn = (usersObj, turnInd) => {
  let newInd
  if(turnInd === usersObj.length -1) {
    newInd = 0
  }
  else {
    newInd = turnInd + 1
  }
  console.log('That score is here: ', usersObj[newInd].score)
  if(usersObj[newInd].score >= 0){
    return rotateTurn(usersObj, newInd)
  }
  return usersObj[newInd].name
}

const nextTurn = (gameId) => {
  return redisAsPromised.hgetall(gameId)
  .then(game=>{
    let users = JSON.parse(game.users)
    console.log('next turn users ', users)
    if(users.every(u => u.score >= 0)) {
      let winners = []
      for(let u = 0; u< users.length; u++){
        if(winners.length === 0){
          winners.push(users[u])
        }
        else if(users[u].score > winners[0].score){
          winners = []
          winners.push(users[u])
        }
        else if(users[u].score === winners[0].score){
          winners.push(users[u])
        }
      }
      console.log('winners include ', winners)
      return redisAsPromised.hmset(gameId, 'turn', '', 'winners', JSON.stringify(winners))
    }

    let curTurn = users.findIndex( u => u.name === game.turn)
    console.log('current turn ',users[curTurn].name)
    let nextUser = rotateTurn(users, curTurn)
   
    console.log('current turn ', nextUser)
    return redisAsPromised.hmset(gameId, 'turn', nextUser)
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

const addUserToGame = (gameId, username) => {
  return redisAsPromised.hgetall(gameId)
  .then(data => {
    let users = JSON.parse(data.users)
    let length = parseInt(data.ulength)
    if(length >= 4) throw 'Max Users already in this game'
    if(users.some(userObj => userObj.name === username)) throw 'User already in that game'
    length += 1
    users.push({name: username, score: -1})
    let turn = (data.turn === '' && length > 1) ? users[0].name : ''
    return redisAsPromised.hmset(gameId, 'users', JSON.stringify(users), 'ulength', length, 'turn', turn)
  })
  .then(() => {
    return redisAsPromised.hmset(username, 'position', '[]', 'face', 'N', 'letters', '[]', 'gameId', gameId)
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
  return redisAsPromised.hgetall(gameId)
  .then(result => {
    let users = JSON.parse(result.users)
    let curUser = users.find(user => user.name === username)
    if(curUser.score < 0){
      let word = letters.join('').toLowerCase()
      if(ENword.check(word)){
        theScore = wordscore(word)
      }
      else{
        theScore = 0
      } 
    }
    curUser.score = theScore
    updateBestScore(username, theScore)
    return redisAsPromised.hmset(gameId, 'users', JSON.stringify(users))
  })
  .then(() => {
    return theScore
  })
  .catch(err => {
    console.log(err)
  })
}

const updateBestScore = (username, score) => {
  //mongoDB call to update user's best score if appropriate
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

module.exports = {redisFlush, getLobby, addToLobby, createGame, getGame, getData, retireGame, addUserToGame, getUser, removeUserFromGame, editUser, editGame, nextTurn, scoreWord} 