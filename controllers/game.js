const helper = require('../lib/helpers')
const shortid = require('shortid')

const getLobby = (req,res,next) => {
    return helper.getLobby()
    .then(result => {
        if(result) return res.send(result)
        return res.send('There is no Lobby Object in Memory')
    })
    .catch(err => {
        next(err)
    })
}

const createGame = (req,res,next) => {
    return helper.getLobby()
    .then(result => {
        gameId = shortid.generate()
        return helper.addToLobby(gameId)
    })
    .then(() => {
        return res.send(gameId)
    })
    .catch(err => {
        next(err)
    })
    // return helper.createGame()
    // .then(result => {
    //     res.send(result)
    // })
    // .catch(err => {
    //     next(err)
    // })


}





module.exports = {getLobby, createGame}