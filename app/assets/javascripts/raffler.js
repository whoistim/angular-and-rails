var rafflerApp = angular.module("raffler", ["rails"]);

rafflerApp.factory("Player", function(railsResourceFactory){
  var resource = railsResourceFactory({
    url: '/players',
    name: 'player'});
  return resource;
});


//require player?

rafflerApp.controller("RaffleController", ["$scope", "Player", function ($scope, Player){

  Player.query().then(function (results){
    $scope.players = results;
  });
  $scope.addPlayer = function(){
    console.log($scope.newName);
    var newPlayer = new Player({
      name: $scope.newName,
      rating: 8,
      winner: false
    });
    newPlayer.create().then(function(newPlayerInRails){
      $scope.players.push(newPlayerInRails);
      $scope.newName = "";
      console.log("This came back from rails captain: "+newPlayerInRails);
    });
  };

  function getRandomBaby(max) {
    return Math.random() * (max);
  }

function getLosers (players){
  var losers = [];
players.forEach(function(player){
if(!player.winner){
  losers.push(player);
}
});
  return losers;
}

  $scope.reRaffle = function (){
    Player.get().then(function(players){
      players.forEach(function(player){
        player.winner = false;
        player.update();
      });
    $scope.players = players;
    });
  };

  $scope.runRaffle = function (){
    Player.get({winner: false}).then(function(players){
      players = getLosers(players);
      len = players.length;
      if(len === 0){
        return;
      }

      rafMan = Math.floor(getRandomBaby(len));
      winner = players[rafMan];
      winner.winner = true;
      winner.update().then(function(){
          Player.query().then(function (results){
            $scope.players = results;
          });
      });

    });
  };

}]);