var app = angular.module('myApp', ['angular.filter',"highcharts-ng", 'uiGmapgoogle-maps']);


// --- Handler code ------------------------------------------------------------
app.controller('refresh-user-data', function($scope, $http, $interval) {
  // generate a new user every second
  $interval(function() {
    var user = generateNewUser($scope.users);
    // Highcharts directives have to be updated as well since their variables aren't bound.
    updateVisitorMeterConfig($scope, user);
    updatePageviewGraph($scope);
  }, 3000);
});
// --- End Handler code --------------------------------------------------------


// --- Partial eval code, strictly used for partial eval -----------------------

function updateVisitorMeterConfig($scope, user) {
  for (var i = 0; i < $scope.visitorMeterSeries.length; i++) {
    if ($scope.visitorMeterSeries[i].name == user.country) {
      // The below code for directly setting the series forces an unnecessary redraw (by the highcharts-ng library)
      $scope.visitorMeterSeries[i].data[0] += 1;
    }
  }
}

function updatePageviewGraph($scope) {
  // Directly setting the config variable forces a redraw.
  $scope.pageviewGraphConfig.series[0].data.push([new Date().getTime(), $scope.users.length]);
}

// --- End partial eval code ---------------------------------------------------

