const Player = require('../db/models/Players.js');



exports.logInUser = (req, res) => {


  Player.findOne({'name': req.body.name}, 'name password currentBank', function(err, player) {
    if(err) {
      console.log('failed to retrieve', err);
    }
    var playerObject = player;


    if (req.body.password === player.password) {
      playerObject.loggedIn = true;
      res.send(playerObject);
    } else {
      playerObject.loggedIn = false;
      res.send(playerObject);
    }
  })

}



exports.signUpUser = (req, res) => {

  var createUser = req.body



  createUser.currentBank = 500;

  console.log(createUser);
  Player.create(createUser, function (err, complete) {
    if (err) {
      console.log('failed to create')
      console.log(err)
      res.send('failed to create')
      return;

    }


    res.send('Successfully created!');
  })
}