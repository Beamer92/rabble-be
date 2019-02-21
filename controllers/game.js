const helper = require('../lib/helpers')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-@') //set characters for shortid, don't want underscores or dashes


const getLobby = () => {
    return helper.getLobby()
    .then(result => {
        return result
    })
    .catch(err => {
        // next(err)
        console.log(err)
    })
}

const getGame = (gameId) => {
    return helper.getGame(gameId)
    .then(result => {
        if(!result) return 'Game Not Found'
        return result
    })
    .catch(err => {
        // next(err)
        console.log(err)
    })
}

const createGame = () => {
    const gameId = shortid.generate()
    return helper.addToLobby(gameId)
    .then(() => {
        return helper.createGame(gameId)
    })
    .then(result => {
        return gameId
    })
    .catch(err => {
        // next(err)
        console.log(err)
    })
}

const addUserToGame = (gameId, username) => {
    return helper.addUserToGame(gameId, username)
    .then(result => {
        return gameId
    })
    .catch(err => {
        // next(err)
        console.log(err)
    })
}


const getUser = (username) => {
    return helper.getUser(username)
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err)
    })
}

const editUser = (username, rover, letters) => {
    return helper.editUser(username, rover, letters)
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err)
    })
}

const editGame = (gameId, mapgrid) => {
    return helper.editGame(gameId, mapgrid)
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err)
    })
}

const getData = (id, key) => {
    return helper.getData(id, key)
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err)
    })
}

// const getGameItem = (req,res,next) => {
//     return helper.getGame(req.params.gameId)
//     .then(result => {
//         if(!result) return next({status: 400, message: "Game Not Found"})
//         return helper.getGameItem(req.params.gameId, req.params.key)
//     })
//     .then(result => {
//         if(!result) return next({status: 400, message: "Game Item Not Found"})
//         return res.send(result)
//     })
//     .catch(err => {
//         next(err)
//     })
// }

const retireGame = (req, res, next) => {
    return helper.retireGame(req.params.gameId)
    .then(result => {
        return res.send('Deleted')
    })
    .catch(err => {
        next(err)
    })
}


const removeUserFromGame = (req, res, next) => {
    return helper.removeUserFromGame(req.params.gameId, req.params.username)
    .then(result => {
        return res.send('User removed from game')
    })
    .catch(err => {
        next(err)
    })
}



module.exports = {getLobby, createGame, getGame, getData, retireGame, addUserToGame, removeUserFromGame, getUser, editUser, editGame}