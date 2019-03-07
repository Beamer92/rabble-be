const helpers = require('../lib/helpers')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-@')

const newUser = async (username) => {
    try {
        let lobby = await helpers.getLobby()
        let openGame = await findGame(lobby)
        if(!openGame){
            openGame = await createGame()
        } 
        await helpers.addUserToGame(openGame, username)
        return openGame
    }
    catch(err){
        throw err
    }
}

const findGame = async (lobby) => {
    try {
        if(lobby.length === 0) return null
        let game = await helpers.getGame(lobby[0])
        if(game.ulength < 4) return lobby[0]
        return findGame(lobby.slice(1))
    }
    catch(err){
        throw err
    } 
}

const createGame = async () => {
    try {
        const gameId = shortid.generate()
        await helpers.addToLobby(gameId)
        await helpers.createGame(gameId)
        return gameId
    }
    catch(err){
        throw err
    } 
}

const addDirect = async (gameId, users) => {
    try {
        for(let u = 0; u < users.length; u++){
            await helpers.addUserToGame(gameId, users[u])
        }
        return users
    }
    catch(err){
        throw err
    } 
}

const getUser = async (username) => {
    try {
        return await helpers.getUser(username)
    }
    catch(err){
        throw err
    } 
}

const getGame = async (gameId) => {
    try {
        return await helpers.getGame(gameId)
    }
    catch(err){
        throw err
    }
}

const editUser = async (username, rover, letters) => {
    try {
        return await helpers.editUser(username, rover, letters)
    }
    catch(err){
        throw err
    } 
}

const editGame = async (gameId, mapgrid) => {
    try {
        return await helpers.editGame(gameId, mapgrid)
    }
    catch(err){
        throw err
    } 
} 

const getRovers = (userList)=>{
    let userDataPromise = userList.map(user => {
        return Promise.all([Promise.resolve(user), helpers.getData(user, 'position')])
    })
    return Promise.all(userDataPromise)
}

const nextTurn= async (gameId)=> {
    try {
        return await helpers.nextTurn(gameId)
    }
    catch(err){
        throw err
    } 
}

const scoreWord = (gameId, username, letters)=>{
    return helpers.scoreWord(gameId, username, letters)
}

const removeUser = async(gameId, username) => {
    try {
        return await helpers.removeUserFromGame(gameId, username)
    }
    catch(err){
        throw err
    } 
}

const retireGame = async(gameId) => {
    try {
        return await helpers.retireGame(gameId)
    }
    catch(err){
        throw err
    }  
}

module.exports = {newUser, getUser, getGame, editUser, editGame, getRovers, nextTurn, scoreWord, removeUser, retireGame, createGame, addDirect}
