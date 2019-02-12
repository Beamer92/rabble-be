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

module.exports = {getById, getUsers}