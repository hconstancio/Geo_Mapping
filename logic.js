// **********************************************
// **                                          **
// **   HOMEWORK --> Leapflet & Earthquakes    **
// **                                          **
// **********************************************
//
// ## Your Task
// ### Level 1: Basic Visualization
// Your first task is to visualize an earthquake data set.

// 1. **Get your data set**
//    The USGS provides earthquake data in a number of different formats, 
//    updated every 5 minutes. Visit the [USGS GeoJSON Feed]
//    (http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) 
//    page and pick a data set to visualize. When you click on a data 
//    set, for example 'All Earthquakes from the Past 7 Days', you will 
//    be given a JSON representation of that data. You will be using 
//    the URL of this JSON to pull in the data for our visualization.
//
// 2. **Import & Visualize the Data**
//    Create a map using Leaflet that plots all of the earthquakes from your data set based 
//    on their longitude and latitude.
//    * Your data markers should reflect the magnitude of the earthquake in their size and 
//      color. Earthquakes with higher magnitudes should appear larger and darker in color.
//    * Include popups that provide additional information about the earthquake when a marker 
//      is clicked.
//    * Create a legend that will provide context for your map data.
//    * Your visualization should look something like the map above.

// ** STORE URL (For the Past 7 days) **
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// var query2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Query the data through the URL
d3.json(queryUrl, function(data) {
// Send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Use onEachFeature function for each array data
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiaGNvbnN0YW5jaW8iLCJhIjoiY2praXNhdmQ3MTkweTNwcGJxZG9uOTRtMSJ9." +
    "Pe1h-KPmMn9FVLHDl65M8Q");

  // Define baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [30.5052, -97.8203],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Use different Red Shades depending on the Earthquake Magnitude
  function getColor(d) {
      return d < 1 ? 'rgb(255,255,255)' :
            d < 2  ? 'rgb(255,225,225)' :
            d < 3  ? 'rgb(255,195,195)' :
            d < 4  ? 'rgb(255,165,165)' :
            d < 5  ? 'rgb(255,135,135)' :
            d < 6  ? 'rgb(255,105,105)' :
            d < 7  ? 'rgb(255,75,75)' :
            d < 8  ? 'rgb(255,45,45)' :
            d < 9  ? 'rgb(255,15,15)' :
                        'rgb(255,0,0)';
  }

  // Display Map information
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through intervals density to generate the label with a colored square for each one
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}