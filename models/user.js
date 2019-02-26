const mongoose = require('mongoose')
const Users = require('../models/userDBModel')
const bcrypt = require('bcrypt')

const getById = (id) => {
    return Users.findOne({'_id': id}).select('username gamesWon highestScore createDate password')
}

const getAll = () => {
    return Users.find({})
}

const getOneByUsername = (username) => {
    return Users.findOne({'username': username}).select('username gamesWon highestScore createDate password')
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

const updateBestScore = (username, score) => {
    return getOneByUsername(username)
    .then(result => {
        let oldScore = JSON.parse(result.highestScore)
        if(score > oldScore){
            return Users.updateOne({'username': username}, {'highestScore': score})
        }
    })
    .catch(err => {
        console.log(err)
    })
}

const updateGamesWon = (id, gamesWon) => {
    return Users.updateOne({'_id': id}, {'gamesWon': gamesWon})
}

module.exports = {getById, getAll, getOneByUsername, createUser, updateBestScore, updateGamesWon}