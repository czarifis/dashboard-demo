var app = angular.module('myApp', ['angular.filter',"highcharts-ng", 'uiGmapgoogle-maps']);


// --- Handler code ------------------------------------------------------------
app.controller('refresh-user-data', function($scope, $http, $interval) {
  // change a user's location every 100 ms.
  $interval(function() {
    var user = $scope.users[Math.floor($scope.users.length * Math.random())];
    user.loc.latitude = (Math.random() - 0.5) * 100;
    user.loc.longitude = (Math.random() - 0.5) * 100;
  }, 3000);
});
// --- End Handler code --------------------------------------------------------


