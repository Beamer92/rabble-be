const port = process.env.PORT || 5000
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const helpers = require('./lib/helpers')
const app = express()
let server = require('http').Server(app)
var io = require('socket.io').listen(server);
const auth = require('./routes/auth')
const user = require('./routes/user')
const game = require('./routes/game')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
  helpers.redisFlush()
}

//THIS WILL NEED CHANGING WHEN DEPLOYED
const connectionstring = `mongodb://localhost:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`
mongoose.connect(connectionstring, {useNewUrlParser: true, useCreateIndex: true })


io.on('connection', socket => {
  console.log('New client connected ', socket.id)

  socket.on('connect game', async (username) => {
    let user = await game.getUser(username)
    if(!user){
      let gameId = await game.newUser(username)
      io.sockets.emit('connect game', gameId, username)
    }
    else {
      io.sockets.emit('connect game', user.gameId, username)
    }
  })

  socket.on('get user', async (username) => {
    let user = await game.getUser(username)
    io.sockets.emit('get user', user)
  })

  socket.on('get game', async (gameId) => {
    let gameObj = await game.getGame(gameId)
    io.sockets.emit('get game', gameObj)
  })

  socket.on('send letters', (letters) => {
    console.log('letters array is ', letters)
    io.sockets.emit('send letters', letters.join(''))
  })

  socket.on('disconnect', (username) => {
    console.log('user disconnected')
  })
})

app.use('/auth', auth)
app.use('/user', user)
app.use('/game', game.router)

app.use((err, req, res, next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err })
  })
  
app.use((req, res, next) => {
  res.status(404).json({ error: { message: 'Not found' }})
})
  
if (process.env.NODE_ENV !== 'development') {
    const listener = () => console.log(`Words are hard, but roving on port ${port} is easy`)
    server.listen(port, listener)
}
