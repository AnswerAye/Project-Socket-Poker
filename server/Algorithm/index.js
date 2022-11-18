const axios = require('axios');

var buildDeck = () => {
  let deck = Array.from(new Array(52), (_, index) => index);
  let count = 52 + 1;
  while ((count -= 1)) {
    deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
  }
  return deck;
};

var unMatrixCards = (hand) => {
  const values = "23456789TJQKA";
  const suits = [`C`, `D`, `H`, `S`];

  console.log(hand)
  return hand.reduce((obj, item) => {
    obj.push(
      `${values[item % 13]}${
        suits[Math.floor(item / 13)]
      }`
    );
    return obj;
  }, [])
    .join(",");
}

var handleShowdown = (board, playerArray) => {
  var stringedBoard = unMatrixCards(board).toString();

  console.log('playerArray',playerArray)


  var stringedHands = [];

  playerArray.forEach((player) => {
    let copy = player
    stringedHands.push({...player, hole: unMatrixCards(player.hole).toString()})
  })


  console.log('board',stringedBoard)
  console.log('hands',stringedHands)

  var url = 'https://api.pokerapi.dev/v1/winner/texas_holdem?cc='


  var urlwithBoard = url + stringedBoard.replace('T','10');

  stringedHands.forEach((player) => {
    urlwithBoard = urlwithBoard + '&pc[]=' + player.hole.replace('T','10')
  })

  console.log(urlwithBoard)
  return axios.get(urlwithBoard)
    .then((request) => {
      for(let i = 0; i < request.data.winners.length; i++){
        stringedHands.forEach((player) => {
          if(request.data.winners[i].cards === player.hole.replace('T','10')) {
            console.log('entered here')
            request.data.winners[i].winnername = player.name
          }
        })
      }

      return request.data
    })
    .catch((err) => {
      console.log(err)
    })
}



exports.unMatrixCards = unMatrixCards;
exports.buildDeck = buildDeck;
exports.handleShowdown = handleShowdown;