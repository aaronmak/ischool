// Utilities

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
    return temp;
}

// Map Init

var map = L.map('map', {
    zoomControl:false, maxZoom:17, minZoom:11
}).fitBounds([[1.470774832084756, 104.08848306516336],[1.158698700635265,103.60543572198932]]);
// var hash = new L.Hash(map);
var feature_group = new L.featureGroup([]);
var bounds_group = new L.featureGroup([]);
var basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 17
}).addTo(map);


L.control.zoom({
  position: 'topleft'
}).addTo(map);


L.control.scale({options: {position: 'bottomright', maxWidth: 100, metric: true, imperial: false, updateWhenIdle: false}}).addTo(map);

var sidebar = L.control.sidebar('sidebar-control', {
  position: 'right'
});

map.addControl(sidebar);

////// Sliders

var defaultOptions = {
  start: 4,
  step: 1,
  behaviour: "tap",
  range: {
    'min': 1,
    'max': 7
  }
};

var slider1 = document.getElementById('slider1-2');
var slider2 = document.getElementById('slider1-3');
var slider3 = document.getElementById('slider1-4');
var slider4 = document.getElementById('slider1-5');
var slider5 = document.getElementById('slider2-3');
var slider6 = document.getElementById('slider2-4');
var slider7 = document.getElementById('slider2-5');
var slider8 = document.getElementById('slider3-4');
var slider9 = document.getElementById('slider3-5');
var slider10 = document.getElementById('slider4-5');

noUiSlider.create(slider1, defaultOptions);
noUiSlider.create(slider2, defaultOptions);
noUiSlider.create(slider3, defaultOptions);
noUiSlider.create(slider4, defaultOptions);
noUiSlider.create(slider5, defaultOptions);
noUiSlider.create(slider6, defaultOptions);
noUiSlider.create(slider7, defaultOptions);
noUiSlider.create(slider8, defaultOptions);
noUiSlider.create(slider9, defaultOptions);
noUiSlider.create(slider10, defaultOptions);

///// Data Source
var schoolTableBody = $('#schoolTable tbody');

function pop_SecondarySchools(feature, layer) {
  var popupContent = toTitleCase(String(feature.properties.School_Name));
  layer.bindPopup(popupContent);

  ///// School Table
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var item = schoolTableBody.append(tr);
  var lastTr = $('#schoolTable tbody tr:last-child');
  lastTr.append(td1,td2);
  td1.innerHTML = toTitleCase(String(feature.properties.School_Name));
  td2.innerHTML = String(feature.properties.address);
  lastTr.click(function() {
    map.setView(layer.getLatLng(), 15);
    layer.openPopup();
  });
}

function schoolMarker(feature) {
  var marker = L.MakiMarkers.icon({
    icon: "college",
    color: "#474747",
    size: "m"
  });
  return marker;
}

var json_SecondarySchools = new L.geoJson(secondarySchools, {
  onEachFeature: pop_SecondarySchools,
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: schoolMarker(feature)
    });
  }
}).addTo(map);


///// Geocode Home Postal Code
var homeMarkerIcon = L.MakiMarkers.icon({
  icon: "building",
  color: "#ffbe95",
  size: "m"
});

var homePostalCode = 0;
var homeCoord;

$('#inputPostalCode').change(function() {
  homePostalCode = $('#inputPostalCode').val();
  getCoord(homePostalCode);
});

function getCoord(postalcode) {
  var url = 'http://www.onemap.sg/API/services.svc/basicSearch?token=qo/s2TnSUmfLz+32CvLC4RMVkzEFYjxqyti1KhByvEacEdMWBpCuSSQ+IFRT84QjGPBCuz/cBom8PfSm3GjEsGc8PkdEEOEr&searchVal='+postalcode+'&otptFlds=SEARCHVAL,CATEGORY&returnGeom=1&rset=1';
  $.getJSON(url)
  .done(function(data) {
    var xCoord = parseFloat(data.SearchResults[1].X);
    var yCoord = parseFloat(data.SearchResults[1].Y);
    homeCoord = [xCoord,yCoord];
    console.log(homeCoord);
    // L.marker(homelatlng, {
    //   icon: homeMarker
    // }).addTo(map);
  })
  .fail(function(err){
    console.log("Request Failed: " + err);
  });
}

var test;
