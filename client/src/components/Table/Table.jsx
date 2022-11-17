import React, { useState, useEffect } from 'react';

import IndPlayer from './IndPlayer/IndPlayer.jsx';


export default function Table({currentPlayers, currentTurn, hole, user, unMatrixCards,board}) {

  var easyBoard;
  if(board.length > 0) {
    easyBoard = unMatrixCards(board);
  }

  return (
    <div>
      {board.length > 0 ? <div>{easyBoard}</div> : null}
      {currentPlayers.map((indPlayer) => {
        var turnTracker = indPlayer.name === currentTurn
        return <IndPlayer
          key={Math.random()}
          name={indPlayer.name}
          bank={indPlayer.bank}
          turnTracker={turnTracker}
          user={user}
          hole={hole}
          unMatrixCards={unMatrixCards}
          />
      })}
    </div>
  )
}