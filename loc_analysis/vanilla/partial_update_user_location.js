data = {
  'users': []
};



var user_marker_map = {};
var user_lat_container_map = {};
var user_lng_container_map = {};


// --- Start of handler code ---------------------------------------------------
window.onload = function() {
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

// -- End shared code ----------------------------------------------------------


// -- Start partial only code --------------------------------------------------


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


// -- End partial only code ----------------------------------------------------
