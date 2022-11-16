const express = require('express');
const app = express();
const http = require('http');
var server = require('http').createServer(app);
const { Server } = require("socket.io");
var io = require('socket.io')(server);
const path = require('path');
const controllers = require('./controllers/players.js')
const db = require('./db/index.js')
const algo = require('./Algorithm/index.js')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static(path.join(__dirname, '../client/dist')));




var allPlayers = [];
var allPlayersInRound = [];
var counter = 0;

var deck = []
var flop= false;
var turn= false;
var river= false;
var activeBet= true;
var allPlayersActed= true;
var board = [];



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
      bank: playerInfo.bank,
      hole: []
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
  //handle game start
  socket.on('roundStart', function() {

    allPlayersInRound = allPlayers;
    deck = algo.buildDeck();

    for (let card = 0; card < 2; card += 1) {
      for(let player = 0; player < allPlayersInRound.length; player += 1) {
        allPlayersInRound[player].hole.push(deck.pop());
        allPlayersInRound[player].acted = false;
      }
    }

    for(let i = 0; i < allPlayersInRound.length; i += 1) {
      io.to(allPlayersInRound[i].id).emit('giveCards', allPlayersInRound[i].hole)
    }

    let turn = allPlayersInRound[counter].name
    console.log(deck)
    io.emit('trackTurns', turn)
  })
  //on Player action
  socket.on('playerAction', function(actionObject) {

    for(let i = 0; i < allPlayersInRound.length; i++) {
      if(allPlayersInRound[i].name === actionObject.name) {
        allPlayersInRound[i].acted = true;
      }

    }


    for(let i = 0; i < allPlayersInRound.length; i++) {
      if(allPlayersInRound[i].acted === false) {
        allPlayersActed = false;
      }
    }

    if(allPlayersActed) {
      console.log('yes its working')
      if(!flop) {
        for(let i = 0; i < 3; i++) {
          board.push(deck.pop());
        }
        io.emit('boardCards', board)
      }
    } else {
      counter++
      if(counter > allPlayersInRound.length - 1) {
        console.log(counter)
        counter = 0
      }
      let turn = allPlayersInRound[counter].name
      io.emit('trackTurns', turn)
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