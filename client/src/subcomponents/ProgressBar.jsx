import {useState} from 'react';


const ProgressBar = (props) => {
  const {bgcolor, completed, characters} = props;






  var fillerStyles = {

    width: `${completed}%`,
    backgroundColor: bgcolor

  }

  if (completed > 100) {
    var fillerStyles = {

      width: '100%',
      backgroundColor: bgcolor

    }

  }




  return (
    <div id="progresscontainer" >
      <div id="progressbar"style={fillerStyles}>
        <span id="progresslabel"></span>
      </div>
    </div>
  )
}

export default ProgressBar;