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


  // change a user's location every 100 ms.
  $interval(function() {
    var user = $scope.users[Math.floor($scope.users.length * Math.random())];
    user.loc.latitude = (Math.random() - 0.5) * 100;
    user.loc.longitude = (Math.random() - 0.5) * 100;
  }, 3000);

  // append a new data point to a user's graph
  $interval(function() {
    // For performance testing purposes, just push a constant to the first user.
    $scope.users[0].graph_config.series[0].data.push(10);
  }, 3000);

});
// --- End Handler code --------------------------------------------------------



// --- Extra filters needed ----------------------------------------------------
prev = null;
app.filter('toSortableArray', function() {
    return _.memoize(function(obj) {
        var arr = [];
        for (var k in obj) {
            arr.push({id: k, val: obj[k]});
        }
        if (angular.equals(prev, arr)) {
            return prev;
        }
        prev = arr;
        return arr;
    }
)});
// --- End Extra filters needed ------------------------------------------------


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

