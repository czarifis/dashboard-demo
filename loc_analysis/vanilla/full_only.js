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
