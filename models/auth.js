const bcrypt = require('bcrypt')
// const userModel = require('../models/usermod')

  function userLogin(username, password){
    let user
    // return userModel.getOneByEmail(email)
    // .then(function(data){
    //   if(!data) throw { status: 400, message: "User Data Not Present"}
    //   user = data
    //   return bcrypt.compare(password, data.hash_pass)
    // })
    // .then(function(status){
    //   if(!status) throw { status: 401, message: "Unauthorized to access this content"}
    //   delete user.password
    //   return user
    // })
  }

  

  module.exports = {userLogin}