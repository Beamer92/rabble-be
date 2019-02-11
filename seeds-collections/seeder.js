//this is just a script to run collection and seed creation on a local install
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Users = require('../models/userDBModel')

const connectionstring = `mongodb://localhost:27017/rabbleDB`
mongoose.connect(connectionstring, {useNewUrlParser: true})

const dropColl = () => { return new Promise((resolve, reject) => {
    mongoose.connection.collections['users']
    .drop(err => {
        resolve(console.log('collection dropped'))
    })
})}

dropColl()
.then(() => {
    return bcrypt.hash('123', 10)
})
.then(result => {
    return Users.create({
        username: "Beamer92",
        gamesWon: 0,
        highestScore: 0,
        createDate: 0,
        password: result
    })
})
.then(user => {
    console.log(`${user.length} users created`)
    return mongoose.connection.close();
})
.catch((err) => {
    console.log(err);
    return mongoose.connection.close();
})