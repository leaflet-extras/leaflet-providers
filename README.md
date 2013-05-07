Leaflet-providers
=================
An extension to [Leaflet](http://leafletjs.com/) that contains configurations for various free tile providers.

# Usage
```Javascript
//add Stamen Watercolor to map.
L.tileLayer.provider('Stamen.Watercolor').addTo(map);
```

Providers
===

Current options suitable for basemaps are:
* OpenStreetMap
    * OpenStreetMap.Mapnik
    * OpenStreetMap.BlackAndWhite
    * OpenStreetMap.DE
* OpenCycleMap
* Thunderforest
    * Thunderforest.OpenCycleMap
    * Thunderforest.Transport
    * Thunderforest.Landscape
* MapQuestOpen
    * MapQuestOpen.OSM
    * MapQuestOpen.Aerial
* Stamen
    * Stamen.Toner
    * Stamen.TonerBackground
    * Stamen.TonerHybrid
    * Stamen.TonerLines
    * Stamen.TonerLabels
    * Stamen.TonerLite
    * Stamen.Terrain
    * Stamen.Watercolor
* Esri
    * Esri.WorldStreetMap
    * Esri.DeLorme
    * Esri.WorldTopoMap
    * Esri.WorldImagery
    * Esri.WorldTerrain
    * Esri.WorldShadedRelief
    * Esri.WorldPhysical
    * Esri.OceanBasemap
    * Esri.NatGeoWorldMap
    * Esri.WorldGrayCanvas
* Acetate
    * Acetate.all
    * Acetate.basemap
    * Acetate.terrain
    * Acetate.foreground
    * Acetate.roads
    * Acetate.labels
    * Acetate.hillshading

Current options suitable for overlays are:
* OpenWeatherMap
    * OpenWeatherMap.Clouds
    * OpenWeatherMap.CloudsClassic
    * OpenWeatherMap.Precipitation
    * OpenWeatherMap.PrecipitationClassic
    * OpenWeatherMap.Rain
    * OpenWeatherMap.RainClassic
    * OpenWeatherMap.Pressure
    * OpenWeatherMap.PressureContour
    * OpenWeatherMap.Wind
    * OpenWeatherMap.Temperature
    * OpenWeatherMap.Snow

We also have Nokia basemaps which require a devID and appID specified in the options, they are
* Nokia.normalDay
* Nokia.normalGreyDay
* Nokia.satelliteNoLabelsDay
* Nokia.satelliteYesLabelsDay
* Nokia.terrainDay

Lastly we support Mapbox maps, so if your user name is YourName and your map is called MyMap you can add Mapbox.YourName.MyMap

Goodies
===

An other little goodie this library provides is a prefilled layer control,so you can just provide an array of strings:

```JavaScript
var baseLayers = ["Stamen.Watercolor","OpenStreetMap.Mapnik"],
	overlays = ["OpenWeatherMap.Clouds"];
var layerControl = L.control.layers.provided(baseLayers,overlays).addTo(map);
//you can still add your own after with 
layerControl.addBaseLayer(layer,name);
```
This work was inspired from <https://gist.github.com/1804938>, and origionally created by [Stefan Seelmann](https://github.com/seelmann).