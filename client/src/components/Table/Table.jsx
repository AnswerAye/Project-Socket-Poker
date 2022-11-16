import React, { useState, useEffect } from 'react';

import IndPlayer from './IndPlayer/IndPlayer.jsx';


export default function Table({currentPlayers, currentTurn, hole, user, unMatrixCards}) {




  return (
    <div>
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