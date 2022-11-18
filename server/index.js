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
var dealerButton = 0;

var deck = []
var flop= false;
var turn= false;
var river= false;
var activeBet= 0;
var allPlayersActed;
var board = [];
var potSize = 0;



var turnAllPlayersFalse = () => {
  for(let player = 0; player < allPlayersInRound.length; player += 1) {
    allPlayersInRound[player].acted = false;
  }
}
var newBettingRound = () => {
  activeBet = 0;
  counter = 0;
  let turn = allPlayersInRound[counter].name;
  io.emit('trackTurns', turn);
}

var newRound = () => {
  console.log('round generation',allPlayers);
  allPlayersInRound = JSON.parse(JSON.stringify(allPlayers));
  io.emit('playersInRound', allPlayersInRound);
  deck = algo.buildDeck();

  for (let card = 0; card < 2; card += 1) {
    for(let player = 0; player < allPlayersInRound.length; player += 1) {
      allPlayersInRound[player].hole.push(deck.pop());
      allPlayersInRound[player].acted = false;
    }
  }

  for(let i = 0; i < allPlayersInRound.length; i += 1) {
    io.to(allPlayersInRound[i].id).emit('giveCards', allPlayersInRound[i].hole);
  }

  counter = 0;

  let turn = allPlayersInRound[counter].name;
  console.log(deck);
  board = [];
  io.emit('boardCards', board);
  io.emit('trackTurns', turn);
}

async function resolveShowdown() {
  var showdownObject = await algo.handleShowdown(board, allPlayersInRound);

  if(showDownObject.winners.length === 1) {
    allPlayers.forEach((player) => {
      if(player.name === allPlayersInRound[0].name) {
        player.bank = player.bank + potSize
      }
    })
  }
  if(showDownObject.winners.length > 1) {

  }
  controllers.updateBanks(allPlayers);
  console.log(showdownObject)
  io.emit('winner', showdownObject.winners)
  setTimeout(() => {
  newRound();
  io.emit('boardCards', board)
}, 5000)
}



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
    newRound();
  })
  //on Player action
  socket.on('playerAction', function(actionObject) {

    if(actionObject.action === 'fold') {
      for(let i = 0; i < allPlayersInRound.length; i++) {
        if(allPlayersInRound[i].name === actionObject.name) {
          console.log(allPlayersInRound[i].name)
          console.log(actionObject.name)
          allPlayers.forEach((singlePlayer) => {
            if(singlePlayer.name === allPlayersInRound[i].name) {
              console.log('entered here', singlePlayer.bank)
              singlePlayer.bank = allPlayersInRound[i].bank
              console.log('changed it', singlePlayer.bank)
            }
          })
          allPlayersInRound.splice(i,1)
          counter--


        }
      }
      io.emit('playersInRound', allPlayersInRound)
    }

    if(actionObject.action === 'bet') {
      turnAllPlayersFalse();
      io.emit('bet', actionObject.betnumber)
      allPlayersInRound.forEach((singlePlayer) => {
        if(singlePlayer.name === actionObject.name) {
          singlePlayer.bank = singlePlayer.bank - actionObject.betnumber
        }
      })
      console.log(allPlayersInRound)
      activeBet= actionObject.betnumber
      potSize += actionObject.betnumber
      socket.emit('players', allPlayers)


    }

    if(actionObject.action === 'call') {
      allPlayersInRound.forEach((singlePlayer) => {
        if(singlePlayer.name === actionObject.name) {
          singlePlayer.bank = singlePlayer.bank - activeBet
        }
      })

      console.log(allPlayersInRound)
      socket.emit('playersInRound', allPlayersInRound)


    }

    //If theres no one left in the round
    if(allPlayersInRound.length < 2) {
      var roundEndObject = {
        name: allPlayersInRound[0].name,
        potSize: potSize
      }
      allPlayers.forEach((player) => {
        if(player.name === allPlayersInRound[0].name) {
          player.bank = player.bank + potSize
        }
      })
      controllers.updateBanks(allPlayers);
      io.emit('winner', allPlayersInRound[0].name)
      setTimeout(() => {
        newRound();
      }, 5000)

    } else {
      for(let i = 0; i < allPlayersInRound.length; i++) {
        if(allPlayersInRound[i].name === actionObject.name) {
          allPlayersInRound[i].acted = true;
        }

      }
      //check to see if all the players have finished acting
      allPlayersActed = true;
      for(let i = 0; i < allPlayersInRound.length; i++) {
        if(allPlayersInRound[i].acted === false) {
          allPlayersActed = false;
        }
      }
      //move forward the betting rounds
      if(allPlayersActed) {
        console.log('yes its working')
        if(!flop) {
          deck.pop();
          for(let i = 0; i < 3; i++) {
            board.push(deck.pop());
          }
          turnAllPlayersFalse();
          flop = true;
          newBettingRound();
          io.emit('boardCards', board)

        }else if (!turn) {
          deck.pop();
          board.push(deck.pop());
          turn = true;
          newBettingRound();
          turnAllPlayersFalse();
          io.emit('boardCards', board)
        } else if (!river) {
          deck.pop();
          board.push(deck.pop());
          river = true;
          newBettingRound();
          turnAllPlayersFalse();
          io.emit('boardCards', board)
        } else {
          resolveShowdown();
        }
      } else {
        //start the next turn
        counter++
        if(counter > allPlayersInRound.length - 1) {
          console.log(counter)
          counter = 0
        }
        let turn = allPlayersInRound[counter].name
        io.emit('trackTurns', turn)
      }

    }
    //set the player who just acted to true






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