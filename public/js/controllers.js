'use strict';

var app = angular.module('APP_NAME');

app.controller('homeCtrl', function($scope) {
});

app.controller('navCtrl', function($scope, $state, auth) {
  $scope.logout = function() {
    auth.logout();
    $state.go('home');
  };
});

app.controller('usersCtrl', function($scope, $state, auth){
  $scope.currentState = $state.current.name.split('.')[1].toUpperCase();
  $scope.submit = function(user) {
    var submitFunc = $scope.currentState === 'LOGIN' ? auth.login : auth.register;
    submitFunc(user).success(function(res){
      $state.go('home');
    }).error(function(res){
      $scope.user = {};
      alert(res.message);
    });
  };
});
