import React, { useState, useEffect } from 'react';
const { io } = require("socket.io-client");
import SplashModal from './Modal/SplashModal.jsx';
import Table from './Table/Table.jsx';
import useModal from '../subcomponents/ModalHook.jsx';


const socket = io();

socket.on("connect", () => {
console.log(socket.id)
})






export default function App() {


  const [loggedIn, setLogIn] = useState(false);
  const {isShowing, toggle} = useModal();
  const [bank, setBank] = useState(0);
  const [user, setUser] = useState('Log In!');
  const [currentPlayers, setPlayers] = useState([]);
  const [onATable, setTable] = useState(false);
  const [tableFull, setTablePop] = useState(false);
  const [currentTurn, setTurn] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [hole, setHole] = useState([]);
  const [board, setBoard] = useState([]);


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

    var actionObject = {
      name: user,
      action: e.target.name
    }
    socket.emit('playerAction', actionObject)
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
          {currentPlayers.length >= 2 && !gameStarted ? <button onClick={sendStartGame}>Start The Game!</button> : null}
          {gameStarted ? null : <span>Waiting for {4 - currentPlayers.length}</span>}
        </div>
      </div>
      <div id="table">
        <Table
          currentPlayers={currentPlayers}
          currentTurn={currentTurn}
          hole={hole}
          user={user}
          unMatrixCards={unMatrixCards}
          board={board}
        />
      </div>
      <div id="userinteraction">
        {currentTurn === user ? <button name="check" onClick={handlePlayerAction}>Check</button> : null}

      </div>
  </div>)
}