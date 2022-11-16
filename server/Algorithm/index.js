const NUM_CARDS_IN_DECK = 52;
const NUM_VALUES_IN_DECK = 13;
const NUM_SUITS_IN_DECK = 4;
const NUM_CARDS_IN_HAND = 5;
const ACE_VALUE = Math.pow(2, 13);
const STRAIGHT_LOW_ACE_INDICATOR = parseInt("10000000011110", 2);
const TEN_CARD_POSITION = 8;
const RANK_BASE_VALUE = Math.pow(10, 9);


module.exports.buildDeck = () => {
  let deck = Array.from(new Array(NUM_CARDS_IN_DECK), (_, index) => index);
  let count = NUM_CARDS_IN_DECK + 1;
  while ((count -= 1)) {
    deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
  }
  return deck;
};