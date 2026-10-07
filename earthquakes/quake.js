var map = L.map('quakemap').setView([38, -95], 3);

// basemap: Esri Dark Gray Canvas so the bright earthquake markers stand out
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl, {
    attribution: 'Tiles &copy; <a href="http://' + 'www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);
var basemapLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; <a href="http://' + 'www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// USGS feed of all earthquakes from the past 24 hours
var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// marker color based on magnitude
function getColor(mag) {
    return mag >= 5  ? '#d73027' :  // red
           mag >= 4  ? '#fc8d59' :  // orange
           mag >= 3  ? '#fee08b' :  // light yellow
           mag >= 2  ? '#d9ef8b' :  // light green
                      '#91cf60';    // green (magnitude below 2)
}

// marker size based on magnitude
function getRadius(mag) {
    return mag >= 5  ? 15 :
           mag >= 4  ? 12 :
           mag >= 3  ? 9  :
           mag >= 2  ? 7  :
                       5;
}

$.getJSON(earthquakeUrl, function(data) {
    L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var mag = feature.properties.mag;
                if (mag === null || mag === undefined) mag = 0;
                return L.circleMarker(latlng, {
                    radius: getRadius(mag),
                    color: getColor(mag),
                    weight: 1,
                    fillColor: getColor(mag),
                    fillOpacity: 0.75
                });
            },
            onEachFeature: function(feature, layer) {
                var p = feature.properties;
                var mag = p.mag;
                if (mag === null || mag === undefined) mag = 'n/a';
                var quakeTime = new Date(p.time).toLocaleString();
                layer.bindPopup(
                    '<b>Magnitude:</b> ' + mag +
                    '<br><b>Location:</b> ' + p.place +
                    '<br><b>Time:</b> ' + quakeTime
                );
            }
        }).addTo(map);
});

// legend explaining the magnitude color scheme
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<b>Earthquake Magnitude</b><br>';
    var grades = [5, 4, 3, 2, 0];
    var labels = ['5+', '4 to 4.9', '3 to 3.9', '2 to 2.9', 'Below 2'];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            labels[i] + '<br>';
    }
    return div;
};
legend.addTo(map);
