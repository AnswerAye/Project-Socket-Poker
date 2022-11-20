import React, { useState, useEffect } from 'react';





export default function IndPlayer({name,bank, turnTracker, user,hole, unMatrixCards, inHand, currentPlayersinHand}) {

  var updatedPlayerbank;


  currentPlayersinHand.forEach((player) => {
    if(player.name === name) {
      updatedPlayerbank = player.bank
    }
  })

  var easyDisplay = unMatrixCards(hole);

  return (
    <div>
      {user === name ? <div>YOU</div> : null}
      <div>{name}</div>
      {user === name && hole.length > 0 ? <div>{easyDisplay}</div> : null}
      {updatedPlayerbank ? <div>{updatedPlayerbank}</div> : <div>{bank}</div>}

      {turnTracker ? <div>TURN</div> : null}
      {inHand ? null : <div>FOLDED</div>}

    </div>
  )
}