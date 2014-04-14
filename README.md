Leaflet-providers
=================
An extension to [Leaflet](http://leafletjs.com/) that contains configurations for various free tile providers.

# Usage
Leaflet-providers [providers](#providers) are refered to with a `provider[.<variant>]`-string. Let's say you want to add the nice [Watercolor](http://maps.stamen.com/#watercolor/) style from Stamen to your map, you pass `Stamen.Watercolor` to the `L.tileLayer.provider`-constructor, which will return a [L.TileLayer](http://leafletjs.com/reference.html#tilelayer) instance for Stamens Watercolor tile layer.

```Javascript
// add Stamen Watercolor to map.
L.tileLayer.provider('Stamen.Watercolor').addTo(map);
```

# Providers

Leaflet-providers provides tile layers from different providers, including *OpenStreetMap*, *MapQuestOpen*, *Stamen*, *Esri* and *OpenWeatherMap*. The full listing of free to use layers can be [previewed](http://leaflet-extras.github.io/leaflet-providers/preview/index.html). The page will show you the name to use with `leaflet-providers.js` and the code to use it without dependencies.

## Providers requiring registration

In addition to the providers you are free to use, we support some layers which require registration.

### Nokia.

In order to use Nokia basemaps, you must [register](https://developer.here.com/web/guest/myapps). With your `devID` and `appID` specified in the options, the available layers are:

* Nokia.normalDay
* Nokia.normalGreyDay
* Nokia.satelliteNoLabelsDay
* Nokia.satelliteYesLabelsDay
* Nokia.terrainDay

For example:
```Javascript
L.tileLayer.provider('Nokia.terrainDay', {
    devID: 'insert ID here',
    appId: 'insert ID here'
}).addTo(map);
```

### Mapbox

In order to use Mapbox maps, you must [register](https://tiles.mapbox.com/signup). If your user name is `YourName` and your map is called `MyMap` you can add it with
```JavaScript
L.tileLayer.provider('MapBox.YourName.MyMap');
```

### Esri/ArcGIS

In order to use ArcGIS maps, you must [register](https://developers.arcgis.com/en/sign-up/) and abide by the [terms of service](https://developers.arcgis.com/en/terms/). Available layers are...

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

# Goodies

An other little goodie this library provides is a prefilled layer control, so you can just provide an array of strings:

```JavaScript
var baseLayers = ['Stamen.Watercolor', 'OpenStreetMap.Mapnik'],
	overlays = ['OpenWeatherMap.Clouds'];

var layerControl = L.control.layers.provided(baseLayers, overlays).addTo(map);

// you can still add your own afterwards with
layerControl.addBaseLayer(layer, name);
```

This work was inspired from <https://gist.github.com/1804938>, and originally created by [Stefan Seelmann](https://github.com/seelmann).
