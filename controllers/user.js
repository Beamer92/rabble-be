const userMod = require('../models/user')

const getOneByUsername = (req,res,next) => {
    if(!req.body.username) next()
    const user = userMod.getOneByUsername(req.body.username)
    console.log(user)
    return res.status(200).send(user)
}

module.exports = {getOneByUsername}