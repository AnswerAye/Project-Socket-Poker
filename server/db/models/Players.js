const mongoose = require('mongoose');


const playerSchema = new mongoose.Schema({
  name: String,
  password: String,
  currentBank: Number
})


const Player = mongoose.model('Player', playerSchema);



module.exports = Player;