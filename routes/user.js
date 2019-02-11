const express = require('express')
const userCon = require('../controllers/user')

const router = express.Router()

router.get('/', userCon.getOneByUsername)
// router.get('/', userCon.getget)

module.exports = router

// mongo
// use rabbleDB
// db.getCollection('users').find()
