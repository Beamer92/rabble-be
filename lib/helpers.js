const { redisAsPromised } = require("../redis");
const wordscore = require('scrabble-score')
const checkWord = require('check-word')
const ENword = checkWord('en')
const dbuser = require('../models/user')


const redisFlush = async () => {
  try {
    return await redisAsPromised.flush()
  }
  catch(err){
    console.log('Could not flush redis cache', err)
    throw err
  }
}

const getLobby = () => {
  return redisAsPromised.smembers('lobby')
}

const addToLobby = (gameId) => {
  return redisAsPromised.sadd('lobby', gameId)
}

const createGame = (gameId) => {
  const gridmap = genMap()
  return redisAsPromised.hmset(gameId, 'map', JSON.stringify(gridmap), 'ulength', '0', 'users', JSON.stringify([]), 'turn', '')
}

const getGame = (gameId) => {
  return redisAsPromised.hgetall(gameId)
}

const getUser = (username) => {
  return redisAsPromised.hgetall(username)
}

const editUser = (username, rover, letters) => {
  return redisAsPromised.hmset(username, 'position', JSON.stringify(rover.position), 'face', rover.face, 'letters', JSON.stringify(letters))
}

const editGame = (gameId, mapgrid) => {
  return redisAsPromised.hmset(gameId, 'map', JSON.stringify(mapgrid))
  .catch(err => {
    throw err
  })
}

const rotateTurn = (usersObj, turnInd) => {
  let newInd
  if(turnInd >= usersObj.length -1) {
    newInd = 0
  }
  else {
    newInd = turnInd + 1
  }
  if(usersObj[newInd].score >= 0){
    return rotateTurn(usersObj, newInd)
  }
  return usersObj[newInd].name
}

const nextTurn = (gameId) => {
  return redisAsPromised.hgetall(gameId)
  .then(game=>{
    let users = JSON.parse(game.users)
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
      return redisAsPromised.hmset(gameId, 'turn', '', 'winners', JSON.stringify(winners))
    }
    let curTurn = users.findIndex( u => u.name === game.turn)
    let nextUser
    if(curTurn === -1){
      nextUser = users[0].name
    }
    else {
      nextUser = rotateTurn(users, curTurn)
    }
    return redisAsPromised.hmset(gameId, 'turn', nextUser)
  })
  .then(() => {
    return redisAsPromised.hgetall(gameId)
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
    let turn = (data.turn === '' && length > 1) ? users[0].name : data.turn
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
      word = letters.join('').toLowerCase()
      if(ENword.check(word)){
        theScore = wordscore(word)
      }
      else{
        theScore = 0
      } 
    }
    curUser.score = theScore
    curUser.word = word
    dbuser.updateBestScore(username, theScore)
    return redisAsPromised.hmset(gameId, 'users', JSON.stringify(users))
  })
  .then(() => {
    return theScore
  })
  .catch(err => {
    console.log(err)
    throw err
  })
}

const removeUserFromGame = async (gameId, username) => {
  try{ 
      let data = await redisAsPromised.hgetall(gameId)
      let users = JSON.parse(data.users)
      let length = parseInt(data.ulength)
      if(length <= 0) throw 'No Users in this game'
      if(length === 1){
        await redisAsPromised.del(gameId)
        await redisAsPromised.del(username)
        await redisAsPromised.srem('lobby', gameId)
        return false
      }
      else {
        length -= 1
        dUserInd = users.findIndex(u => u.name === username)
        users.splice(dUserInd, 1)
        await redisAsPromised.hmset(gameId, 'users', JSON.stringify(users), 'ulength', length)
        await redisAsPromised.del(username)
        if(data.turn === username) {
          return await nextTurn(gameId)
        }
        return await redisAsPromised.hgetall(gameId)
      }
    }
  catch(err){
    console.log('ERROR HERE ', err)
    throw('Something went wrong removing the user', err)
  }
}

const retireGame = (gameId) => {
  return redisAsPromised.hmget(gameId, 'users')
  .then(userList => {
    const uL = JSON.parse(userList)
    const promArr = uL.map(user => {
      return redisAsPromised.del(user.name)
    })
    return Promise.all(promArr)
  })
  .then(result => {
    return redisAsPromised.del(gameId)
  })
  .then(() => {
    return redisAsPromised.srem('lobby', gameId)
  })
  .catch(err => {
    throw err
  })
}

module.exports = {redisFlush, getLobby, addToLobby, createGame, getGame, getData, retireGame, addUserToGame, getUser, removeUserFromGame, editUser, editGame, nextTurn, scoreWord} 