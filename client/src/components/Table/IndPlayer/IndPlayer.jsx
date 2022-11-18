import React, { useState, useEffect } from 'react';





export default function IndPlayer({name,bank, turnTracker, user,hole, unMatrixCards, inHand}) {



  var easyDisplay = unMatrixCards(hole);

  return (
    <div>
      {user === name ? <div>YOU</div> : null}
      <div>{name}</div>
      {user === name && hole.length > 0 ? <div>{easyDisplay}</div> : null}
      <div>{bank}</div>

      {turnTracker ? <div>TURN</div> : null}
      {inHand ? null : <div>FOLDED</div>}

    </div>
  )
}