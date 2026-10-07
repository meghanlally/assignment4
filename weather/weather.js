var map = L.map('weathermap').setView([38, -95], 4);

// Assignment modification: switched the basemap from standard OpenStreetMap
// to the Esri Dark Gray Canvas basemap, whose dark background makes the
// radar and alert layers stand out.
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl, {
    attribution: 'Tiles &copy; <a href="http://' + 'www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);
var basemapLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; <a href="http://' + 'www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// add the national precipitation radar layer
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true
};
var radar = L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(map);

// add alerts layer
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';
$.getJSON(weatherAlertsUrl, function(data) {
    //L.geoJSON(data).addTo(map);
    L.geoJSON(data, {
        style: function(feature){
            var alertColor = 'orange'; // default: Moderate severity
            // Assignment modification: new lines to color Extreme and Minor alerts
            if (feature.properties.severity === 'Extreme') alertColor = 'purple';
            if (feature.properties.severity === 'Minor') alertColor = 'yellow';
            if (feature.properties.severity === 'Severe') alertColor = 'red';
            return {
                color: alertColor,
                weight: 2,
                fillOpacity: 0.2
            };
          },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.headline);

            }


      }).addTo(map);

});
