const authMod = require('../models/auth')
const jwt = require('jsonwebtoken')

function login(req, res, next){
    if(!req.body.username) return next({ status: 400, message: 'Must include Username'})
    if(!req.body.password) return next({ status: 400, message: 'Must include User Password'})
    authMod.userLogin(req.body.username, req.body.password)
    .then(function(user){
      const token = jwt.sign({id: user.id, username: user.username}, process.env.SECRET)
      return res.status(200).json(JSON.stringify({ token }))
    })
    .catch(next)
  }

function getAuthStatus(req, res, next){
  res.status(200).json(JSON.stringify({id: req.claim.id}))
}

function authenticated(req, res, next){
  if(!req.headers.authorization) return next({status: 404, message: "Authorization Not Found" })
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