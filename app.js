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
}

helpers.redisFlush()
const connectionstring = process.env.MONGODB_URI
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
    	io.sockets.to(socket.id).emit('get user', user)
  	})

	socket.on('get game', async (gameId) => {
			let gameObj = await game.getGame(gameId)
			io.sockets.emit('get game', gameObj)
	})

	socket.on('set user', async (username, rover, letters)=> {
		await game.editUser(username, rover, letters)
		io.sockets.to(socket.id).emit(username, 'updated')
		socket.broadcast.emit('update users');
	})
		
	socket.on('set game', async (gameId, mapgrid)=>{
		await game.editGame(gameId, mapgrid)
		io.sockets.to(socket.id).emit('grid updated')
	})

	socket.on('get rovers', async (userList)=>{
		let result = await game.getRovers(userList)
		io.sockets.to(socket.id).emit('get rovers', result)
	})

	socket.on('next turn', async (gameId) => {
		let gameObj = await game.nextTurn(gameId)
		if(gameObj.hasOwnProperty('winners')){
			io.sockets.emit('winners', gameObj)
		}
		else {
			io.sockets.emit('get game', gameObj)
		}
	})

	socket.on('score word', async (gameId, username, letters) => {
		let score = await game.scoreWord(gameId, username, letters)
		io.sockets.to(socket.id).emit('score word', score)
	})

	socket.on('logout', async(gameId, username) => {
		let logout = await game.removeUser(gameId, username)
		if(logout.ulength >= 1 ){
			io.sockets.emit('get game', logout)
		}
	})

	socket.on('newGame', (gameId) => {
		return game.getGame(gameId)
		.then(endGame => {
			uList = JSON.parse(endGame.users)
			return game.retireGame(gameId)
		})
		.then(() => {
			return game.createGame()
		})
		.then(newGameId => {
			let users = uList.map(u => u.name)
			newGID = newGameId
			return game.addDirect(newGameId, users)
		})
		.then(users => {
			for(let u = 0; u < users.length; u++){
				io.sockets.emit('connect game', newGID, users[u])
			}
		})
		.catch(err => {
			console.log(err)
		})
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
		//need to remove user from game here entirely....
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
