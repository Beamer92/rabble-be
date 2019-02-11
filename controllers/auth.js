const authMod = require('../models/auth')
const jwt = require('jsonwebtoken')

function login(req, res, next){

    if(!req.body.username) next({ status: 400, message: 'Must include Username'})
    if(!req.body.password) next({ status: 400, message: 'Must include User Password'})
    authMod.userLogin(req.body.username, req.body.password)
    .then(function(user){
      const token = jwt.sign({id: user.id, username: user.username}, process.env.SECRET)
      return res.status(200).send({ token })
    })
    .catch(next)
  }

function getAuthStatus(req, res, next){
  res.status(200).send({id:req.claim.id})
}

function authenticated(req, res, next){
  if(!req.headers.authorization) next({status: 404, message: "Authorization Not Found" })
  const [scheme, credentials] = req.headers.authorization.split(' ')
  
      jwt.verify(credentials, process.env.SECRET, (err, payload)=>{
      if(err){
        return next({ status: 401, message: 'Token Verification Failed' })
      }
      req.claim = payload
      next()
    })
}

function isSelf(req, res, next){
    if(parseInt(req.params.userId) !== req.claim.id){
        return next({ status: 401, message: 'Unauthorized' })
    }
    next()
}
  

module.exports = {login
,authenticated,
getAuthStatus,
isSelf}