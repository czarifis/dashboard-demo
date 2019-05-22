var app = angular.module('myApp', ['angular.filter',"highcharts-ng", 'uiGmapgoogle-maps']);



function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}


N = 30;
//var COUNTRIES = ['USA', 'Mexico', 'Canada'];

// --- Code not needed for full or partial eval --------------------------------
var currentID = 0;
//{'name': 'USA2', 'latitude': 40.7127, 'longitude': -74.0059},
var COUNTRIES = [
    {'name': 'England', 'latitude': 50.8002056, 'longitude': -2.2551979},
    {'name': 'France', 'latitude': 47.0633695, 'longitude': -1.2362046},
    {'name': 'Greece', 'latitude': 38.3033603, 'longitude': 21.2663693},
    {'name': 'Turkey', 'latitude': 38.3050379, 'longitude': 33.7374598},
    {'name': 'Siberia', 'latitude': 69.3333, 'longitude': 88.2167},
    {'name': 'China', 'latitude': 35.6176191, 'longitude': 97.7651258},
    {'name': 'Japan', 'latitude': 35.6833, 'longitude': 139.6833},
    {'name': 'India', 'latitude': 18.9750, 'longitude': 72.8258},
    {'name': 'USA', 'latitude': 35.8928646, 'longitude': -112.1970854},
    {'name': 'Russia', 'latitude': 55.7500, 'longitude': 37.6167},
    {'name': 'South Africa', 'latitude': 20.5071672, 'longitude': 23.435578},
    {'name': 'Egypt', 'latitude': 30.0500, 'longitude': 31.2333},
    {'name': 'Australia', 'latitude': -33.8650, 'longitude': 151.2094},
];
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Calc the distance between 2 coordinates as the crow flies
function distance(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

//Create random lat/long coordinates in a specified radius around a center point
function randomGeo(center, radius) {
    var y0 = center.latitude;
    var x0 = center.longitude;
    var rd = radius / 111300; //about 111300 meters in one degree

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    //Adjust the x-coordinate for the shrinking of the east-west distances
    var xp = x / Math.cos(y0);

    var newlat = y + y0;
    var newlon = x + x0;
    var newlon2 = xp + x0;

    return {
        'latitude': newlat.toFixed(5),
        'longitude': newlon.toFixed(5),
        'longitude2': newlon2.toFixed(5),
        'distance': distance(center.latitude, center.longitude, newlat, newlon).toFixed(2),
        'distance2': distance(center.latitude, center.longitude, newlat, newlon2).toFixed(2),
        'name' : center.name

    };
}


function generateNewUser(users_array, country_num_input) {
    var country_num = getRandomInt(0,COUNTRIES.length-1);
    var res;
    if (country_num_input !== undefined) {
        res = randomGeo(COUNTRIES[country_num_input], 200000);
    }
    else {
        res = randomGeo(COUNTRIES[country_num], 200000);
    }

    var coord = {
        latitude: res.latitude,
        longitude: res.longitude
    };
    //var country = res.name;

  var country = res.name;//COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  //var coord = {
  //  latitude: (Math.random() - 0.5) * 100,
  //  longitude: (Math.random() - 0.5) * 100
  //};
    var uname = chance.first()+' '+chance.last();
  var user = {
    id: currentID,
    username: uname,
    loc: coord,
    series: [1,2,3],
    country: country,
    graph_config: {
        title : {
            text : 'Number of Articles Read per Hour'
        },
        xAxis: {
            type: 'datetime',
            minTickInterval : 1000,
        },
      chart:{
        type: 'line',
          height: 200,
          width:400
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      series: [
        {name: 'Articles Read by ' + uname, data:(function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -5; i <= 0; i += 1) {
                data.push([
                    time + i * 1000* 3600,
                    Math.round(Math.random() * 100)
                ]);
            }
            return data;
        }())}
      ]
    }
  };
  currentID += 1;
  users_array.push(user);
  return user;
}
// --- End Code not needed for full or partial eval ----------------------------


// --- Begin Full eval code ----------------------------------------------------
// NOTE: anything that is needed for generating the correct view-model is here.
app.controller('refresh-user-data', function($scope, $http, $interval) {
  $scope.countries = COUNTRIES;


  $scope.users = [];

    for (var i = 0; i < 300; i++) {
        generateNewUser($scope.users, 2);
    }

    for (var i = 0; i < 400; i++) {
        generateNewUser($scope.users, 8);
    }


  // generate 100 initial users
  for (var i = 0; i < N; i++) {
    generateNewUser($scope.users);
  }

  configureVisitorMeter($scope);
  configurePageviewGraph($scope);

  $scope.map = {
    zoom: 3,
    center: { 'latitude': 35.8928646, 'longitude': -112.1970854 }
  };
    configureCountryShowHideFunctions($scope);


  // generate a new user every second
  $interval(function() {
    var user = generateNewUser($scope.users);
    // Highcharts directives have to be updated as well since their variables aren't bound.
    updateVisitorMeterConfig($scope, user);
    updatePageviewGraph($scope);
  }, 2000);


  // change a user's location every 100 ms.
  $interval(function() {
    var user = $scope.users[Math.floor($scope.users.length * Math.random())];
    user.loc.latitude = Number(user.loc.latitude) + 0.1;//(Math.random() - 0.5) * 100;
    user.loc.longitude = Number(user.loc.latitude) + 0.1;//(Math.random() - 0.5) * 100;
  }, 5000);

    var ijk = 0;
  // append a new data point to a user's graph
  //$interval(function() {
  //    ijk++;
  //  // For performance testing purposes, just push a constant to the first user.
  //  $scope.users[ijk%N].graph_config.series[0].data.push(10);
  //}, 1000);

});

// Configures the show hide functions for the country table.
function configureCountryShowHideFunctions($scope) {
  $scope.isHidden = {};
  // all rows are initially hidden
  for (var i = 0; i < COUNTRIES.length; i++) {
    $scope.isHidden[COUNTRIES[i].name] = true;
  }

  $scope.toggleHidden = function(country) {
    // TODO(nick): remove this console.log after Costas sees
    $scope.isHidden[country] = !$scope.isHidden[country];
  }
}

function configurePageviewGraph($scope) {
  $scope.pageviewGraphConfig = {

    chart:{
      type: 'line',
        height: 280,
        width:800
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false
        }
      }
    },
    title: {
      text: 'Visitors'
    },
    subtitle: {
      text: 'per second'
    },
		xAxis: {
				type: 'datetime',
				minTickInterval : 1000,
                title: {
                    text: 'Hours'
                }
		},
    series: [{
        name: 'visitors',
      data:
      (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -1000; i <= 0; i += 1) {
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
    num_of_visitors[COUNTRIES[i].name] = 0;
  }
  for (var i = 0; i < $scope.users.length; i++) {
    num_of_visitors[$scope.users[i].country] += 1;
  }
  $scope.visitorMeterSeries = [];

    var arrToSort = [];
  for (var i = 0; i < COUNTRIES.length; i++) {



      $scope.visitorMeterSeries.push({
          name: COUNTRIES[i].name,
          data: [num_of_visitors[COUNTRIES[i].name]]
      });
      arrToSort.push(num_of_visitors[COUNTRIES[i].name]);
  }
    function sortNumber(a,b) {
        return a - b;
    }
    arrToSort = arrToSort.sort(sortNumber);
    arrToSort.reverse();
    //console.log(arrToSort);

    $scope.visitorMeterSeries2 = [{
        name: 'Other',
        data: [0]
    }];
    for (var i =0; i<$scope.visitorMeterSeries.length;i++) {
        if ($scope.visitorMeterSeries[i].data[0] === arrToSort[0]) {
            $scope.visitorMeterSeries2.push({
                name: $scope.visitorMeterSeries[i].name,
                data: [$scope.visitorMeterSeries[i].data]
            })
        }
        else if ($scope.visitorMeterSeries[i].data[0] === arrToSort[1]) {
            $scope.visitorMeterSeries2.push({
                name: $scope.visitorMeterSeries[i].name,
                data: [$scope.visitorMeterSeries[i].data]
            })
        }
        else {
            $scope.visitorMeterSeries2[0] ={
                name: $scope.visitorMeterSeries2[0].name,
                data: [$scope.visitorMeterSeries[i].data[0] + $scope.visitorMeterSeries2[0].data[0]]
            }
        }
    }

    //$scope.visitorMeterSeries2.reverse();


  $scope.visitorMeterConfig = {
			chart: {
					type: 'bar',
          height: 150,
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
      series: $scope.visitorMeterSeries2
  };


    $scope.visitorMeterConfig2 = {
        chart: {
            type: 'bar',
            height: 150,
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
        series:  [{
                    name: 'Facebook',
                    data: [40],
                    index:0
                }, {
                    name: 'Twitter',
                    data: [35],
                    index:1
                }, {
                    name: 'Google',
                    data: [15],
                    index:2
                }, {
                    name: 'Direct',
                    data: [5],
                    index:3
                }]
    };
}

// --- End Full Eval code ------------------------------------------------------


// --- Extra filters needed ----------------------------------------------------
prev = null;
app.filter('toSortableArray', function() {
    return _.memoize(function(obj) {
        var arr = [];
        for (var k in obj) {
            arr.push({id: k, val: obj[k], active:true});
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
    var country_name = user.country;
    if ((country_name !== "Greece") & (country_name !== "USA")) {
        country_name = 'Other'
    }
  for (var i = 0; i < $scope.visitorMeterSeries2.length; i++) {
    if ($scope.visitorMeterSeries[i].name == country_name) {
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

