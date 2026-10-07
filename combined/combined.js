var map = L.map('combinemap').setView([38, -95], 3);

// basemap: Esri Dark Gray Canvas so both data layers stand out
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl, {
    attribution: 'Tiles &copy; <a href="http://' + 'www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);
var basemapLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; <a href="http://' + 'www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// ---------- layer 1: NEXRAD precipitation radar ----------
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true
};
var radar = L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(map);

// ---------- layer 2: NWS active weather alerts ----------
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';
var alertsLayer = L.layerGroup().addTo(map);
$.getJSON(weatherAlertsUrl, function(data) {
    L.geoJSON(data, {
            style: function(feature){
                var alertColor = 'orange'; // default: Moderate severity
                if (feature.properties.severity === 'Extreme') alertColor = 'purple';
                if (feature.properties.severity === 'Minor') alertColor = 'yellow';
                if (feature.properties.severity === 'Severe') alertColor = 'red';
                return { color: alertColor, weight: 2, fillOpacity: 0.2 };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.headline);
            }
        }).addTo(alertsLayer);
});

// ---------- layer 3: USGS earthquakes from the past 24 hours ----------
var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

function getColor(mag) {
    return mag >= 5  ? '#d73027' :
           mag >= 4  ? '#fc8d59' :
           mag >= 3  ? '#fee08b' :
           mag >= 2  ? '#d9ef8b' :
                      '#91cf60';
}
function getRadius(mag) {
    return mag >= 5  ? 15 :
           mag >= 4  ? 12 :
           mag >= 3  ? 9  :
           mag >= 2  ? 7  :
                       5;
}

var earthquakesLayer = L.layerGroup().addTo(map);
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
        }).addTo(earthquakesLayer);
});

// ---------- toggle control to switch layers on and off ----------
var overlayLayers = {
    'Weather Radar': radar,
    'Weather Alerts': alertsLayer,
    'Earthquakes': earthquakesLayer
};
L.control.layers(null, overlayLayers, {
    position: 'topleft',
    collapsed: false
}).addTo(map);

// ---------- legend for the earthquake magnitudes ----------
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
