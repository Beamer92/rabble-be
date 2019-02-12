const port = process.env.PORT || 3000
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').load()
}

//THIS WILL NEED CHANGING WHEN DEPLOYED
const connectionstring = `mongodb://localhost:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`
mongoose.connect(connectionstring, {useNewUrlParser: true})

const app = express()
app.use(bodyParser.json())
app.use(cors())

if(process.env.NODE_ENV === 'development') app.use(morgan('dev'))

const auth = require('./routes/auth')
const user = require('./routes/user')
const game = require('./routes/game')
app.use('/auth', auth)
app.use('/user', user)
app.use('/game', game)


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
    let server = app.listen(port, listener)
}
