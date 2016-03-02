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

/*
    $scope.songSelect = function(songPath) {
    	$scope.selectedSongPath = songPath;
	}
	//var audio = document.getElementById("mainAudio");*/
/*
	$scope.playing = false;
	$scope.playlist = [];
	$scope.play = function(){
		if($scope.playing == false){
			var audio = document.getElementById("mainAudio");
			audio.play();
			$scope.playing= true;
		}
	}
	$scope.pause = function(){
		if ($scope.playing == true){
			var audio = document.getElementById("mainAudio");
			audio.pause();
			$scope.playing = false;
		}
	}
*/
});

  skytunes.factory('player', function(audio, $rootScope) {
    var player,
        playlist = [],
        paused = false,
        current = {
          album: 0,
          track: 0
        };

    player = {
      playlist: playlist,

      current: current,

      playing: false,

      play: function(track, album) {
        if (!playlist.length) return;

        if (angular.isDefined(track)) current.track = track;
        if (angular.isDefined(album)) current.album = album;

        if (!paused) audio.src = playlist[current.album].tracks[current.track].url;
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
        if (playlist[current.album].tracks.length > (current.track + 1)) {
          current.track++;
        } else {
          current.track = 0;
          current.album = (current.album + 1) % playlist.length;
        }
        if (player.playing) player.play();
      },

      previous: function() {
        if (!playlist.length) return;
        paused = false;
        if (current.track > 0) {
          current.track--;
        } else {
          current.album = (current.album - 1 + playlist.length) % playlist.length;
          current.track = playlist[current.album].tracks.length - 1;
        }
        if (player.playing) player.play();
      }
    };

    playlist.add = function(album) {
      if (playlist.indexOf(album) != -1) return;
      playlist.push(album);
    };

    playlist.remove = function(album) {
      var index = playlist.indexOf(album);
      if (index == current.album) player.reset();
      playlist.splice(index, 1);
    };

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

/*
skytunes.controller('SidebarController', function($scope) {

    $scope.state = false;

    $scope.toggleState = function() {
        $scope.state = !$scope.state;
    };

});

skytunes.directive('sidebarDirective', function() {
    return {
        link : function(scope, element, attr) {
            scope.$watch(attr.sidebarDirective, function(newVal) {
                  if(newVal)
                  {
                    element.addClass('show');
                    return;
                  }
                  element.removeClass('show');
            });
        }
    };
});
*/
