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
//
//
// var providers = {};
//
// providers.OpenStreetMap_BlackAndWhite = {
//     title: 'osm bw',
//     icon: 'css/image/openstreetmap_blackandwhite.png',
//     layer: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
//         maxZoom: 17,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     })
// };
//
// providers.OpenStreetMap_Mapnik = {
//     title: 'osm',
//     icon: 'css/image/openstreetmap_mapnik.png',
//     layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     })
// };
//
// providers.OpenStreetMap_DE = {
//     title: 'osm de',
//     icon: 'css/image/openstreetmap_de.png',
//     layer: L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
//         maxZoom: 17,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     })
// };
//
// var layers = [];
// for (var providerId in providers) {
//     layers.push(providers[providerId]);
// }
//
// var layerOrder = [];
// function stackLayers() {
//     for (index = 0; index < layerOrder.length; index++) {
//         map.removeLayer(layerOrder[index]);
//         map.addLayer(layerOrder[index]);
//     }
// }

L.control.zoom({
  position: 'topleft'
}).addTo(map);

// L.control.pan({
//   position: 'bottomleft'
// }).addTo(map);

L.control.scale({options: {position: 'bottomright', maxWidth: 100, metric: true, imperial: false, updateWhenIdle: false}}).addTo(map);


var sliderTooltip = function(event, ui) {
    var curValue = ui.value || 0;
    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
    $('.ui-slider-handle').html(tooltip);
};

var sliderTooltip1 = function(event, ui) {
    var curValue = ui.value || 0;
    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
    $('.ui-slider-handle').html(tooltip);
};
var sliderTooltip2 = function(event, ui) {
    var curValue = ui.value || 0;
    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
    $('.ui-slider-handle').html(tooltip);
};
var sliderTooltip3 = function(event, ui) {
    var curValue = ui.value || 0;
    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
    $('.ui-slider-handle').html(tooltip);
};
var sliderTooltip4 = function(event, ui) {
    var curValue = ui.value || 0;
    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
    $('.ui-slider-handle').html(tooltip);
};
var sliderTooltip5 = function(event, ui) {
    var curValue = ui.value || 0;
    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
    $('.ui-slider-handle').html(tooltip);
};

var schPref = {};
var manifest = {
  data: {acadEx: 0, sportsProg: 0, artsProg:0, distCar:0, distPubTrans:0, schGend:0},
  init: function($node, form) {
    $node.html(
      '<h2>What your ideal school needs</h2>'+
      '<label for="acadEx">Academic Excellence</label>'+
      '<div class="slider" id="acadEx"></div>'+
      '<label for="sportsProg">Sports Programs</label>'+
      '<div class="slider" id="sportsProg"></div>'+
      '<label for="artsProg">Arts Programs</label>'+
      '<div class="slider" id="artsProg"></div>'+
      '<label for="distCar">Proximity to Home by Car</label>'+
      '<div class="slider" id="distCar"></div>'+
      '<label for="distPubTrans">Proximity to Home by Public Transport</label>'+
      '<div class="slider" id="distPubTrans"></div>'+
      '<label for="schGend">School Gender</label>'+
      '<div class="slider" id="schGend"></div>'+
      '<span id="sumPref"></span>'
    );
  },
  ui:{
    "#acadEx": {
      bind: "acadEx",
      init: function ($node, form) {
				$node.slider({
					min: 0,
          max: 100,
          create: sliderTooltip1,
          slide: sliderTooltip1
				});
			}
    },
    "#sportsProg": {
      bind: "sportsProg",
      init: function ($node, form) {
				$node.slider({
					min: 0,
          max: 100,
          create: sliderTooltip2,
          slide: sliderTooltip2
				});
			}
    },
    "#artsProg": {
      bind: "artsProg",
      init: function ($node, form) {
				$node.slider({
					min: 0,
          max: 100,
          create: sliderTooltip,
          slide: sliderTooltip
				});
			}
    },
    "#distCar": {
      bind: "distCar",
      init: function ($node, form) {
				$node.slider({
					min: 0,
          max: 100,
          create: sliderTooltip,
          slide: sliderTooltip
				});
			}
    },
    "#distPubTrans": {
      bind: "distPubTrans",
      init: function ($node, form) {
				$node.slider({
					min: 0,
          max: 100,
          create: sliderTooltip,
          slide: sliderTooltip
				});
			}
    },
    "#schGend": {
      bind: "schGend",
      init: function ($node, form) {
				$node.slider({
					min: 0,
          max: 100,
          create: sliderTooltip,
          slide: sliderTooltip
				});
			}
    },
    "#sumPref": {
      bind: function(data) {
        var sum = 0;
        for (var pref in data) {
          sum += data[pref];
        }
        return sum;
      },
      watch: "#schGend,#distPubTrans,#distCar,#artsProg,#sportsProg,#acadEx"
    }
  }
};


$("#schPrefForm").my(manifest, schPref);
