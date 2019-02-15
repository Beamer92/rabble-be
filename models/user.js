const mongoose = require('mongoose')
const Users = require('../models/userDBModel')
const bcrypt = require('bcrypt')

const getById = (id) => {
    return User.findOne({'_id': id}).select('username gamesWon highestScore createDate password')
}

const getAll = () => {
    return User.find({})
}

const getOneByUsername = (username) => {
    return User.findOne({'username': username}).select('username gamesWon highestScore createDate password')
}

const createUser = (username, password) => {
    return bcrypt.hash(password, 10)
    .then(hashpass => {
        return Users.create({
            username: username,
            password: hashpass
        })
    })
    .catch(err => {
        throw err
    })
}

module.exports = {getById, getAll, getOneByUsername, createUser}