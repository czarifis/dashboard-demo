data = {
  'users': []
};

var COUNTRIES = ['USA', 'Mexico', 'Canada'];

var map;
var countries_table;
var visitor_meter;
var view_count_graph;
var user_table;

var country_users_table_map = {};


// --- Start of handler code ---------------------------------------------------
window.onload = function() {
  initializeMap();
  initializePageviewGraph();
  initializeVisitorMeter();
  initializeCountryTable();
  updateUserCounter();
  initializeUserTable();
}
// --- End of handler code -----------------------------------------------------

// -- Start Full Eval Code -----------------------------------------------------

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 0, lng: 0}
  });

  // Adding a significant number of user markers delays loading of the page.
  for (var i = 0; i < data.users.length; i++) {
    addMarker(data.users[i]);
  }
}

function initializePageviewGraph() {
  var viewCountGraphDiv = document.getElementById('view-count-graph');

  view_count_graph = Highcharts.chart(viewCountGraphDiv, {
    chart:{
      type: 'line'
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
				minTickInterval : 1000
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
  });
}

function initializeVisitorMeter() {
  var visitorMeterDiv = document.getElementById('visitor-meter');
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
  for (var i = 0; i < data.users.length; i++) {
    num_of_visitors[data.users[i].country] += 1;
  }
  var visitor_series = [];
  for (var i = 0; i < COUNTRIES.length; i++) {
    visitor_series.push({
      name: COUNTRIES[i],
      data: [num_of_visitors[COUNTRIES[i]]]
    });
  }

	visitor_meter = Highcharts.chart(visitorMeterDiv, {
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
      series: visitor_series
	});
}

function initializeCountryTable() {
  countries_table = document.getElementById('countries-table');
  // sum the total count of visitors from each country
  var num_of_visitors = {};
  for (var i = 0; i < COUNTRIES.length; i++) {
    num_of_visitors[COUNTRIES[i]] = 0;
  }
  for (var i = 0; i < data.users.length; i++) {
    num_of_visitors[data.users[i].country] += 1;
  }
  for (var i = 0; i < COUNTRIES.length; i++) {
    var tr = document.createElement('tr');
    tr.id = '_' + COUNTRIES[i];
    var td1 = document.createElement('td');
    td1.innerHTML = COUNTRIES[i];
    var td2 = document.createElement('td');
    td2.innerHTML = num_of_visitors[COUNTRIES[i]];
    td2.id = '_' + COUNTRIES[i] + '_count';
    // the third td is a button with the ability to show/hide users from the country.
    var td3 = document.createElement('td');
    var button = document.createElement('button');
    button.innerHTML = "Show Users";
    // Do the below inlined function call to avoid reference issues when javacsript loops.
    (function(button, country) {
        button.addEventListener ("click", function() {
          var table = country_users_table_map[country];
          if (table.style.display === 'none') {
            // Now show the table
            table.style.display = '';
            button.innerHTML = 'Hide Users';
          }
          else {
            // Now hide the table
            table.style.display = 'none';
            button.innerHTML = 'Show Users';
          }
        });
    })(button, COUNTRIES[i]);
    td3.appendChild(button);

    var td4 = document.createElement('td');
    // create the table to store users by country
    country_users_table_map[COUNTRIES[i]] = createUserByCountryTable(td4);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    countries_table.appendChild(tr); 
  }
}

function createUserByCountryTable(container) {
  var table = document.createElement('table');
  // the table is initially hidden
  table.style.display = 'none';
  var table_headers = ['User ID', 'Country', 'Lat', 'Lng'];
  var headers_tr = document.createElement('tr');
  headers_tr.className = 'nested';
  for (var i = 0; i < table_headers.length; i++) {
    var td = document.createElement('td');
    td.innerHTML = table_headers[i];
    headers_tr.appendChild(td);
  }
  table.appendChild(headers_tr);

  container.appendChild(table);
  return table;
}

function initializeUserTable() {
  for (var i = 0; i < data.users.length; i++) {
    addUserToCountryTable(data.users[i], country_users_table_map[data.users[i].country]);
  }
}

// -- End Full Eval Code -------------------------------------------------------


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
  var td4 = document.createElement('td');
  td4.innerHTML = Number(user.loc.lng).toFixed(2);
  td4.id = '_user_' + user.id + '_lng';
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
