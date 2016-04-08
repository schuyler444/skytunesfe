var skytunes = angular.module('skytunes', ['ngRoute','ngAnimate']);

skytunes.config(function($routeProvider){
      $routeProvider
          .when('/',{
                templateUrl: 'partials/login.html'
          })

          .when('/userpage',{
                templateUrl: 'partials/userpage.html'
          })

          .when('/friendspage',{
                templateUrl: 'partials/friendspage.html'
          })

          .when('/upload',{
                templateUrl: 'partials/upload.html'
          });
});






skytunes.controller('skytunesController', function($scope,$http, player, $timeout) {

    console.log("Hi");

    $scope.artists=[];

    $timeout(function() {
      $http.get("artists.json")
      .then(function(response) {
          $scope.artists= response.data;
      });
    },250);

    $http.get("friends.json")
      .then(function(response) {
          $scope.friends= response.data;
      });

    $scope.player = player;

    $scope.name = "Your";

    $scope.changeMusic = function(nme){
      $http.get("billartist.json")
      .then(function(response) {
          $scope.artists= response.data;
      });
      $scope.name = nme.name + "'s";
      player.artist.pop();

    };

    $scope.returnMusic = function(){
      $http.get("artists.json")
      .then(function(response) {
          $scope.artists= response.data;
      });
      $scope.name = "Your";
      player.artist.pop();
    };
   
});

  skytunes.factory('player', function(audio, $rootScope, $timeout) {
    var player,
        playlist = [],
        paused = false,
        artist = [];
        show = false;
        current = {
          album: 0,
          track: 0
        };

    player = {
      playlist: playlist,

      artist: artist,

      current: current,

      playing: false,

      play: function() {
        if (!playlist.length) return;

        //if (angular.isDefined(track)) current.track = track;
        //if (angular.isDefined(album)) current.album = album;
        //console.log(playlist[0].albums[current.album]);

        if (!paused) audio.src = playlist[0].albums[current.album].tracks[current.track].url;
        audio.play();
        player.playing = true;
        player.show = true;
        paused = false;
      },

      pause: function() {
        if (player.playing) {
          audio.pause();
          player.playing = false;
          paused = true;
        }
      },

      reset: function() {
        player.pause();
        current.album = 0;
        current.track = 0;
      },

      next: function() {
        if (!playlist.length) return;
        paused = false;
        if (playlist[0].albums[current.album].tracks.length < (current.track + 2)) {
          if (playlist[0].albums.length < (current.album +2) ){
            playlist.pop();
            audio.pause();
            audio.src = "";
            player.playing = false;
            player.show = false;
            paused = true;
          }else {
            current.album++;
            current.track = 0;
          }
        } else {
          current.track++;
        }

        if (player.playing) player.play();

      },

      previous: function() {
        if (!playlist.length) return;
        paused = false;
        if (current.track == 0) {
          if (current.album == 0){
            playlist.pop();
            audio.pause();
            audio.src = "";
            player.playing = false;
            player.show= false;
            paused = true;
          }else{
            current.album--;
            current.track = playlist[0].albums[current.album].length-1;
          }
        } else{
          current.track--;
        }
        if (player.playing) player.play();
      }
    };

    playlist.add = function(artist,album,track) {
      
      current.album = artist.albums.indexOf(album);
      current.track = album.tracks.indexOf(track);
      playlist.pop();
      playlist.push(artist);
      paused = false;
      player.play();
    };

    /*playlist.remove = function(album) {
      var index = playlist.indexOf(album);
      if (index == current.album) player.reset();
      playlist.splice(index, 1);
    };*/

    artist.set = function(artst) {
      artist.pop();
      $timeout(function() {
        artist.push(artst);
      },250);
      
    }

    audio.addEventListener('ended', function() {
      $rootScope.$apply(player.next);
    }, false);

    return player;
  });


  // extract the audio for making the player easier to test
  skytunes.factory('audio', function($document) {
    var audio = $document[0].createElement('audio');
    return audio;
  });
