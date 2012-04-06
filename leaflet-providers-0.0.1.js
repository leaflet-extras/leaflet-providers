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
  var mapQuestAttr = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ' + osmDataAttr;
  L.TileLayer.MapQuestOpen = L.TileLayer.Common.extend({
    url: 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
    options: {attribution:mapQuestAttr, subdomains:['otile1','otile2','otile3','otile4']}
  });
  L.TileLayer.MapQuestOpen.OSM = L.TileLayer.MapQuestOpen;

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

}());
