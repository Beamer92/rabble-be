# Rabble Rover Back End

Rabble Rover is a Mars Rover themed reverse scrabble game. The object is to collect letters in order to create the best possible word for scoring

Letters are a scarce resource, and once it's been picked up by another player it's gone.

## [Front End Link Here](www.github.com/Beamer92/rabble-fe)

## Technologies

This Express.js server uses a MongoDB database as a user-store, a Redis cache to store and communicate game-state, and socket.io to connect players

## Build Instructions

* First you must install MongoDB, for instructions go here: https://docs.mongodb.com/manual/installation/
* Once that's installed, you may need to start the service, use ```service mongod start``` (Linux) to start Mongo
* Next you will want to create your Mongo Database and Collection, use ```mongo``` to open up the CLI and ```use rabbledb``` to open/create that database
* Store this database in your .env file, which should look like this:
```
    SECRET = secrettimemyroommateputshishairinamanbun
    REDIS_URL = http://localhost:6379
    MONGODB_URI = mongodb://localhost:27017/rabbledb
```
* Next you can use the ```./lib/seeder.js``` file to create the users collection and add a test user, use ```node ./lib/seeder.js``` to do so
* now run ```npm run dev``` to start the server in development. Redis will be created/flushed at the given .env URL every time

### Next Steps/To Do:
* Re-Do the Redis data structures, just put all user data in the game state. Leave Users with only their current GameId for easy lookups
    * This will allow things like showing the winning word(s) at the end of the game
* Consolidate Redis calls, There's probably more than are strictly necessary
    * Alternatively, create fewer, longer calls for specific actions
* Remove the Game Controllers, they're just an extra step I don't really need between Routes/Controllers for the Redis 'routes'