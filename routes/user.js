const express = require('express')
const userCon = require('../controllers/user')

const router = express.Router()

router.get('/', userCon.getOneByUsername)

module.exports = router