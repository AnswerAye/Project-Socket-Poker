import React, { useState, useEffect } from 'react';
const { io } = require("socket.io-client");


const socket = io();

socket.on("connect", () => {
console.log(socket.id)
})




export default function App() {


  return (<div>Hello World</div>)
}