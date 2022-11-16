import React, { useState, useEffect } from 'react';

import IndPlayer from './IndPlayer/IndPlayer.jsx';


export default function Table(props) {





  return (
    <div>
      {props.currentPlayers.map((indPlayer) => {
        <IndPlayer
          name={indPlayer.name}
          bank={indPlayer.bank}
        />
      })}
    </div>
  )
}