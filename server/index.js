const express = require('express');
const app = express();
const http = require('http');
var server = require('http').createServer(app);
const { Server } = require("socket.io");
var io = require('socket.io')(server);
const path = require('path');
const controllers = require('./controllers/players.js')
const db = require('./db/index.js')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static(path.join(__dirname, '../client/dist')));




var allPlayers = [];

io.on('connection', function(socket) {
  //when a user connects
  socket.on('grabPlayers', function() {
    socket.emit('players', allPlayers)
  })
  //when a user tries to join a table
  socket.on('joinTable', function(playerInfo) {

    var currentPlayer = {
      id: socket.id,
      name: playerInfo.name,
      bank: playerInfo.bank
    }
    if(allPlayers.length <= 9) {
      allPlayers.push(currentPlayer)
      console.log(allPlayers)
      socket.emit('joinSuccessful')
      socket.broadcast.emit('players', allPlayers)
      return;
    }
    if(allPlayers.length === 9) {
      socket.emit('tablefull')
    }

  })

  // Disconnect listener
  socket.on('disconnect', function() {

    for(var i = 0; i < allPlayers.length; i++) {
      if(socket.id === allPlayers[i].id) {

        allPlayers.splice(i,1);
        console.log(allPlayers)
      }
    }
      console.log('Client disconnected.');
  });
});

app.post('/login', controllers.logInUser)
app.post('/signUp', controllers.signUpUser)

app.use((req, res) => {
  res.send('Hello world');
});


const PORT = process.env.PORT || 3000;


server.listen(3000);
console.log(`Server listening at http://localhost:${PORT}`);