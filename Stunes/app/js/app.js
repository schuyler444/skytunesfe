var skytunes = angular.module('skytunes', ['ngRoute',]);

skytunes.config(function($routeProvider){
      $routeProvider
          .when('/',{
                templateUrl: 'partials/login.html'
          })

          .when('/userpage',{
                templateUrl: 'partials/userpage.html'
          });
});

var playing = false;

skytunes.controller('skytunesController', function($scope,$http, player) {

    $http.get("artists.json")
    .then(function(response) {
        $scope.artists= response.data;
    });

    $scope.player = player;
   
});

  skytunes.factory('player', function(audio, $rootScope) {
    var player,
        playlist = [],
        paused = false,
        artist = [];
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
      artist.push(artst);
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
