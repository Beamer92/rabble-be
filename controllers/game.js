const helper = require('../lib/helpers')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-@') //set characters for shortid, don't want underscores or dashes

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
    const gameId = shortid.generate()
    return helper.addToLobby(gameId)
    .then(() => {
        return helper.createGame(gameId)
    })
    .then(result => {
        return res.send(gameId)
    })
    .catch(err => {
        next(err)
    })
}

const getGame = (req,res,next) => {
    return helper.getGame(req.params.gameId)
    .then(result => {
        if(!result) return next({status: 400, message: "Game Not Found"})
        return res.send(result)
    })
    .catch(err => {
        next(err)
    })
}

const getGameItem = (req,res,next) => {
    return helper.getGame(req.params.gameId)
    .then(result => {
        if(!result) return next({status: 400, message: "Game Not Found"})
        return helper.getGameItem(req.params.gameId, req.params.key)
    })
    .then(result => {
        if(!result) return next({status: 400, message: "Game Item Not Found"})
        return res.send(result)
    })
    .catch(err => {
        next(err)
    })
}

const retireGame = (req, res, next) => {
    return helper.retireGame(req.params.gameId)
    .then(result => {
        return res.send('Deleted')
    })
    .catch(err => {
        next(err)
    })
}

const addUserToGame = (req, res, next) => {
    
}

const removeUserFromGame = (req, res, next) => {
    //this will be tricky to fire when a user closes a browser, consider also running on a timeout 
}

//next steps: add user to game, remove user from game


module.exports = {getLobby, createGame, getGame, getGameItem, retireGame, addUserToGame, removeUserFromGame}