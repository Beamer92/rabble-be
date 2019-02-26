const userMod = require('../models/user')

const getById = (req,res,next) => {
    if(!req.params.id) next()
    userMod.getById(req.params.id)
    .then(user => {
        user = user.toObject()
        delete user.password
        return res.status(200).send(user)
    })
    .catch(err => {
        next(err)
    })
}

const getUsers = (req,res,next) => {
   userMod.getAll()
   .then(users => {
       const userList = users.map(user => {
           user = user.toObject()
           delete user.password
           delete user.__v
           return user
       })
       return res.status(200).send(userList)
   })
   .catch(err => {
       next(err)
   })
}

const createUser = (req,res,next) => {
    if(!req.body.username || !req.body.password) next({status: 400, message: "Email and Password Required"})
    let pw = req.body.password
    if(!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw) || !/[&._$^%*@#]/.test(pw) || pw.length < 8) next({status: 400, message: "Password does not meet security standards"})
    userMod.createUser(req.body.username, pw)
    .then(user => {
        res.status(201).send(user)
    })
    .catch(err => {
        if(err.code === 11000) next({status: 400, message: 'That username already exists'})
        next({status: 400, message: 'Could not create user'})
    })
}

const updateGamesWon = (req,res,next) => {
    if(!req.body.gamesWon) next({status: 400, message: "Games Won Value Not Present"})
    let gamesWon = req.body.gamesWon
    userMod.updateGamesWon(req.params.id, gamesWon)
    .then(result => {
        res.status(200).send('Updated!')
    })
    .catch(err => {
        next({status: 400, message: 'Could Not Update Games Won'})
    })
}

module.exports = {getById, getUsers, createUser, updateGamesWon}