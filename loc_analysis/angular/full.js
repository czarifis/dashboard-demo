var app = angular.module('myApp', ['angular.filter',"highcharts-ng", 'uiGmapgoogle-maps']);

var COUNTRIES = ['USA', 'Mexico', 'Canada'];


// --- Handler code ------------------------------------------------------------
app.controller('refresh-user-data', function($scope, $http, $interval) {
  $scope.countries = COUNTRIES;
  configureCountryShowHideFunctions($scope);

  $scope.users = [];
  // generate 100 initial users
  for (var i = 0; i < 1000; i++) {
    generateNewUser($scope.users);
  }

  configureVisitorMeter($scope);
  configurePageviewGraph($scope);

  $scope.map = {
    zoom: 3,
    center: { latitude: 0, longitude: 0 }
  };
});
// --- End Handler code --------------------------------------------------------

// --- Begin Full eval code ----------------------------------------------------
// NOTE: anything that is needed for generating the correct view-model is here.

// Configures the show hide functions for the country table.
function configureCountryShowHideFunctions($scope) {
  $scope.isHidden = {};
  // all rows are initially hidden
  for (var i = 0; i < COUNTRIES.length; i++) {
    $scope.isHidden[COUNTRIES[i]] = true;
  }

  $scope.toggleHidden = function(country) {
    $scope.isHidden[country] = !$scope.isHidden[country];
  }
}

function configurePageviewGraph($scope) {
  $scope.pageviewGraphConfig = {
    chart:{
      type: 'line',
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false
        }
      }
    },
    title: {
      text: 'Pageviews'
    },
    subtitle: {
      text: 'per minute'
    },
		xAxis: {
				type: 'datetime',
				minTickInterval : 1000,
		},
    series: [{
      data:
      (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -10; i <= 0; i += 1) {
                data.push([
                    time + i * 1000,
                    Math.round(Math.random() * 100)
                ]);
            }
            return data;
        }())
		}]
  };
}
function configureVisitorMeter($scope) {
  var hiddenAxisOptions = {
    gridLineWidth: 0,
    minorGridLineWidth: 0,
    lineColor: 'transparent',
    labels: {
      enabled: false
    },
    minorTickLength: 0,
    tickLength: 0,
    title: {
      text: null
    }
  };
  // sum the total count of visitors from each country
  var num_of_visitors = {};
  for (var i = 0; i < COUNTRIES.length; i++) {
    num_of_visitors[COUNTRIES[i]] = 0;
  }
  for (var i = 0; i < $scope.users.length; i++) {
    num_of_visitors[$scope.users[i].country] += 1;
  }
  $scope.visitorMeterSeries = [];
  for (var i = 0; i < COUNTRIES.length; i++) {
    $scope.visitorMeterSeries.push({
      name: COUNTRIES[i],
      data: [num_of_visitors[COUNTRIES[i]]]
    });
  }
  $scope.visitorMeterConfig = {
			chart: {
					type: 'bar',
          height: 100,
          marginTop: 0,
          marginBottom: 20,
          marginLeft: 10,
          marginRight: 10,
			},
      title:{
        text: null
      },
      yAxis: hiddenAxisOptions,
      xAxis: hiddenAxisOptions,
			plotOptions: {
					series: {
              pointWidth:40,
							stacking: 'percent',
              animation: false,
              dataLabels: {
                enabled: true,
                style:{
                  fontSize: 12,
                },
                formatter: function() {
                  return this.percentage.toFixed(2) + '%';
                }
              }
					}
			},
      series: $scope.visitorMeterSeries
  };
}

// --- End Full Eval code ------------------------------------------------------


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

