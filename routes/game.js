const express = require('express')
const gameCon = require('../controllers/game')
const helpers = require('../lib/helpers')

const router = express.Router()

const newUser = async (username) => {
    let lobby = await gameCon.getLobby()
    let openGame = await findGame(lobby)
    if(!openGame){
        openGame = await gameCon.createGame()
    } 
    let result = await gameCon.addUserToGame(openGame, username)
    return result
}

const createGame = async () => {
    let newGame = await gameCon.createGame()
    return newGame
}

const addDirect = async (gameId, users) => {
    for(let u = 0; u < users.length; u++){
        let result = await gameCon.addUserToGame(gameId, users[u])
    }
    return users
}

const findGame = async (lobby) => {
    if(lobby.length === 0) return null
    let game = await gameCon.getGame(lobby[0])

    if(game.ulength < 4) return lobby[0]
    return findGame(lobby.slice(1))
}

const getUser = async(username) => {
   return await gameCon.getUser(username)
}

const getGame = async (gameId) => {
    return await gameCon.getGame(gameId)
}

const editUser = async (username, rover, letters) => {
    return await gameCon.editUser(username, rover, letters)
}

const editGame = async (gameId, mapgrid) => {
    return await gameCon.editGame(gameId, mapgrid)
} 

const getRovers = (userList)=>{
    let userDataPromise = userList.map(user => {
        return Promise.all([Promise.resolve(user), gameCon.getData(user, 'position')])
    })
    return Promise.all(userDataPromise)
}

const nextTurn= async (gameId)=> {
    return await helpers.nextTurn(gameId)
}

const scoreWord = async(gameId, username, letters)=>{
    return await helpers.scoreWord(gameId, username, letters)
}

const removeUser = async(gameId, username) => {
    return await helpers.removeUserFromGame(gameId, username)
}

const retireGame = async(gameId) => {
    return await helpers.retireGame(gameId)
}

module.exports = {router, newUser, getUser, getGame, editUser, editGame, getRovers, nextTurn, scoreWord, removeUser, retireGame, createGame, addDirect}
