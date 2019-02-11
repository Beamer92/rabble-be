const mongoose = require('mongoose')
const User = require('../models/userDBModel')

const getOneByUsername = (username) => {
        return User.findOne({'username': username}, 'username, gamesWon, highestScore, createDate', function(err, user){
        if(err) throw {status: 404, message: 'User not found'}
        return JSON.stringify(user)
    })
}

module.exports = {getOneByUsername}