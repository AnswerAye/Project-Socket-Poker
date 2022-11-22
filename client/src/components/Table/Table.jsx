import React, { useState, useEffect } from 'react';

import IndPlayer from './IndPlayer/IndPlayer.jsx';

import cardArray from './IndPlayer/images/index.js'

import './Table.css';


export default function Table({currentPlayers, currentTurn, hole, user, unMatrixCards,board, currentPlayersinHand, pot}) {

  var easyBoard;
  if(board.length > 0) {
    easyBoard = unMatrixCards(board);
  }
  var firstSection = currentPlayers.slice(0,5);
  if(currentPlayers.length > 5) {

    var secondSection = currentPlayers.slice(5);
  }

  return (
    <div className="table">

      <div className="firstSection">
       {firstSection.map((indPlayer) => {
        var turnTracker = indPlayer.name === currentTurn
        var inHand = false;
        if(currentPlayersinHand.length > 0) {
          for(let i = 0; i < currentPlayersinHand.length; i++) {
            if(indPlayer.name === currentPlayersinHand[i].name) {
              inHand = true;
            }
          }

        }
        return <IndPlayer
          key={Math.random()}
          name={indPlayer.name}
          bank={indPlayer.bank}
          turnTracker={turnTracker}
          user={user}
          hole={hole}
          unMatrixCards={unMatrixCards}
          inHand={inHand}
          bottomRow={false}
          dealerButton={indPlayer.dealerButton}
          currentPlayersinHand={currentPlayersinHand}
          />
      })}

      </div>

      {console.log(board)}
      <div className="boardDiv">
        {board[0] ? <img src={cardArray[board[0]]} className="boardCard"></img> : <div className="emptyCard"></div>}
        {board[1] ? <img src={cardArray[board[1]]} className="boardCard"></img> : <div className="emptyCard"></div>}
        {board[2] ? <img src={cardArray[board[2]]} className="boardCard"></img> : <div className="emptyCard"></div>}
        {board[3] ? <img src={cardArray[board[3]]} className="boardCard"></img> : <div className="emptyCard"></div>}
        {board[4] ? <img src={cardArray[board[4]]} className="boardCard"></img> : <div className="emptyCard"></div>}
      </div>
      {pot > 0 ? <div className="pot">{pot}</div> : <div className="pot"></div>}



      {currentPlayers.length > 5 ? <div className="secondSection">
        {secondSection.map((indPlayer) => {
          var turnTracker = indPlayer.name === currentTurn
          var inHand = false;
          if(currentPlayersinHand.length > 0) {
            for(let i = 0; i < currentPlayersinHand.length; i++) {
              if(indPlayer.name === currentPlayersinHand[i].name) {
                inHand = true;
              }
            }

          }
          return <IndPlayer
            key={Math.random()}
            name={indPlayer.name}
            bank={indPlayer.bank}
            turnTracker={turnTracker}
            user={user}
            hole={hole}
            bottomRow={true}
            unMatrixCards={unMatrixCards}
            inHand={inHand}
            dealerButton={indPlayer.dealerButton}
            currentPlayersinHand={currentPlayersinHand}
            />
        })}

      </div> : null}

    </div>
  )
}