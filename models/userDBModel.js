const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true, max: 50, unique: true, dropDups: true},
    gamesWon: {type: Number, required: true, default: 0},
    highestScore: {type: Number, required: true, default: 0},
    createDate: {type: Date, required: true, default: Date.now},
    password: { type: String, required: true }
},
{collection: 'users'})

const Users = mongoose.model('users', userSchema)

module.exports = Users