data = {
  'users': []
};

var COUNTRIES = ['USA', 'Mexico', 'Canada'];

var countries_table;
var visitor_meter;
var view_count_graph;

var country_container_map = {};
var country_users_table_map = {};
var user_marker_map = {};
var user_chart_map = {};
var user_lat_container_map = {};
var user_lng_container_map = {};


// --- Start of handler code ---------------------------------------------------
window.onload = function() {
  setInterval(function() {
    var user = generateNewUser();
    updateForAddUser(user);
  }, 300);

  // Interval for adding additional data points for each user
  setInterval(function() {
    if (data.users.length > 0) {
      var user = data.users[Math.floor(Math.random() * data.users.length)];
      addDataPoint(user, Math.ceil(Math.random() * 10));
    }
  }, 300);

  // Interval for moving user markers around
  setInterval(function() {
    if (data.users.length > 0) {
      var user = data.users[Math.floor(Math.random() * data.users.length)];
      lat = (Math.random() - 0.5) * 100;
      lng = (Math.random() - 0.5) * 100;
      updateUserLocation(user, lat, lng);
    }
  }, 300);
}
// --- End of handler code -----------------------------------------------------


// -- Start code shared by Full and Partial eval -------------------------------

function addUserToCountryTable(user, table) {
  var tr = document.createElement('tr');
  tr.className = 'nested';
  // order is {id, country, lat, lng}
  var td1 = document.createElement('td');
  td1.innerHTML = user.id;
  var td2 = document.createElement('td');
  td2.innerHTML = user.country;
  var td3 = document.createElement('td');
  td3.innerHTML = Number(user.loc.lat).toFixed(2);
  td3.id = '_user_' + user.id + '_lat';
  user_lat_container_map[user.id] = td3;
  var td4 = document.createElement('td');
  td4.innerHTML = Number(user.loc.lng).toFixed(2);
  td4.id = '_user_' + user.id + '_lng';
  user_lng_container_map[user.id] = td4;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  table.appendChild(tr); 
}

// adds a new marker to the google map representing the user passed in
function addMarker(user) {
  var marker = new google.maps.Marker({position: user.loc, map: map});

  // create highcharts info window
  var highchartsDiv = document.createElement('div');

	var highchart = Highcharts.chart(highchartsDiv, {
			title: {
					text: '[TITLE HERE]'
			},
			series: [{
					name: 'values',
					data: user.series
			}]

	});
  var infowindow = new google.maps.InfoWindow({
    content: highchartsDiv,
    // we can use the maxWidth below to set the width of the infowindow, but highcharts gets cut off.
    // maxWidth: 200
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  user_chart_map[user.id] = highchart;
  user_marker_map[user.id] = marker;
}

// SORT TABLE function is copied from w3schools with minor modifications.
// source: https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = countries_table;
  switching = true;
  // Make a loop that will continue until no switching has been done
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    //Loop through all table rows (except the first, which contains table headers):
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      //Get the two elements you want to compare, one from current row and one from the next:
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      //check if the two rows should switch place
      if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
      }
    }
    if (shouldSwitch) {
      //If a switch has been marked, make the switch and mark that a switch has been done:
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

// -- End shared code ----------------------------------------------------------


// -- Start partial only code --------------------------------------------------

function updateForAddUser(user) {
  addMarker(user);
  updateUserCounter();
  updateCountryCount(user);
  updateVisitorMeter(user);
  updateViewCountGraph();
  addUserToCountryTable(user, country_users_table_map[user.country]);
}

// updates the marker's location on the google map and in the user table
function updateUserLocation(user, lat, lng) {
  user.loc = {lat: lat, lng: lng};
  if (user_marker_map[user.id] != undefined) {
    user_marker_map[user.id].setPosition(new google.maps.LatLng(lat, lng));
  }
  var lat_container = user_lat_container_map[user.id];
  var lng_container = user_lng_container_map[user.id];
  if (lat_container != undefined && lng_container != undefined) {
    lat_container.innerHTML = Number(lat).toFixed(2);
    lng_container.innerHTML = Number(lng).toFixed(2);
  }
}

// adds a new data point to the user's series to be displayed in the highchart infowindow
function addDataPoint(user, data_point) {
  user.series.push(data_point);
  if (user_chart_map[user.id] != undefined) {
    user_chart_map[user.id].series[0].addPoint(Math.random() * 10)
  }
}

// updates the global count of all visitors
function updateUserCounter() {
  var counter = document.getElementById('user_counter');
  counter.innerHTML = data.users.length;
}

// updates the table containing the breakdown of visitors by country
function updateCountryCount(user) {
  var country = user.country;
  country_container_map[country].innerHTML = parseInt(country_container_map[country].innerHTML) + 1
  sortTable();
}

// updates the bar containing visitor count
function updateVisitorMeter(user) {
  var country = user.country;
  for (var i = 0; i < visitor_meter.series.length; i++) {
    if (visitor_meter.series[i].userOptions.name == country) {
      // could potentially change how this value is created if "visitor count by country" is materialized.
      visitor_meter.series[i].setData([visitor_meter.series[i].data[0].y + 1]);
      break;
    }
  }
}

// updates the view count by appending the number of existant users
function updateViewCountGraph() {
  // the last two parameters enable the sliding window feature for the graph.
  // TODO(nick): decide on whether or not we want scrolling (scrolling is commented out below).
  // view_count_graph.series[0].addPoint([new Date().getTime(), data.users.length], true, true);
  view_count_graph.series[0].addPoint([new Date().getTime(), data.users.length]);
}

// -- End partial only code ----------------------------------------------------
