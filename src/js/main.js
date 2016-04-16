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

function sortTable(table, order) {
    var asc   = order === 'asc',
        tbody = table.find('tbody');

    tbody.find('tr').sort(function(a, b) {
      // console.log($('td:first').html());
      var val1 = $('td:first', a).html();
      var val2 = $('td:first', b).html();
        if (asc) {
            return val1-val2;
        } else {
            return val2-val1;
        }
    }).appendTo(tbody);
}

function sortTableAsc(table) {
  var tbody = table.find('tbody');
  var originalOrder = tbody.find('tr').clone(true,true);
  var ascOrder = [];
  for (i=0;i<originalOrder.length;i++) {
    for (j=0;j<originalOrder.length;j++) {
      if (parseInt($('td:first',originalOrder[j]).html()) === (i+1)) {
        ascOrder.push(originalOrder[j]);
      }
    }
  }
  tbody.html($(ascOrder).clone(true,true));
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

//////Control for school point
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'school_info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>School Information</h4>';
};

info.addTo(map);

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

  var schoolName = toTitleCase(String(feature.properties.School_Name));
  var cutOffPointE = feature.properties['2017 Expected(Express_Lower)'] ? String(feature.properties['2017 Expected(Express_Lower)']) : '-';
  var cutOffPointA = feature.properties['2017 Expected(Normal(A)_Lower)'] ? String(feature.properties['2017 Expected(Normal(A)_Lower)']) : '-';
  var cutOffPointT = feature.properties['2017 Expected(Normal(T)_Lower)'] ? String(feature.properties['2017 Expected(Normal(T)_Lower)']) : '-';
  var graph = $('<div class="popupGraph" style="width:100%;height:100%;"><svg/></div>')[0];

  var popupContent = L.popup().setContent(graph);

  var graphColumns = [['x', '2014', '2015', '2016', '2017']];


  if (feature.properties['2016 Sec1(Express_Lower)'] || feature.properties['2014 Sec1(Express_Lower)'] || feature.properties['2015 Sec1(Express_Lower)']) {
    var expressCol = ['Express Stream'];
    if (feature.properties['2014 Sec1(Express_Lower)']) {expressCol.push(feature.properties['2014 Sec1(Express_Lower)']);}
    if (feature.properties['2015 Sec1(Express_Lower)']) {expressCol.push(feature.properties['2015 Sec1(Express_Lower)']);}
    if (feature.properties['2016 Sec1(Express_Lower)']) {
      expressCol.push(feature.properties['2016 Sec1(Express_Lower)']);
      expressCol.push(feature.properties['2017 Expected(Express_Lower)']);
    }
    graphColumns.push(expressCol);
  }
  if (feature.properties['2016 Sec1(Normal(A)_Lower)'] || feature.properties['2014 Sec1(Normal(A)_Lower)'] || feature.properties['2015 Sec1(Normal(A)_Lower)']) {
    var normalACol = ['Normal(A) Stream'];
    if (feature.properties['2014 Sec1(Normal(A)_Lower)']) {normalACol.push(feature.properties['2014 Sec1(Normal(A)_Lower)']);}
    if (feature.properties['2015 Sec1(Normal(A)_Lower)']) {normalACol.push(feature.properties['2015 Sec1(Normal(A)_Lower)']);}
    if (feature.properties['2016 Sec1(Normal(A)_Lower)']) {
      normalACol.push(feature.properties['2016 Sec1(Normal(A)_Lower)']);
      normalACol.push(feature.properties['2017 Expected(Normal(A)_Lower)']);
    }
    graphColumns.push(normalACol);
  }
  if (feature.properties['2016 Sec1(Normal(T)_Lower)'] || feature.properties['2014 Sec1(Normal(T)_Lower)'] || feature.properties['2015 Sec1(Normal(T)_Lower)']) {
    // if (feature.properties['2016 Sec1(Normal(T)_Lower)']) {
    //   graphColumns.push(['Normal(T) Stream', feature.properties['2014 Sec1(Normal(T)_Lower)'], feature.properties['2015 Sec1(Normal(T)_Lower)'], feature.properties['2016 Sec1(Normal(T)_Lower)'], feature.properties['2017 Expected(Normal(T)_Lower)']]);
    // } else {
    //   graphColumns.push(['Normal(T) Stream', feature.properties['2014 Sec1(Normal(T)_Lower)'], feature.properties['2015 Sec1(Normal(T)_Lower)'], feature.properties['2016 Sec1(Normal(T)_Lower)']]);
    // }
    var normalTCol = ['Normal(T) Stream'];
    if (feature.properties['2014 Sec1(Normal(T)_Lower)']) {normalTCol.push(feature.properties['2014 Sec1(Normal(T)_Lower)']);}
    if (feature.properties['2015 Sec1(Normal(T)_Lower)']) {normalTCol.push(feature.properties['2015 Sec1(Normal(T)_Lower)']);}
    if (feature.properties['2016 Sec1(Normal(T)_Lower)']) {
      normalTCol.push(feature.properties['2016 Sec1(Normal(T)_Lower)']);
      normalTCol.push(feature.properties['2017 Expected(Normal(T)_Lower)']);
    }
    graphColumns.push(normalTCol);
  }

  var chart = c3.generate({
    bindto: graph,
    size: {
      width: 300,
      height: 300
    },
    data: {
      x: 'x',
      columns: graphColumns,
      regions: {
        'Express Stream': [{'start':2016, 'style':'dashed'}],
        'Normal(A) Stream': [{'start':2016, 'style':'dashed'}],
        'Normal(T) Stream': [{'start':2016, 'style':'dashed'}]
      }
    },
    axis: {
      y: {
        max: 300,
        min: 100,
        padding: {top: 20, bottom: 20},
        label: {
          text: 'PSLE Cut Off Score',
          position: 'outer-middle'
        }
      },
      x: {
        padding: {right: 0.2},
        label: {
          text: schoolName,
          position: 'outer-center'
        },
        tick: {
          type: 'timeseries',
          tick: {
            format: '%Y'
          }
        }
      }
    }
  });


  layer.bindPopup(popupContent);

  ///// School Table
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var item = schoolTableBody.append(tr);
  var lastTr = $('#schoolTable tbody tr:last-child');
  // lastTr.append(td1,td2);
  lastTr.append(td1,td2,td3,td4);
  td1.innerHTML = schoolName;
  td2.innerHTML = cutOffPointE;
  td3.innerHTML = cutOffPointA;
  td4.innerHTML = cutOffPointT;

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
var highlightMarker = L.MakiMarkers.icon({
  icon: "college",
  color: "#de2d26",
  size: "l"
});

var defaultMarker = L.MakiMarkers.icon({
  icon: "college",
  color: "#474747",
  size: "m"
});

function highlightFeature(e){
  var layer = e.target;
  layer.setStyle({
    icon: "college",
    color: "#de2d26",
    size: "l"
  });
}
function resetFeature(e){
  var layer = e.target;
  layer.setStyle(defaultMarker);
}

function onEachFeature(feature,layer){
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetFeature,
    click: pop_SecondarySchools(feature,layer)
  });
}

var json_SecondarySchools = new L.geoJson(secondarySchools, {
  onEachFeature:onEachFeature,
  pointToLayer: function(feature, latlng) {
    // console.log(latlng);
    //schoolsLoc.push(latlng);
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
  var getTokenURL = 'http://www.onemap.sg/API/services.svc/getToken?accessKEY=j6/Rfby70oVeYjQxxA2ZsgGpk+VKBUyP6mhmDVQmu+NQVW0ylJG6K0/MgUI8B49FH0A0Fs7Nb5Nb/2PcjolCcwNGytg/J27TSXxrkWgeAqYM0qi2ManejNlLmtuP6c/g|mv73ZvjFcSo=';
  if (document.location.hostname == "localhost") {
    getTokenURL = 'http://www.onemap.sg/API/services.svc/getToken?accessKEY=xkg8VRu6Ol+gMH+SUamkRIEB7fKzhwMvfMo/2U8UJcFhdvR4yN1GutmUIA3A6r3LDhot215OVVkZvNRzjl28TNUZgYFSswOi';
  }
  var token = '';
  console.log('getTokenURL: ' + getTokenURL);
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

var originalTable = $('#schoolTable').clone(true,true);

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
      tempRowSum += weightMatrix[j][i];
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
  var distSchoolsFromHome = [];
  var units = "kilometers";
  for (i=0;i<schoolPoints.length;i++) {
    var distSchoolFromHome = turf.distance(homeLoc,schoolPoints[i],units);
    distSchoolsFromHome[i] = distSchoolFromHome;
    //Using 1/distSchoolFromHome instead raw distSchoolFromHome
  }
  return (distSchoolsFromHome);
} // returns an array with key 0-169 and values of distance from home each time this function is called

function inverseArr(array) {
  var invArr = [];
  for (i=0;i<array.length;i++) {
    invArr.push(1/array[i]);
  }
  return invArr;
}

function getValues() {
  var AcademicList = {};
  var SportsProgramList = {};
  var ArtsProgramList = {};

  for(i=0;i<schoolPoints.length;i++){
    AcademicList[i] = schoolPoints[i].properties.AE;
    SportsProgramList[i] = schoolPoints[i].properties.SportsPro;
    ArtsProgramList[i] = schoolPoints[i].properties.ArtProg;
  }
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
    return genderRank;
}

function calcAHP(RankingMatrix,relaRanking){
  var finalArray = [];
  for(i=0;i<170;i++){
    var tempSum = 0;
    for(j=0;j<5;j++){
      tempSum = tempSum + RankingMatrix[j][i]*relaRanking[j];
    }
    finalArray[i] = tempSum;
  }
  return finalArray;
}//returns an object with key 0-169 and values of School's AHP value

$('#inputPostalCode').change(function() {
  getCoord($('#inputPostalCode').val());
});

$('#buttonAHP').click(function() {
  getCoord($('#inputPostalCode').val());
  relaRanking = calcWeight();

  var RankingMatrix = [];
  var schoolRank = [];
  //Get inverse distance
  var oriDist = calcDist(add_hmarker);
  var distList = inverseArr(oriDist);
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
  //Generate Final Ranking
  schoolScore = calcAHP(RankingMatrix,relaRanking);
  var schoolScoreDesc = cloneObject(schoolScore);
  schoolScoreDesc.sort(function(a,b) { return b - a;});
  for (i=0;i<schoolScore.length;i++) {
    for (j=0;j<schoolScoreDesc.length;j++) {
      if (schoolScore[i] === schoolScoreDesc[j]) {
        schoolRank.push(j+1); // since rank starts from 1, not 0
      }
    }
  }
  $('#schoolTable').html(originalTable.clone(true,true)); // reset table
  for (i=0;i<schoolRank.length;i++) {
    $('#schoolTable tbody tr:nth-child('+(i+1)+')').prepend('<td>'+schoolRank[i]+'</td>');
    $('#schoolTable tbody tr:nth-child('+(i+1)+')').append('<td>'+ Math.round(oriDist[i]*1000) + '</td>');
  }
  sortTableAsc($('#schoolTable'));
  for (i=0;i<9;i++){
    console.log($._data($('#schoolTable tbody tr:nth-child('+(i+1)+')')[0],'events'));
  }
  $('.sidebar-tabs ul li').removeClass('active');
  $('.sidebar-content div').removeClass('active');
  $('.sidebar-tabs ul li:first-child').removeClass('disabled');
  $('.sidebar-tabs ul li:first-child').addClass('active');
  $('.sidebar-content div:first-child').addClass('active');
  $('#schoolTable tr td:nth-child(3)').show();
});

// Stream Input
$('#schoolTable tr td:nth-child(3)').show();
$('#streamInput').change(function() {
  if ($('#streamInput').val() === 'express') {
    $('#schoolTable tr td:nth-child(3)').show();
    $('#schoolTable tr td:nth-child(4)').hide();
    $('#schoolTable tr td:nth-child(5)').hide();
  } else if ($('#streamInput').val() === 'normalAcad') {
    $('#schoolTable tr td:nth-child(4)').show();
    $('#schoolTable tr td:nth-child(3)').hide();
    $('#schoolTable tr td:nth-child(5)').hide();
  } else {
    $('#schoolTable tr td:nth-child(5)').show();
    $('#schoolTable tr td:nth-child(3)').hide();
    $('#schoolTable tr td:nth-child(4)').hide();
  }
});
