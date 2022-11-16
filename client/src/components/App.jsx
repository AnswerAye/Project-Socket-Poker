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
  const [tableFull, setTablePop] = useState(false)
  const [startGame, setStartGame] = useState(false);


  var joinTable = () => {
    var playerInfo = {
      name: user,
      bank: bank
    }

    socket.emit('joinTable', playerInfo)
    socket.emit('grabPlayers');

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
          {startGame ? <button onClick={sendStartGame}></button> : <span>Waiting for {4 - currentPlayers.length}</span>}
        </div>
      </div>
      <div id="table">
        <Table
          currentPlayers={currentPlayers}

        />

      </div>
      <div id="userinteraction">

      </div>
  </div>)
}