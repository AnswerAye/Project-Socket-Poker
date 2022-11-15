const NUM_CARDS_IN_DECK = 52;
const NUM_VALUES_IN_DECK = 13;
const NUM_SUITS_IN_DECK = 4;
const NUM_CARDS_IN_HAND = 5;
const ACE_VALUE = Math.pow(2, 13);
const STRAIGHT_LOW_ACE_INDICATOR = parseInt("10000000011110", 2);
const TEN_CARD_POSITION = 8;
const RANK_BASE_VALUE = Math.pow(10, 9);


const buildDeck = () => {
  let deck = Array.from(new Array(NUM_CARDS_IN_DECK), (_, index) => index);
  let count = NUM_CARDS_IN_DECK + 1;
  while ((count -= 1)) {
    deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
  }
  return deck;
};

const compareHands = (hands) => {
  return hands
    .map((hand) => rankHand(hand))
    .sort((handA, handB) => handB.rankValue - handA.rankValue);
};

const resolveShowdown = (hand1, hand2, currentBoard) => {
  //I: Two arrays, both containing two values denoting the suit first and the card value second, as well as the current board cards
  //O: a string indicating which hand is the winner
  //C:What if both hands have the same rank? Deal with Straights, Straight Flushes, Flushes, Pairs, Trips, Full Houses, and High Cards
  //E:


  //Store the value of the first hand using our helper function
  var firstHand = compareHands(hand1, currentBoard)
  //Store the value of the second hand using our helper function
  var secondHand = compareHands(hand2, currentBoard)
  //Compare the numbers to each other

  //if either is a royal flush
  //if they are both straights
  //if they are both straight flushes
  //if they are both flushes
  //if they are both pairs
  //if they are both trips
  //if they are both full houses
  //if they are both four of a kind
  //if they are both high card
  //if they are both two pair


  //return which hand won, if there is a chop return that




}