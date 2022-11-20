import React, { useState, useEffect } from 'react';

import IndPlayer from './IndPlayer/IndPlayer.jsx';


export default function Table({currentPlayers, currentTurn, hole, user, unMatrixCards,board, currentPlayersinHand, pot}) {

  var easyBoard;
  if(board.length > 0) {
    easyBoard = unMatrixCards(board);
  }

  return (
    <div>
      {board.length > 0 ? <div>{easyBoard}</div> : null}
      {pot > 0 ? <div>{pot}</div> : null}
      {currentPlayers.map((indPlayer) => {
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
          currentPlayersinHand={currentPlayersinHand}
          />
      })}
    </div>
  )
}