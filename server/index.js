const express = require('express');
const app = express();
const http = require('http');
var server = require('http').createServer(app);
const { Server } = require("socket.io");
var io = require('socket.io')(server);
const path = require('path');
const controllers = require('./controllers/players.js')
const db = require('./db/index.js')
const logic = require('./gamelogic/index.js')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static(path.join(__dirname, '../client/dist')));


var gameObject = {
  allPlayers: [],
  allPlayersInRound: [],
  counter: 0,
  dealerButton: 0,
  deck: [],
  flop: false,
  turn: false,
  river: false,
  activeBet: 0,
  allPlayersActed: true,
  board: [],
  potSize: 0
};







var firstRound = true;
var buttonPosition = 0;
var dealerButtonActive = false;


var turnAllPlayersFalse = () => {
  for(let player = 0; player < gameObject.allPlayersInRound.length; player += 1) {
    if(!gameObject.allPlayersInRound[player].allIn) {
      gameObject.allPlayersInRound[player].acted = false;

    }
  }
}
var newBettingRound = () => {
  turnAllPlayersFalse();
  gameObject.counter = buttonPosition + 1;
  gameObject.activeBet = 0;
  io.emit('bet', 0)
  if(gameObject.counter > gameObject.allPlayersInRound.length - 1) {
    gameObject.counter = 0
  }
  for(let i = 0; i > gameObject.allPlayersInRound.length; i++) {
    gameObject.allPlayersInRound[i].bet = 0;
  }
  let playerTurn = gameObject.allPlayersInRound[gameObject.counter].name;
  io.emit('gameObject', gameObject)
  io.emit('trackTurns', playerTurn);
}

var newRound = () => {
  console.log('round generation',gameObject.allPlayers);
  gameObject.allPlayersInRound = JSON.parse(JSON.stringify(gameObject.allPlayers));
  if(gameObject.allPlayersInRound.length === gameObject.allPlayers.length) {
    gameObject.allPlayers = JSON.parse(JSON.stringify(gameObject.allPlayersInRound))
  }
  gameObject.board = [];
  gameObject.flop = false;
  gameObject.turn = false;
  gameObject.river = false;





  gameObject.deck = logic.buildDeck();


  for (let card = 0; card < 2; card += 1) {
    for(let player = 0; player < gameObject.allPlayersInRound.length; player += 1) {
      let currentPlayer = gameObject.allPlayersInRound[player]
      currentPlayer.hole.push(gameObject.deck.pop());
      currentPlayer.acted = false;
      currentPlayer.allIn = false;
      currentPlayer.winner = false;
    }
  }


  for(let i = 0; i < gameObject.allPlayersInRound.length; i += 1) {
    if(gameObject.allPlayersInRound[i].dealerButton) {
      dealerButtonActive = true;
      buttonPosition = i;
    }
    io.to(gameObject.allPlayersInRound[i].id).emit('giveCards', gameObject.allPlayersInRound[i].hole);
  }

  if(!firstRound) {

    console.log('inside firstRound')
    gameObject.allPlayersInRound[buttonPosition].dealerButton = false;
    gameObject.allPlayers[buttonPosition].dealerButton = false;

    buttonPosition  = buttonPosition + 1



    if(buttonPosition > gameObject.allPlayersInRound.length - 1) {
      buttonPosition = 0;
      gameObject.allPlayersInRound[0].dealerButton = true;
      gameObject.allPlayers[0].dealerButton = true;
    } else {
      console.log('buttonPosition',buttonPosition)
      gameObject.allPlayersInRound[buttonPosition].dealerButton = true;
      gameObject.allPlayers[buttonPosition].dealerButton = true;
    }
  }
  if(!dealerButtonActive) {
    console.log('inside dealerButtonActive')
    dealerButtonActive = true
    buttonPosition = 0;
    gameObject.allPlayersInRound[0].dealerButton = true;
    gameObject.allPlayers[0].dealerButton = true;
    console.log('dealerButton',gameObject.allPlayersInRound[0].dealerButton)
  }



  gameObject.counter = buttonPosition + 3;

  if(gameObject.counter > gameObject.allPlayersInRound.length - 1) {
    gameObject.counter = (buttonPosition - gameObject.allPlayersInRound.length) + 3;
  }

  //force a small and big blind bet
  smallBlind = buttonPosition + 1;
  bigBlind = buttonPosition + 2;

  if(gameObject.allPlayersInRound[smallBlind] === undefined){
    smallBlind = (buttonPosition - gameObject.allPlayersInRound.length) + 3;
  }
  if(gameObject.allPlayersInRound[bigBlind] === undefined){
    bigBlind = (buttonPosition - gameObject.allPlayersInRound.length) + 3;
  }
  gameObject.allPlayersInRound[smallBlind].bank = gameObject.allPlayersInRound[smallBlind].bank - 2
  gameObject.allPlayersInRound[smallBlind].bet = 2
  gameObject.allPlayersInRound[bigBlind].bank = gameObject.allPlayersInRound[bigBlind].bank - 5
  gameObject.allPlayersInRound[bigBlind].bet =  5




  let playerTurn = gameObject.allPlayersInRound[gameObject.counter].name;


  gameObject.activeBet = 5;
  gameObject.potSize = 7;
  io.emit('bet', 5);
  io.emit('gameObject', gameObject);
  io.emit('trackTurns', playerTurn);

}

async function resolveShowdown() {

  console.log('afterCash', gameObject.allPlayers)
  var showDownObject = await logic.handleShowdown(gameObject.board, gameObject.allPlayersInRound);

  if(showDownObject.winners.length === 1) {
    gameObject.allPlayersInRound.forEach((player) => {
      if(player.name === showDownObject.winners[0].winnername) {
        player.bank = player.bank + gameObject.potSize

      }
    })
  }
  if(showDownObject.winners.length > 1) {
    var chopCount = showDownObject.winners.length;
    var chop = Math.floor(gameObject.potSize / showDownObject.winners.length);
    showDownObject.winners.forEach((winningPlayer) => {
      gameObject.allPlayersInRound.forEach((player) => {
        if(player.name === winningPlayer.name) {
          if(chopCount === 1) {
            player.bank = player.bank + chop + 1
          } else {
            player.bank = player.bank + chop
            chopCount--
          }
        }
      })
    })
  }

  gameObject.allPlayersInRound.forEach((gamedata) => {
    gameObject.allPlayers.forEach((metadata) => {
      if(gamedata.name === metadata.name) {
        metadata.bank = gamedata.bank;
      }
    })
  })
  controllers.updateBanks(gameObject.allPlayers);
  console.log('afterCash', gameObject.allPlayers)
  io.emit('winner', showDownObject.winners)
  firstRound = false;
  console.log('resolve showdown',firstRound)
  setTimeout(() => {
  newRound();
  io.emit('gameObject', gameObject)
}, 5000)
}



io.on('connection', function(socket) {
  //when a user connects
  socket.on('grabData', function() {
    socket.emit('gameObject', gameObject)
  })
  //when a user tries to join a table
  socket.on('joinTable', function(playerInfo) {

    var currentPlayer = {
      id: socket.id,
      name: playerInfo.name,
      bank: playerInfo.bank,
      hole: [],
      dealerButton: false,
      bet: 0,
      allIn: false,
      winner: false
    }
    if(gameObject.allPlayers.length <= 9) {
      gameObject.allPlayers.push(currentPlayer)
      socket.emit('joinSuccessful')
      io.emit('gameObject', gameObject)
      return;
    }
    if(gameObject.allPlayers.length === 9) {
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
      for(let i = 0; i < gameObject.allPlayersInRound.length; i++) {
        if(gameObject.allPlayersInRound[i].name === actionObject.name) {
          console.log(gameObject.allPlayersInRound[i].name)
          console.log(actionObject.name)
          gameObject.allPlayersInRound.splice(i,1)
          gameObject.counter--


        }
      }
      io.emit('gameObject', gameObject)
    }

    if(actionObject.action === 'bet') {
      if(actionObject.betnumber < gameObject.activeBet) {
        socket.emit('failedBet')
        return;
      }
      turnAllPlayersFalse();
      io.emit('bet', actionObject.betnumber)
      var activeAllIn = false;
      var allInAmount;
      gameObject.allPlayersInRound.forEach((singlePlayer) => {
        if(singlePlayer.name === actionObject.name) {
          if(singlePlayer.bank <= actionObject.betnumber) {
            singlePlayer.bet = singlePlayer.bank;
            allInAmount = singlePlayer.bank;
            singlePlayer.bank = 0;
            activeAllIn = true;
            singlePlayer.allIn = true;
          } else {
            singlePlayer.bank = singlePlayer.bank - actionObject.betnumber;
            singlePlayer.bet = actionObject.bet;
          }

        }
      })

      if(activeAllIn) {
        gameObject.activeBet= allInAmount;
        gameObject.potSize += allInAmount;
        io.emit('gameObject', gameObject)
      } else {
        gameObject.activeBet= actionObject.betnumber
        gameObject.potSize += actionObject.betnumber
        io.emit('gameObject', gameObject)
      }



    }

    if(actionObject.action === 'call') {
      gameObject.allPlayersInRound.forEach((singlePlayer) => {
        if(singlePlayer.name === actionObject.name) {
          var amountCalled = gameObject.activeBet - singlePlayer.bet
          singlePlayer.bank = singlePlayer.bank - amountCalled;
          gameObject.potSize += amountCalled;
          singlePlayer.bet = gameObject.activeBet
        }
      })

      io.emit('gameObject', gameObject)


    }

    //If theres no one left in the round
    if(gameObject.allPlayersInRound.length < 2) {
      var roundEndObject = {
        name: gameObject.allPlayersInRound[0].name,
        potSize: gameObject.potSize
      }
      gameObject.allPlayers.forEach((player) => {
        if(player.name === gameObject.allPlayersInRound[0].name) {
          player.bank = player.bank + gameObject.potSize
        }
      })

      controllers.updateBanks(gameObject.allPlayers);
      io.emit('bet', 0);
      gameObject.potSize = 0;
      gameObject.activeBet = 0;
      io.emit('gameObject', gameObject);
      gameObject.allPlayersInRound[0].winner = true;
      io.emit('winner', gameObject.allPlayersInRound[0].name);
      setTimeout(() => {
        newRound();
      }, 5000)

    } else {
      for(let i = 0; i < gameObject.allPlayersInRound.length; i++) {
        if(gameObject.allPlayersInRound[i].name === actionObject.name) {
          gameObject.allPlayersInRound[i].acted = true;
        }

      }
      //check to see if all the players have finished acting
      gameObject.allPlayersActed = true;
      for(let i = 0; i < gameObject.allPlayersInRound.length; i++) {
        if(gameObject.allPlayersInRound[i].acted === false) {
          gameObject.allPlayersActed = false;
        }
      }
      //move forward the betting rounds

      if(gameObject.allPlayersActed) {
        //iterate through and take away any active bets

        if(!gameObject.flop) {
          gameObject.deck.pop();
          for(let card = 0; card < 3; card++) {
            gameObject.board.push(gameObject.deck.pop());
          }
          gameObject.flop = true;
          newBettingRound();
        }else if (!gameObject.turn) {
          gameObject.deck.pop();
          gameObject.board.push(gameObject.deck.pop());
          gameObject.turn = true;
          newBettingRound();

        } else if (!gameObject.river) {
          gameObject.deck.pop();
          gameObject.board.push(gameObject.deck.pop());
          gameObject.river = true;
          newBettingRound();
        } else {
          resolveShowdown();
        }
      } else {
        //start the next gameObject.turn
        gameObject.counter++

        if(gameObject.counter > gameObject.allPlayersInRound.length - 1) {
          gameObject.counter = 0
        }
        while(gameObject.allPlayersInRound[gameObject.counter].allIn) {
          gameObject.counter++
          if(gameObject.counter > gameObject.allPlayersInRound.length - 1) {
            gameObject.counter = 0
          }
        }
        let playerTurn = gameObject.allPlayersInRound[gameObject.counter].name
        io.emit('trackTurns', playerTurn)
      }

    }
    //set the player who just acted to true






  })
  // Disconnect listener
  socket.on('disconnect', function() {

    for(var i = 0; i < gameObject.allPlayers.length; i++) {
      if(socket.id === gameObject.allPlayers[i].id) {

        gameObject.allPlayers.splice(i,1);
        gameObject.allPlayersInRound.splice(i,1);
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


const PORT = process.env.PORT || 3003;


server.listen(PORT);
console.log(`Server listening at http://localhost:${PORT}`);