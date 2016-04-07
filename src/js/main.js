// Utilities

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

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
  start: 0,
  step: 1,
  behaviour: "tap",
  range: {
    'min': -3,
    'max': 3
  }
};

var slider1 = document.getElementById('slider0-1');
var slider2 = document.getElementById('slider0-2');
var slider3 = document.getElementById('slider0-3');
var slider4 = document.getElementById('slider0-4');
var slider5 = document.getElementById('slider1-2');
var slider6 = document.getElementById('slider1-3');
var slider7 = document.getElementById('slider1-4');
var slider8 = document.getElementById('slider2-3');
var slider9 = document.getElementById('slider2-4');
var slider10 = document.getElementById('slider3-4');

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
    // console.log(latlng);
    return L.marker(latlng, {
      icon: schoolMarker(feature)
    });
  }
}).addTo(map);


///// Geocode Home Postal Code
var homePoint = {
  "type": "FeatureCollection",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
    {
    "type": "Feature",
    "properties": {
        "name": "Home"
    },
    "geometry": {
        "type": "Point",
        "coordinates": []
    }
    }
]};
var homePostalCode = 0;
var homeCoord;
var add_hmarker;

function homeMarker(feature) {
  var hmarker = L.MakiMarkers.icon({
    icon: "building",
    color: "#ffbe95",
    size: "l"
  });
  return hmarker;
}

function getCoord(postalcode) {
  if (add_hmarker) {map.removeLayer(add_hmarker);} // to remove old marker
  var getTokenURL = 'http://www.onemap.sg/API/services.svc/getToken?accessKEY=0+nU5hAyy+NgqVpO3mepHsmZ1r6d+LI49ib3TUJuO9mG+HraaLvzEmEjXCdpYzyL14cwxTLFj6Jgc1EMIUClbdsmU/Egnr44bte4m9ecFNv2Rj99njfzrw==|mv73ZvjFcSo=';
  if (document.location.hostname == "localhost") {
    getTokenURL = 'http://www.onemap.sg/API/services.svc/getToken?accessKEY=xkg8VRu6Ol+gMH+SUamkRIEB7fKzhwMvfMo/2U8UJcFhdvR4yN1GutmUIA3A6r3LDhot215OVVkZvNRzjl28TNUZgYFSswOi';
  }
  var token = '';
  // console.log('getTokenURL: ' + getTokenURL);
  $.getJSON(getTokenURL)
  .done(function(data){
    token = data.GetToken[0].NewToken;
    // console.log('token: ' + token);
    var url = 'http://www.onemap.sg/APIV2/services.svc/basicSearchV2?token='+token+'&searchVal='+postalcode+'&otptFlds=SEARCHVAL,CATEGORY&returnGeom=0&rset=1&projSys=WGS84';
    // console.log(url);
    $.getJSON(url)
    .done(function(data) {
      console.log(data.size);
      console.log(data);
      if (data.SearchResults.length === 2) {
        var xCoord = parseFloat(data.SearchResults[1].X);
        var yCoord = parseFloat(data.SearchResults[1].Y);
        homeCoord = [xCoord,yCoord];
        homePoint.features[0].geometry.coordinates = homeCoord;
        add_hmarker = L.geoJson(homePoint, {
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: homeMarker(feature)
            });
          }
        }).addTo(map);
        $('#postalCodeResult').html('Postal Code Found');
      }
      else {
          $('#postalCodeResult').html('Postal Code Not Found');
      }
      // console.log(add_hmarker);
    })
    .fail(function(err){
      $('#postalCodeResult').html('<span>Postal Code Error</span>');
    });
  });
}

function calcWeight() {
  var sliderInput = [];
  var weightMatrix = [];
  var weightRowSum = [];
  var weightSum = 0;
  sliderInput.push(parseFloat(slider1.noUiSlider.get()),
               parseFloat(slider2.noUiSlider.get()),
               parseFloat(slider3.noUiSlider.get()),
               parseFloat(slider4.noUiSlider.get()),
               parseFloat(slider5.noUiSlider.get()),
               parseFloat(slider6.noUiSlider.get()),
               parseFloat(slider7.noUiSlider.get()),
               parseFloat(slider8.noUiSlider.get()),
               parseFloat(slider9.noUiSlider.get()),
               parseFloat(slider10.noUiSlider.get()));
  for (i=0;i<sliderInput.length;i++) {
    if (sliderInput[i] === 0) {
      sliderInput[i] = 1;
    } else if (sliderInput[i] > 0) {
      sliderInput[i]++;
    } else {
      sliderInput[i]--;
      sliderInput[i] = Math.pow((sliderInput[i]*(-1.0)),-1);
    }
  }
  // console.log(sliderInput);
  for (i=0;i<5;i++) {
    var weightMatrixRow = [];
    for (j=0;j<5;j++) {
      if (i===j) {
        weightMatrixRow.push(1);
      } else if (j>i) {
        var insert = sliderInput.shift();
        weightMatrixRow.push(insert);
      } else {
        weightMatrixRow.push('');
      }
    }
    weightMatrix.push(weightMatrixRow);
  }
  for (i=0;i<weightMatrix.length;i++) {
    for (j=0;j<weightMatrix.length;j++) {
      if (weightMatrix[i][j] === "") {
        weightMatrix[i][j] = Math.pow(weightMatrix[j][i],-1);
      }
    }
  }
  weightMatrix = multiplyMatrices(weightMatrix,weightMatrix);
  console.log(weightMatrix);
  for (i=0;i<weightMatrix.length;i++) {
    var tempRowSum = 0;
    for (j=0;j<weightMatrix.length;j++) {
      tempRowSum += weightMatrix[i][j];
    }
    weightRowSum.push(tempRowSum);
    weightSum += tempRowSum;
  }
  for (j=0;j<weightRowSum.length;j++){
    weightRowSum[j] = weightRowSum[j]/weightSum;
  }
  return weightRowSum;
} // Returns an array of weightings in the order of Academic Excellence, Sports Programs, Arts Programs, Proximity to Home and School Gender


$('#inputPostalCode').change(function() {
  getCoord($('#inputPostalCode').val());
});

$('#buttonAHP').click(function() {
  calcWeight();
});

var test;
