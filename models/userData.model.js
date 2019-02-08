const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    username: {type: String, required: true, max: 50},
    gamesWon: {type: Number, required: true, default: 0},
    highestScore: {type: Number, required: true, default: 0},
    createDate: {type: Date, required: true, default: Date.now}
})