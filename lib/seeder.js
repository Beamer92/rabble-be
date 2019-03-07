const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Users = require('../models/userDBModel')

const connectionstring = process.env.MONGODB_URI

if(process.env.NODE_ENV !== 'production'){
    connectionstring = 'mongodb://localhost:27017/rabbleDB'
}

mongoose.connect(connectionstring, {useNewUrlParser: true, useCreateIndex: true })

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
        gamesWon: 5,
        highestScore: 15,
        password: result
    },
    {
        username: "Roger",
        gamesWon: 8,
        highestScore: 12,
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