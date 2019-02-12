const express = require('express')
const helper = require('../lib/helpers')

const router = express.Router()

// const getGames = () => {
//     return helper.fetchGames()
//     .then(res => {
//         return res
//     })
//     .catch(err => {
//         next(err)
//     })
// }

router.get('/', (req,res,next) => {
    helper.fetchGames()
    .then(games => {
        res.send(games)
    })
})

module.exports = router