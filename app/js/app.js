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