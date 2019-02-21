const express = require('express')
const gameCon = require('../controllers/game')

const router = express.Router()

// router.get('/lobby', gameCon.getLobby) //changed to socket function
// router.post('/', gameCon.createGame) //changed to coket function
// router.get('/:gameId', gameCon.getGame) changed to socket function

// router.get('/user/:username', gameCon.getUser) //changed to socket function
// router.put('/user/:username', gameCon.editUser)

router.delete('/:gameId', gameCon.retireGame)
// router.get('/:gameId/item/:key', gameCon.getGameItem)
router.put('/:gameId/user/:username', gameCon.addUserToGame)
router.delete('/:gameId/user/:username', gameCon.removeUserFromGame)

const newUser = async (username) => {
    let lobby = await gameCon.getLobby()
    let openGame = await findGame(lobby)
    if(!openGame){
        openGame = await gameCon.createGame()
    } 
    let result = await gameCon.addUserToGame(openGame, username)
    return result
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

module.exports = {router, newUser, getUser, getGame, editUser, editGame, getRovers}
