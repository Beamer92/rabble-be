const bcrypt = require('bcrypt')
const User = require('../models/user')

  function userLogin(username, password){
    let user
    return User.getOneByUsername(username)
    .then(function(data){
      if(!data) throw { status: 400, message: "User Data Not Present"}
      user = data
      return bcrypt.compare(password, data.password)
    })
    .then(function(status){
      if(!status) throw { status: 401, message: "Unauthorized to access this content"}
      delete user.password
      return user
    })
  }

  

  module.exports = {userLogin}