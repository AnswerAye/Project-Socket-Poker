import React, { useState, useEffect } from 'react';
const { io } = require("socket.io-client");
import SplashModal from './Modal/SplashModal.jsx';
import Table from './Table/Table.jsx';
import useModal from '../subcomponents/ModalHook.jsx';
import './App.css'


const socket = io();

socket.on("connect", () => {
console.log(socket.id)
})



const initialValues = {
  betnumber: ""
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}



export default function App() {


  const [loggedIn, setLogIn] = useState(false);
  const {isShowing, toggle} = useModal();
  const [bank, setBank] = useState(0);
  const [user, setUser] = useState('Log In!');
  const [currentPlayers, setPlayers] = useState([]);
  const [currentPlayersinHand, setPlayersinHand] = useState([]);
  const [onATable, setTable] = useState(false);
  const [tableFull, setTablePop] = useState(false);
  const [currentTurn, setTurn] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [hole, setHole] = useState([]);
  const [board, setBoard] = useState([]);
  const [currentInput, setInput] = useState(initialValues)
  const [activeBet, setBet] = useState(0);
  const [pot, setPot] = useState(0);



  var joinTable = () => {
    var playerInfo = {
      name: user,
      bank: bank
    }

    socket.emit('joinTable', playerInfo)
    socket.emit('grabPlayers');

  }

  var sendStartGame = () => {
    socket.emit('roundStart')
  }

  var handlePlayerAction = (e) => {

    const {name} = e.target;

    if(currentInput.betnumber > bank) {
      alert('Please bet an amount within your bank')
      setInput(initialValues)
      return;
    }
    var numberBetNumber = Number(currentInput.betnumber)
    var actionObject = {
      name: user,
      action: name,
      betnumber: numberBetNumber
    }
    socket.emit('playerAction', actionObject)



    if(name === 'bet') {
      setInput(initialValues)
    }


  }

  var handleInputChange = (e) => {
    const {name, value} = e.target;

    if(name === 'betnumber') {
      if(value === "") {
        setInput({
          ...currentInput,
          [name]: value
        })
      }
      if(!isNumeric(value)) {
        return;
      }
    }

    setInput({
      ...currentInput,
      [name]: value
    })
  }

  const unMatrixCards = (hand) => {
    const values = "23456789TJQKA";
    const suits = [`♣︎`, `♦︎`, `♥︎`, `♠︎`];


    return hand.reduce((obj, item) => {
      obj.push(
        `${values[item % 13]}${
          suits[Math.floor(item / 13)]
        }`
      );
      return obj;
    }, [])
      .join(" ");
  }


  socket.on('gameObject', (gameObject) => {

    console.log(gameObject)

    setPlayers(gameObject.allPlayers)
    setPlayersinHand(gameObject.allPlayersInRound)
    setBoard(gameObject.board)
    setPot(gameObject.potSize);

    if(currentPlayers.length === 9) {
      setTablePop(true);
    }
  })

  socket.on('joinSuccessful', () => {
    setTable(true)
  })



  socket.on('trackTurns', (player) => {
    setGameStarted(true);
    setTurn(player);
  })

  socket.on('giveCards', (cards) => {
    setHole(cards);
  })

  socket.on('bet', (bet) => {
    setBet(bet);
  })

  socket.on('bettingRoundOver', () => {
    setBet(0);
  })
  socket.on('failedBet', () => {
    console.log('Please make a bet above the minimum bet size')
  })






  useEffect(() => {
    socket.emit('grabData');
    if(!loggedIn) {
      toggle();
    }



  }, [])
  return (<div className="canvas">
     <SplashModal
        isShowing={isShowing}
        hide={toggle}
        setBank={setBank}
        setUser={setUser}
      />
      <div id="navbar">
        {gameStarted ? null : <div className="buttonDiv">
          {onATable && !tableFull ? null : <button className="joinTableButton"onClick={joinTable}>Join Table</button>}
          {currentPlayers.length >= 4 && !gameStarted && onATable ? <button className="startGameButton" onClick={sendStartGame}>Start The Game!</button> : null}
        </div>}

      </div>
      <div id="table">

        {gameStarted ? <Table
            currentPlayers={currentPlayers}
            currentPlayersinHand={currentPlayersinHand}
            currentTurn={currentTurn}
            hole={hole}
            user={user}
            unMatrixCards={unMatrixCards}
            board={board}
            pot={pot}
          /> : <div>Waiting for {4 - currentPlayers.length}</div>}

      </div>
      <div id="userinteraction">
        {currentTurn === user && activeBet === 0? <button name="check" onClick={handlePlayerAction}>Check</button> : null}
        {currentTurn === user && activeBet > 0 ? <button name="call" onClick={handlePlayerAction}>Call</button> : null}
        {currentTurn === user ? <button name="fold" onClick={handlePlayerAction}>Fold</button> : null}
        {currentTurn === user ? <input name="betnumber" value={currentInput.betnumber} onChange={handleInputChange}></input> : null}
        {currentTurn === user ? <button name="bet" onClick={handlePlayerAction}>Bet</button> : null}


      </div>
  </div>)
}