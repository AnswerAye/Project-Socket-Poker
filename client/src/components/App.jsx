import React, { useState, useEffect } from 'react';
const { io } = require("socket.io-client");
import SplashModal from './Modal/SplashModal.jsx';
import Table from './Table/Table.jsx';
import useModal from '../subcomponents/ModalHook.jsx';


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

    var actionObject = {
      name: user,
      action: name,
      betnumber: currentInput.betnumber
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


  socket.on('players', (players) => {
    console.log(players)
    setPlayers(players)
    console.log(currentPlayers)
    if(currentPlayers.length === 9) {
      setTablePop(true);
    }
  })
  socket.on('joinSuccessful', () => {
    setTable(true)
  })

  socket.on('boardCards', (boardArray) => {
    setBoard(boardArray)
    console.log(boardArray)
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






  useEffect(() => {
    socket.emit('grabPlayers');
    if(!loggedIn) {
      toggle();
    }



  }, [])
  return (<div>
     <SplashModal
        isShowing={isShowing}
        hide={toggle}
        setBank={setBank}
        setUser={setUser}
      />
      <div id="navbar">
        <div>
          {onATable && !tableFull ? null : <button onClick={joinTable}>Join Table</button>}
        </div>
        <div>
          {currentPlayers.length >= 2 && !gameStarted && onATable ? <button onClick={sendStartGame}>Start The Game!</button> : null}

        </div>
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