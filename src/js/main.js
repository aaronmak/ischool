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
var schoolPoints = [];

function pop_SecondarySchools(feature, layer) {
/////popupGraph for each school

  var lineData = [
  {x:2013,y:feature.properties.Sec1_Express_Median_2013},
  {x:2014,y:feature.properties.Sec1_Express_Median_2014},
  {x:2015,y:feature.properties.Sec1_Express_Median_2015}];

  var div = $('<div class="popupGraph" style="width:100%;height:100%;"><svg/></div>')[0];

  var popupContent = L.popup().setContent(div);

  //var popupContent = toTitleCase(String(feature.properties.School_Name));

  var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
  },
  width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  var xRange = d3.scale.linear().range([margin.left, width - margin.right])
  .domain(d3.extent(lineData,function(d){
    return d.x;
  })),
  yRange = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([d3.min(lineData, function(d) {
    return d.y;
  })-5, d3.max(lineData, function(d) {
    return d.y;
  })]),
  xAxis = d3.svg.axis()
    .scale(xRange)
    .tickValues([2013,2014,2015]),
  yAxis = d3.svg.axis()
    .scale(yRange)
    .orient('left')
    .tickSubdivide(true);

  var lineFunc = d3.svg.line()
  .x(function(d) {
    return xRange(d.x);
  })
  .y(function(d) {
    return yRange(d.y);
  })
  .interpolate('linear');

  var svg = d3.select(div)
  .select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append('svg:path')
  .attr('d', lineFunc(lineData))
  .attr('stroke', 'blue')
  .attr('stroke-width', 2)
  .attr('fill', 'none');

  svg.append('svg:g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
  /*		.attr("transform", "translate(0," + height + ")")
  */	  .call(xAxis);

  svg.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (margin.left) + ',0)')
    .style("text-anchor", "end")
    .call(yAxis);

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
  // $(document).delegate(lastTr, 'click', function() {
  //   map.setView(layer.getLatLng(), 15);
  //   layer.openPopup();
  // });
  // $(lastTr).live('click',(function() {
  //   map.setView(layer.getLatLng(), 15);
  //   layer.openPopup();
  // }));
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
    // schoolsLoc.push(latlng);
    schoolPoints.push(feature);
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

function calcDist() {
  var homeLoc = homePoint.features[0];
  var distSchoolsFromHome = {};
  var units = "kilometers";
  for (i=0;i<schoolPoints.length;i++) {
    var distSchoolFromHome = turf.distance(homeLoc,schoolPoints[i],units);
    distSchoolsFromHome[i] = distSchoolFromHome;
  }
  //console.log("distance of schools from home: " + distSchoolsFromHome);
  return (distSchoolsFromHome);
} // returns an object with key 0-169 and values of distance from home each time this function is called

function getValues() {
  var AcademicList = {};
  var SportsProgramList = {};
  var ArtsProgramList = {};

  for(i=0;i<schoolPoints.length;i++){
    AcademicList[i] = schoolPoints[i].properties.AE;
    SportsProgramList[i] = schoolPoints[i].properties.SportsPro;
    ArtsProgramList[i] = schoolPoints[i].properties.ArtProg;
  }
  //console.log(AcademicList,SportsProgramList,ArtsProgramList);
  return [AcademicList,SportsProgramList,ArtsProgramList];
}
//Factor 1,2,3,4
function calcValue(ValueList){
  var Matrix = [];
  var Rank = [];
  var Sum = 0;

  for(i=0;i<170;i++){
    Sum = Sum + ValueList[i];
    Matrix.push(ValueList[i]);
  }
  for(i=0;i<Matrix.length;i++){
    temp = Matrix[i]/Sum;
    Rank.push(temp);
  }
  //console.log(Rank);
  return Rank;
}

//Factor 5:School Gender
function calcSG(){
    var preferGender  = document.getElementById("prefGen").value;
    var genderMatrix = [];
    var genderRank = [];
    var genderMatrixSum = 0;
    //console.log(preferGender);
    for(i=0;i<170;i++){
      if(schoolPoints[i].properties.Gender == preferGender){
        genderMatrix.push(1);
        genderMatrixSum = genderMatrixSum + 1;
      }else {
        genderMatrix.push(0);
        genderMatrixSum = genderMatrixSum + 0;
      }
    }

    for(i=0;i<genderMatrix.length;i++){
      temp = genderMatrix[i]/genderMatrixSum;
      genderRank.push(temp);
    }
    //console.log(genderRank);
    return genderRank;
}

function calcAHP(RankingMatrix,relaRanking){
  var finalArray = [];
  for(i=0;i<170;i++){
    var tempSum = 0;
    for(j=0;j<5;j++){
      tempSum = tempSum + RankingMatrix[j][i]*relaRanking[j];
      finalArray[i] = tempSum;
    }
  }
  //console.log(finalArray);
  return finalArray;
}//returns an object with key 0-169 and values of School's AHP value

$('#inputPostalCode').change(function() {
  getCoord($('#inputPostalCode').val());
});

$('#buttonAHP').click(function() {
  getCoord($('#inputPostalCode').val());
  relaRanking = calcWeight();

  var RankingMatrix = [];
  //Get distance
  distList = calcDist(add_hmarker);
  //Get values
  valueList = getValues();
  AcademicList = valueList[0];
  SportsProgramList = valueList[1];
  ArtsProgramList = valueList[2];
  //Factor 1:Academic Excellence
  AcadeExcelRanking = calcValue(AcademicList);
  RankingMatrix.push(AcadeExcelRanking);
  //Factor 2:Sports Programs
  SporProgRanking = calcValue(SportsProgramList);
  RankingMatrix.push(SporProgRanking);
  //Factor 3:Arts Programs
  ArtProgRanking = calcValue(ArtsProgramList);
  RankingMatrix.push(ArtProgRanking);
  //Factor 4:Proximity to home
  DistRanking = calcValue(distList);
  RankingMatrix.push(DistRanking);
  //Factor 5:School Gender
  SGRanking = calcSG();
  RankingMatrix.push(SGRanking);
  //console.log(RankingMatrix);
  //Generate Final Ranking
  SchoolRanking = calcAHP(RankingMatrix,relaRanking);
});
//<<<<<<< HEAD
//=======

// $(document).ready(function() {
//   $('#schoolTable').dynatable();
// });

//>>>>>>> fe56eb813533ddef174d88f917174193f7dcd000
