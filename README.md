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
    * OpenStreetMap.HOT
* OpenCycleMap
* Thunderforest
    * Thunderforest.OpenCycleMap
    * Thunderforest.Transport
    * Thunderforest.Landscape
    * Thunderforest.Outdoors
* OpenMapSurfer
    * Grayscale
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
    * Stamen.TerrainBackground
    * Stamen.Watercolor
* Acetate
    * Acetate.all
    * Acetate.basemap
    * Acetate.terrain
    * Acetate.foreground
    * Acetate.roads
    * Acetate.labels
    * Acetate.hillshading

Current options suitable for overlays are:
* OpenSeaMap
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

In addition we support Mapbox maps, so if your user name is YourName and your map is called MyMap you can add it with
```JavaScript
L.tileLayer.provider('Mapbox.YourName.MyMap');
```

Or if you use CloudMade then if your API key was MyAPIKey and your chosen map style was 123 you would add it with
```JavaScript
L.tileLayer.provider('CloudMade', { apiKey: 'MyAPIKey', styleID: '123' });
```

Goodies
===

An other little goodie this library provides is a prefilled layer control,so you can just provide an array of strings:

```JavaScript
var baseLayers = ["Stamen.Watercolor", "OpenStreetMap.Mapnik"],
	overlays = ["OpenWeatherMap.Clouds"];

var layerControl = L.control.layers.provided(baseLayers, overlays).addTo(map);

//you can still add your own afterwards with
layerControl.addBaseLayer(layer, name);
```

This work was inspired from <https://gist.github.com/1804938>, and originally created by [Stefan Seelmann](https://github.com/seelmann).
