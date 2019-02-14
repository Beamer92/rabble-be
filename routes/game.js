const express = require('express')
const gameCon = require('../controllers/game')

const router = express.Router()


router.get('/lobby', gameCon.getLobby)
router.post('/', gameCon.createGame)
router.get('/:gameId', gameCon.getGame)
router.delete('/:gameId', gameCon.retireGame)
router.get('/:gameId/item/:key', gameCon.getGameItem)
router.put('/:gameId/user/:username', gameCon.addUserToGame)
router.delete('/:gameId/user/:username', gameCon.removeUserFromGame)



module.exports = router

//alright, getLobby can go right to the helper from the controller
// create game will have several parts, the first part will be getting the Lobby, if Lobby exists then add it to the Lobby, otherwise create the Lobby with this game_id as the primary
// we'll then leave space to actually create the game object with the same gameId