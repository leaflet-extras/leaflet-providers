Leaflet-providers
=================
An extension to [Leaflet](http://leafletjs.com/) that contains configurations for various free tile providers.

# Usage
Leaflet-providers [providers](#providers) are refered to with a `provider[.<variant>]`-string. Let's say you want to add the nice [Watercolor](http://maps.stamen.com/#watercolor/) style from Stamen to your map, you pass `Stamen.Watercolor` to the `L.tileLayer.provider`-constructor, which will return a [L.TileLayer](http://leafletjs.com/reference.html#tilelayer) instance for Stamens Watercolor tile layer.

```Javascript
// add Stamen Watercolor to map.
L.tileLayer.provider('Stamen.Watercolor').addTo(map);
```

## Protocol relativity (`https://`-urls)

Leaflet-providers tries to use `https://` if the page uses `https://` and the provider supports it.
You can force the use of `http://` by passing `force_http: true` in the options argument.

# Providers

Leaflet-providers provides tile layers from different providers, including *OpenStreetMap*, *MapQuestOpen*, *Stamen*, *Esri* and *OpenWeatherMap*. The full listing of free to use layers can be [previewed](http://leaflet-extras.github.io/leaflet-providers/preview/index.html). The page will show you the name to use with `leaflet-providers.js` and the code to use it without dependencies.

## Providers requiring registration

In addition to the providers you are free to use, we support some layers which require registration.

### HERE (formerly Nokia).

In order to use HERE layers, you must [register](http://developer.here.com/). Once registered, you can create an `app_id` and `app_code` which you have to pass to `L.tileLayer.provider` in the options:

```Javascript
L.tileLayer.provider('HERE.terrainDay', {
    app_id: '<insert ID here>',
    app_code: '<insert ID here>'
}).addTo(map);
```

[Available HERE layers](http://leaflet-extras.github.io/leaflet-providers/preview/#filter=HERE)

### Mapbox

In order to use Mapbox maps, you must [register](https://tiles.mapbox.com/signup). If your user name is `YourName` and your map is called `MyMap` you can add it with:
```JavaScript
L.tileLayer.provider('MapBox.YourName.MyMap');
```

### Esri/ArcGIS

In order to use ArcGIS maps, you must [register](https://developers.arcgis.com/en/sign-up/) and abide by the [terms of service](https://developers.arcgis.com/en/terms/). No special syntax is required.

[Available Esri layers](http://leaflet-extras.github.io/leaflet-providers/preview/#filter=Esri)

# Attribution

This work was inspired from <https://gist.github.com/1804938>, and originally created by [Stefan Seelmann](https://github.com/seelmann).
