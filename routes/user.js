const express = require('express')
const userCon = require('../controllers/user')

const router = express.Router()

router.get('/', userCon.getUsers)
router.get('/:id', userCon.getById)


module.exports = router

// mongo
// use rabbleDB
// db.getCollection('users').find()
