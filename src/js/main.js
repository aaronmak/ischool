function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
