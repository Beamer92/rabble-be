const userMod = require('../models/user')

const getOneByUsername = (req,res,next) => {
    if(!req.body.username) next()
    const user = userMod.getOne(req.body.username)
    res.status(200).send(user)
}



module.exports = {getOneByUsername}