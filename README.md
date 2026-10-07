# Assignment 4: Leaflet Web Map with OpenStreetMap

This assignment uses the Leaflet JavaScript library and free geospatial web APIs to build interactive web maps: a weather map showing real-time NEXRAD precipitation radar and active National Weather Service (NWS) alerts, and an earthquake map showing the past 24 hours of earthquakes from the U.S. Geological Survey (USGS). A bonus map combines both datasets with a layer toggle control. 

## Weather Map

The weather map displays the national precipitation radar layer from the Iowa Environmental Mesonet at Iowa State University and active weather alerts from the NWS API. Alert polygons are drawn in different colors by severity: Extreme (purple), Severe (red), Moderate (orange), and Minor (yellow), and clicking a polygon shows the alert headline. The basemap is the Esri Dark Gray Canvas basemap, whose dark background makes the radar and alert layers stand out.

<https://meghanlally.github.io/assignment4/weather/>

## Earthquake Map

The earthquake map shows all earthquakes recorded in the past 24 hours from the USGS real-time earthquake feed. Each earthquake is a circle marker that is sized and color-coded by magnitude, and clicking a marker opens a popup with the earthquake's magnitude, location, and time. A legend in the lower right corner explains the magnitude color scheme.

<https://meghanlally.github.io/assignment4/earthquakes/>

## Bonus: Combined Map

The bonus map combines live NWS weather alerts and USGS earthquake data on a single map. A layer toggle control in the upper left corner lets the user switch the weather radar, weather alert, and earthquake layers on and off.

<https://meghanlally.github.io/assignment4/combined/>

## Data Sources

Weather radar (NEXRAD n0r WMS) provided by Iowa State University Mesonet  
Weather alerts (Active Alerts API) provided by the National Weather Service  
Earthquakes (all_day GeoJSON feed) provided by the USGS  
Basemap tiles by Esri (Dark Gray Canvas)  
