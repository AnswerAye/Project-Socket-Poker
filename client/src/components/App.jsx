import React, { useState, useEffect } from 'react';
const { io } = require("socket.io-client");
import SplashModal from './Modal/SplashModal.jsx';
import useModal from '../subcomponents/ModalHook.jsx';


const socket = io();

socket.on("connect", () => {
console.log(socket.id)
})




export default function App() {


  const [loggedIn, setLogIn] = useState(false);
  const {isShowing, toggle} = useModal();




  useEffect(() => {
    if(!loggedIn) {
      toggle();
    }

  }, [])
  return (<div>
     <SplashModal
          isShowing={isShowing}
          hide={toggle}
      />
  </div>)
}