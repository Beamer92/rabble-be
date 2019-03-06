const helpers = require('../lib/helpers')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-@')

const newUser = async (username) => {
    let lobby = await helpers.getLobby()
    let openGame = await findGame(lobby)
    if(!openGame){
        openGame = await createGame()
    } 
    await helpers.addUserToGame(openGame, username)
    return openGame
}

const findGame = async (lobby) => {
    if(lobby.length === 0) return null
    let game = await helpers.getGame(lobby[0])
    if(game.ulength < 4) return lobby[0]
    return findGame(lobby.slice(1))
}

const createGame = async () => {
    const gameId = shortid.generate()
    await helpers.addToLobby(gameId)
    await helpers.createGame(gameId)
    return gameId
}

const addDirect = async (gameId, users) => {
    for(let u = 0; u < users.length; u++){
        await helpers.addUserToGame(gameId, users[u])
    }
    return users
}

const getUser = (username) => {
   return helpers.getUser(username)
}

const getGame = (gameId) => {
    return helpers.getGame(gameId)
}

const editUser = async (username, rover, letters) => {
    return await helpers.editUser(username, rover, letters)
}

const editGame = async (gameId, mapgrid) => {
    return await helpers.editGame(gameId, mapgrid)
} 

const getRovers = (userList)=>{
    let userDataPromise = userList.map(user => {
        return Promise.all([Promise.resolve(user), helpers.getData(user, 'position')])
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

module.exports = {newUser, getUser, getGame, editUser, editGame, getRovers, nextTurn, scoreWord, removeUser, retireGame, createGame, addDirect}
