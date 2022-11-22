import React, { useState, useEffect } from 'react';

import cardArray from './images/index.js'

import './IndPlayer.css'





export default function IndPlayer({name,bank, turnTracker, user,hole, unMatrixCards, inHand, currentPlayersinHand, dealerButton, bottomRow}) {

  var playersCardArray = [];

  var updatedPlayerBank;

  var bet = 0;
  var playerBank = 0;


  currentPlayersinHand.forEach((player) => {
    if(player.name === name) {
      updatedPlayerBank = player.bank
      bet = player.bet
    }
  })


  hole.forEach((card) => {
    playersCardArray.push(`./images/${card}.png`)
  })



  console.log('dealerButton', dealerButton)

  var easyDisplay = unMatrixCards(hole);

  console.log(playersCardArray)

  if(bottomRow) {
    console.log('entered here')
    if(!inHand) {
      return (
      <div className="foldedPlayerContainer">
        {bet > 0 ? <div className="activeBet">{bet}</div> : null}
        {dealerButton ? <div className="dealerButton">
          <div className="dealerText">DEALER</div>
        </div> : null}

        <div className="FoldedIndPlayer">

          {user !== name && hole.length > 0 ? <div className="photoContainer">
              <img className="playerCard" src={cardArray[52]}></img>
              <img className="playerCard"src={cardArray[52]}></img>
            </div> : null }
          {user === name && hole.length > 0 ? <div className="photoContainer">
            <img className="playerCard" src={cardArray[hole[0]]}></img>
            <img className="playerCard"src={cardArray[hole[1]]}></img>
          </div> : null}
          <div className="bankSize">{updatedPlayerBank}</div>
          {user === name ? <div className="foldedCurrentPlayer">{name}</div> : <div className="foldedPlayer">{name}</div>}



        </div>


      </div>

      )
    }

    return (
      <div className="playerContainer">
        {bet > 0 ? <div className="activeBet">{bet}</div> : null}
        {dealerButton ? <div className="dealerButton">
          <div className="dealerText">DEALER</div>
        </div> : null}

        {!turnTracker ? <div className="IndPlayer">
          {user !== name && hole.length > 0 ? <div className="photoContainer">
            <img className="playerCardBack" src={cardArray[52]}></img>
            <img className="playerCardBack"src={cardArray[52]}></img>
          </div> : null }
          {user === name && hole.length > 0 ? <div className="photoContainer">
            <img className="playerCard" src={cardArray[hole[0]]}></img>
            <img className="playerCard"src={cardArray[hole[1]]}></img>
          </div> : null}
          <div className="bankSize">{updatedPlayerBank}</div>
          {user === name ? <div className="currentPlayer">{name}</div> : <div className="player">{name}</div>}





        </div> : <div className="IndPlayerOnTurn">
          {user === name && hole.length > 0 ? <div className="photoContainer">
            <img className="playerCard" src={cardArray[hole[0]]}></img>
            <img className="playerCard"src={cardArray[hole[1]]}></img>
          </div> : null}
          {user !== name && hole.length > 0 ? <div className="photoContainer">
            <img className="playerCardBack" src={cardArray[52]}></img>
            <img className="playerCardBack"src={cardArray[52]}></img>
          </div> : null }
          <div className="bankSize">{updatedPlayerBank}</div>
          {user === name ? <div className="currentPlayer">{name}</div> : <div className="player">{name}</div>}

        </div>}




      </div>
    )
  }

  if(!inHand) {
    return (
    <div className="foldedPlayerContainer">
      <div className="FoldedIndPlayer">
        {user === name ? <div className="currentPlayer">{name}</div> : <div className="player">{name}</div>}
        <div className="bankSize">{updatedPlayerBank}</div>
        {user === name && hole.length > 0 ? <div className="photoContainer">
          <img className="playerCard" src={cardArray[hole[0]]}></img>
          <img className="playerCard"src={cardArray[hole[1]]}></img>
        </div> : null}
        {user !== name && hole.length > 0 ? <div className="photoContainer">
          <img className="playerCard" src={cardArray[52]}></img>
          <img className="playerCard"src={cardArray[52]}></img>
        </div> : null }

      </div>
      {bet > 0 ? <div className="activeBet">{bet}</div> : null}
      {dealerButton ? <div className="dealerButton">
        <div className="dealerText">DEALER</div>
      </div> : null}
    </div>

    )
  }

  return (
    <div className="playerContainer">
      {!turnTracker? <div className="IndPlayer">
        {user === name ? <div className="currentPlayer">{name}</div> : <div className="player">{name}</div>}
        <div className="bankSize">{updatedPlayerBank}</div>
        {user === name && hole.length > 0 ? <div className="photoContainer">
          <img className="playerCard" src={cardArray[hole[0]]}></img>
          <img className="playerCard"src={cardArray[hole[1]]}></img>
        </div> : null}
        {user !== name && hole.length > 0 ? <div className="photoContainer">
          <img className="playerCardBack" src={cardArray[52]}></img>
          <img className="playerCardBack"src={cardArray[52]}></img>
        </div> : null }


      </div> : <div className="IndPlayerOnTurn">
        {user === name ? <div className="currentPlayer">{name}</div> : <div className="player">{name}</div>}
        <div className="bankSize">{updatedPlayerBank}</div>
        {user === name && hole.length > 0 ? <div className="photoContainer">
          <img className="playerCard" src={cardArray[hole[0]]}></img>
          <img className="playerCard"src={cardArray[hole[1]]}></img>
        </div> : null}
        {user !== name && hole.length > 0 ? <div className="photoContainer">
          <img className="playerCardBack" src={cardArray[52]}></img>
          <img className="playerCardBack"src={cardArray[52]}></img>
        </div> : null }

      </div>}

      {dealerButton ? <div className="dealerButton">
        <div className="dealerText">DEALER</div>
      </div> : null}
      {bet > 0 ? <div className="activeBet">{bet}</div> : null}

    </div>
  )
}