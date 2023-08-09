Leaflet-providers
=================
An extension to [Leaflet](http://leafletjs.com/) that contains configurations for various free<sup>[1](#what-is-free)</sup> tile providers.

# Installation

Download [leaflet-providers.js](https://raw.githubusercontent.com/leaflet-extras/leaflet-providers/master/leaflet-providers.js) and include it in your page after including Leaflet, e.g.:

    <head>
      ...
      <script src="http://unpkg.com/leaflet@latest/dist/leaflet.js"></script>
      <script src="js/leaflet-providers.js"></script>
    </head>

# Usage

Leaflet-providers [providers](#providers) are referred to with a `provider[.<variant>]`-string. Let's say you want to add the nice [Watercolor](http://maps.stamen.com/#watercolor/) style from Stamen to your map, you pass `Stadia.StamenWatercolor` to the `L.tileLayer.provider`-constructor, which will return a [L.TileLayer](http://leafletjs.com/reference.html#tilelayer) instance for Stamens Watercolor tile layer.

```Javascript
// add Stamen Watercolor to map.
L.tileLayer.provider('Stadia.StamenWatercolor').addTo(map);
```

# Providers

Leaflet-providers provides tile layers from different providers, including *OpenStreetMap*, *Esri* and *OpenWeatherMap*. The full listing of free to use layers can be [previewed](http://leaflet-extras.github.io/leaflet-providers/preview/index.html). The page will show you the name to use with `leaflet-providers.js` and the code to use it without dependencies.

## Providers requiring registration

In addition to the providers you are free<b id="what-is-free">1</b> to use, we support some layers which require registration.

### HERE and HEREv3 (formerly Nokia).

In order to use HEREv3 layers, you must [register](http://developer.here.com/). Once registered, you can create an `apiKey` which you have to pass to `L.tileLayer.provider` in the options:

```Javascript
L.tileLayer.provider('HEREv3.terrainDay', {
    apiKey: '<insert apiKey here>'
}).addTo(map);
```

You can still pass `app_id` and `app_code` in legacy projects:

```Javascript
L.tileLayer.provider('HERE.terrainDay', {
    app_id: '<insert ID here>',
    app_code: '<insert ID here>'
}).addTo(map);
```

### Jawg Maps

In order to use Jawg Maps, you must [register](https://www.jawg.io/lab). Once registered, your access token will be located [here](https://www.jawg.io/lab/access-tokens) and you will access to all Jawg default maps (variants) and your own customized maps :

```JavaScript
L.tileLayer.provider('Jawg.Streets', {
    variant: '<insert map id here or blank for default variant>',
    accessToken: '<insert access token here>'
}).addTo(map);
```

### Mapbox

In order to use Mapbox maps, you must [register](https://tiles.mapbox.com/signup). You can get map_ID (e.g. "mapbox/satellite-v9") and ACCESS_TOKEN from [Mapbox projects](https://www.mapbox.com/projects):
```JavaScript
L.tileLayer.provider('MapBox', {
    id: '<insert map_ID here>',
    accessToken: '<insert ACCESS_TOKEN here>'
}).addTo(map);
```

The currently-valid Mapbox map styles, to use for map_IDs, [are listed in the Mapbox documentation](https://docs.mapbox.com/api/maps/#mapbox-styles) - only the final part of each is required, e.g. "mapbox/light-v10".

### MapTiler Cloud

In order to use MapTiler maps, you must [register](https://cloud.maptiler.com/). Once registered, get your API key from Account->Keys, which you have to pass to `L.tileLayer.provider` in the options:
```JavaScript
L.tileLayer.provider('MapTiler.Streets', {
    key: '<insert key here>'
}).addTo(map);
```

### MapTiles API

In order to use OpenStreetMap in English, French or Spanish provided by MapTiles API, you must [register](https://www.maptilesapi.com/). Once registered, you have to add your key to `L.tileLayer.provider` in the options:
```JavaScript
L.tileLayer.provider('MapTilesAPI.OSMEnglish', {
    apikey: '<insert key here>'
}).addTo(map);
```

### Thunderforest

In order to use Thunderforest maps, you must [register](https://thunderforest.com/pricing/). Once registered, you have an `api_key` which you have to pass to `L.tileLayer.provider` in the options:
```JavaScript
L.tileLayer.provider('Thunderforest.Landscape', {apikey: '<insert api_key here>'}).addTo(map);
```

### Esri/ArcGIS

In order to use ArcGIS maps, you must [register](https://developers.arcgis.com/en/sign-up/) and abide by the [terms of service](https://developers.arcgis.com/en/terms/). No special syntax is required.

[Available Esri layers](http://leaflet-extras.github.io/leaflet-providers/preview/#filter=Esri)

### TomTom

In order to use TomTom layers, you must [register](https://developer.tomtom.com/user/register). Once registered, you can create an `apikey` which you have to pass to `L.tileLayer.provider` in the options:

```Javascript
L.tileLayer.provider('TomTom', {
    apikey: '<insert your API key here>'
}).addTo(map);
```

### Geoportail France

In order to use Geoportail France resources, you need to obtain an [api key]( http://professionnels.ign.fr/ign/contrats/) that allows you to access the [resources](https://geoservices.ign.fr/documentation/donnees-ressources-wmts.html#ressources-servies-en-wmts-en-projection-web-mercator) you need. Pass this api key and the ID of the resource to display to `L.tileLayer.provider` in the options:
```JavaScript
L.tileLayer.provider('GeoportailFrance', {
    variant: '<insert resource ID here>',
    apikey: '<insert api key here>'
}).addTo(map);
```

Please note that a public api key (`choisirgeoportail`) is used by default and comes with no guarantee.

4 aliases are also provided for common Geoportail resources : `GeoportailFrance`, `GeoportailFrance.orthos`, `GeoportailFrance.ignMaps` and `GeoportailFrance.parcels` (See index.html demo).

### Stadia Maps

In order to use Stadia maps, you must [register](https://client.stadiamaps.com/signup/). Once registered, you can whitelist your domain within your account settings.

#### Stamen Design

As of July 31, 2023, Stamen's map styles are now hosted by [Stadia Maps](#stadia-maps). You can read the full
announcement from Stamen [here](http://maps.stamen.com/stadia-partnership/). No code changes are required to continue
using Stamen map styles hosted by Stadia Maps. Simply [register](https://client.stadiamaps.com/signup/) and whitelist
your domain.

# Attribution

This work was inspired from <https://gist.github.com/1804938>, and originally created by [Stefan Seelmann](https://github.com/seelmann).

### What do we mean by *free*?
<b id="what-is-free">1</b>
We try to maintain leaflet-providers in such a way that you'll be able to use the layers we include without paying money.
This doesn't mean no limits apply, you should always check before using these layers for anything serious.
