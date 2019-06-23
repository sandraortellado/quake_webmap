// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var Magnitudes = [];
var Colors = [];
var earthquakeData = d3.json(queryUrl, function(data) {
    for (var i = 0; i < data.features.length; i++) {
       Magnitudes.push(data.features[i].properties.mag)};
  createFeatures(data.features);
});

// Perform a GET request to the query URL
//d3.json(queryUrl, function(data) {
//  // Once we get a response, send the data.features object to the createFeatures function
//  createFeatures(data.features);
//});

//function getColor(value){
//
//}
f = d3.interpolateHsl('yellow', 'red');
//Magnitudes.forEach(getColor);
    
var colors=[];
var nColors=20;
for (var i=0; i<nColors; i++)
  colors.push(f(i/(nColors-1)));

var test = Magnitudes.sort(function(a,b){return a > b;}); 

console.log(test);



function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
          var geojsonMarkerOptions = {
        radius: feature.properties.mag * 5,
        fillColor:f(feature.properties.mag/7),
        color: f(feature.properties.mag/7),
        fillOpacity: 0.75
        };
console.log(geojsonMarkerOptions);
        return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup("<h3>" + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "<h3>");
    }});
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FuZHJhb3J0ZWxsYWRvIiwiYSI6ImNqd2p6ejcwZzBmanY0NHA2d3M5bGl0cnEifQ.-5auHOa1cGiCOE-JOnjT2w", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
    
    
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + f(grades[i]/7) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
}

legend.addTo(myMap);


};


