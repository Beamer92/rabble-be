const mongoose = require('mongoose')
const User = require('../models/userDBModel')

const getById = (id) => {
    return User.findOne({'_id': id}).select('username gamesWon highestScore createDate password')
}

const getAll = () => {
    return User.find({})
}

const getOneByUsername = (username) => {
    return User.findOne({'username': username}).select('username gamesWon highestScore createDate password')
}

module.exports = {getById, getAll, getOneByUsername}