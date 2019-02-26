const express = require('express')
const userCon = require('../controllers/user')

const router = express.Router()

router.get('/', userCon.getUsers)
router.post('/', userCon.createUser)
router.get('/:id', userCon.getById)
router.put('/:id', userCon.updateGamesWon)


module.exports = router

// mongo
// use rabbleDB
// db.getCollection('users').find()
