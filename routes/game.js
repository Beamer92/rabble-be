const express = require('express')
const gameCon = require('../controllers/game')

const router = express.Router()

router.get('/lobby', gameCon.getLobby)
router.post('/', gameCon.createGame)
router.get('/:gameId', gameCon.getGame)

router.get('/user/:username', gameCon.getUser)
router.put('/user/:username', gameCon.editUser)

router.delete('/:gameId', gameCon.retireGame)
router.get('/:gameId/item/:key', gameCon.getGameItem)
router.put('/:gameId/user/:username', gameCon.addUserToGame)
router.delete('/:gameId/user/:username', gameCon.removeUserFromGame)

module.exports = router
