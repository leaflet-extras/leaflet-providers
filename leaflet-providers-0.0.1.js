(function () {

  L.TileLayer.Common = L.TileLayer.extend({
    initialize: function (options) {
      L.TileLayer.prototype.initialize.call(this, this.url, options);
    }
  });

  // OSM
  var osmMapAttr = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
  var osmDataAttr = 'Map data ' + osmMapAttr;
  L.TileLayer.OpenStreetMap = L.TileLayer.Common.extend({
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {attribution:osmMapAttr}
  });
  L.TileLayer.OpenStreetMap.Mapnik = L.TileLayer.OpenStreetMap;
  L.TileLayer.OpenStreetMap.BlackAndWhite = L.TileLayer.OpenStreetMap.extend({
    url: 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
  });
  L.TileLayer.OpenStreetMap.DE = L.TileLayer.OpenStreetMap.extend({
    url: 'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
  });

  // OpenCycleMap/Thunderforest
  var ocmAttr = '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
  L.TileLayer.OpenCycleMap = L.TileLayer.Common.extend({
    url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    options: {attribution:ocmAttr}
  });
  L.TileLayer.Thunderforest = L.TileLayer.OpenCycleMap;
  L.TileLayer.Thunderforest.OpenCycleMap = L.TileLayer.Thunderforest;
  L.TileLayer.Thunderforest.Transport = L.TileLayer.Thunderforest.extend({
    url: 'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png',
  });
  L.TileLayer.Thunderforest.Landscape = L.TileLayer.Thunderforest.extend({
    url: 'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png',
  });

  // MapQuest
  var mapQuestAttr = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ';
  L.TileLayer.MapQuestOpen = L.TileLayer.Common.extend({
    url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
    options: {attribution:mapQuestAttr + osmDataAttr, subdomains:'1234'}
  });
  L.TileLayer.MapQuestOpen.OSM = L.TileLayer.MapQuestOpen;
  L.TileLayer.MapQuestOpen.Aerial = L.TileLayer.MapQuestOpen.extend({
    url: 'http://oatile{s}.mqcdn.com/naip/{z}/{x}/{y}.jpg',
    options: {attribution:mapQuestAttr + 'Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'}
  });

  // MapBox
  var mapBoxAttr = 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; ' + osmDataAttr;
  L.TileLayer.MapBox = L.TileLayer.Common.extend({
    url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-simple/{z}/{x}/{y}.png',
    options: {attribution:mapBoxAttr, subdomains:['a','b','c','d']}
  });
  L.TileLayer.MapBox.Simple = L.TileLayer.MapBox;
  L.TileLayer.MapBox.Streets = L.TileLayer.MapBox.extend({
    url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png'
  });
  L.TileLayer.MapBox.Light = L.TileLayer.MapBox.extend({
    url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png'
  });
  L.TileLayer.MapBox.Lacquer = L.TileLayer.MapBox.extend({
    url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-lacquer/{z}/{x}/{y}.png'
  });
  L.TileLayer.MapBox.Warden = L.TileLayer.MapBox.extend({
    url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-warden/{z}/{x}/{y}.png'
  });

  // Stamen
  var stamenAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' + osmDataAttr;
  L.TileLayer.Stamen = L.TileLayer.Common.extend({
    url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
    options: {attribution:stamenAttr, subdomains:['a','b','c','d'], minZoom:0, maxZoom:20}
  });
  L.TileLayer.Stamen.Toner = L.TileLayer.Stamen;
  L.TileLayer.Stamen.TonerLines = L.TileLayer.Stamen.extend({
    url: 'http://{s}.tile.stamen.com/toner-lines/{z}/{x}/{y}.png',
  });
  L.TileLayer.Stamen.TonerLabels = L.TileLayer.Stamen.extend({
    url: 'http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png',
  });
  L.TileLayer.Stamen.Terrain = L.TileLayer.Stamen.extend({
    url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png',
    options: {minZoom:4, maxZoom:18}
  });
  L.TileLayer.Stamen.Watercolor = L.TileLayer.Stamen.extend({
    url: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
    options: {minZoom:3, maxZoom:16}
  });

  // Esri
  var EsriAttr = 'Tiles &copy; Esri';
  L.TileLayer.Esri = L.TileLayer.Common.extend({
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {attribution:EsriAttr}
  });
  L.TileLayer.Esri.WorldStreetMap = L.TileLayer.Esri;
  L.TileLayer.Esri.DeLorme = L.TileLayer.Esri.extend({
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}',
    options: {attribution:EsriAttr + ' &mdash; Copyright: ©2012 DeLorme'}
  });
  L.TileLayer.Esri.WorldTopoMap = L.TileLayer.Esri.extend({
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    options: {attribution:EsriAttr + ' &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'}
  });
  L.TileLayer.Esri.WorldImagery = L.TileLayer.Esri.extend({
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {attribution:EsriAttr + ' &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}
  });
  L.TileLayer.Esri.OceanBasemap = L.TileLayer.Esri.extend({
    url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
    options: {attribution:EsriAttr + ' &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'}
  });
  L.TileLayer.Esri.NatGeoWorldMap = L.TileLayer.Esri.extend({
    url: 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    options: {attribution:EsriAttr + ' &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'}
  });
  
}());
