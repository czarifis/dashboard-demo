data = {
  'users': []
};



var user_chart_map = {};


// --- Start of handler code ---------------------------------------------------
window.onload = function() {
  // Interval for adding additional data points for each user
  setInterval(function() {
    if (data.users.length > 0) {
      var user = data.users[Math.floor(Math.random() * data.users.length)];
      addDataPoint(user, Math.ceil(Math.random() * 10));
    }
  }, 300);
}
// --- End of handler code -----------------------------------------------------


// -- Start code shared by Full and Partial eval -------------------------------

// -- End shared code ----------------------------------------------------------


// -- Start partial only code --------------------------------------------------

// adds a new data point to the user's series to be displayed in the highchart infowindow
function addDataPoint(user, data_point) {
  user.series.push(data_point);
  if (user_chart_map[user.id] != undefined) {
    user_chart_map[user.id].series[0].addPoint(Math.random() * 10)
  }
}


// -- End partial only code ----------------------------------------------------
