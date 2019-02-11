const express = require('express')
const authCon = require('../controllers/auth')


const router = express.Router()

router.post('/', authCon.login)
router.get('/', authCon.authenticated, authCon.getAuthStatus )

module.exports = router