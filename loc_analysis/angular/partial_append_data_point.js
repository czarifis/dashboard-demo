var app = angular.module('myApp', ['angular.filter',"highcharts-ng", 'uiGmapgoogle-maps']);


// --- Handler code ------------------------------------------------------------
app.controller('refresh-user-data', function($scope, $http, $interval) {
  // append a new data point to a user's graph
  $interval(function() {
    // For performance testing purposes, just push a constant to the first user.
    $scope.users[0].graph_config.series[0].data.push(10);
  }, 3000);

});
// --- End Handler code --------------------------------------------------------

