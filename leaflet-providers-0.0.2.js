(function () {
  var providers = {};

  L.TileLayer.Provider = L.TileLayer.extend({
    initialize: function (arg) {
      var parts = arg.split('.');

      var providerName = parts[0];
      var variantName = parts[1];

      if (!providers[providerName]) {
        throw "No such provider (" + providerName + ")";
      }

      var provider = {
        url: providers[providerName].url,
        options: providers[providerName].options
      };

      // overwrite values in provider from variant.
      if (variantName && 'variants' in providers[providerName]) {
        if (!(variantName in providers[providerName].variants)) {
          throw "No such name in provider (" + variantName + ")";
        }
        var variant = providers[providerName].variants[variantName];
        provider = {
          url: variant.url || provider.url,
          options: L.Util.extend({}, provider.options, variant.options)
        };
      }

      // replace attribution placeholders with their values from toplevel provider attribution.
      var attribution = provider.options.attribution;
      if (attribution.indexOf('{attribution.') != -1) {
        provider.options.attribution = attribution.replace(/\{attribution.(\w*)\}/,
          function(match, attributionName){
            return providers[attributionName].options.attribution;
          });
      }
      L.TileLayer.prototype.initialize.call(this, provider.url, provider.options);
    }
  });

  /**
   * Definition of providers.
   * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
   */
  providers = {
    OpenStreetMap: {
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      },
      variants: {
        Mapnik: {},
        BlackAndWhite: {
          url: 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
        },
        DE: {
          url: 'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
        }
      }
    },
    OpenCycleMap: {
      url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      options: {
        attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      }
    },
    Thunderforest: {
      url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      options: {
        attribution: '{attribution.OpenCycleMap}'
      },
      variants: {
        OpenCycleMap: {},
        Transport: {
          url: 'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
        },
        Landscape: {
          url: 'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png'
        }
      }
    },
    MapQuestOpen: {
      url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
      options: {
        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data {attribution.OpenStreetMap}',
        subdomains: '1234'
      },
      variants: {
        OSM: {},
        Aerial:{
          url: 'http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',
          options: {
            attribution:
              'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ' +
              'Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
          }
        }
      }
    },
    MapBox: {
      url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-simple/{z}/{x}/{y}.png',
      options: {
        attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data {attribution.OpenStreetMap}',
        subdomains: 'abcd'
      },
      variants: {
        Simple: {},
        Streets: {
          url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png'
        },
        Light: {
          url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-light/{z}/{x}/{y}.png'
        },
        Lacquer: {
          url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-lacquer/{z}/{x}/{y}.png'
        },
        Warden: {
          url: 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-warden/{z}/{x}/{y}.png'
        }
      }
    },
    Stamen: {
      url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
      options: {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
          'Map data {attribution.OpenStreetMap}',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
      },
      variants: {
        Toner: {},
        TonerBackground: {
          url: 'http://{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.png'
        },
        TonerHybrid: {
          url: 'http://{s}.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png'
        },
        TonerLines: {
          url: 'http://{s}.tile.stamen.com/toner-lines/{z}/{x}/{y}.png'
        },
        TonerLabels: {
          url: 'http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png'
        },
        TonerLite: {
          url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
        },
        Terrain: {
          url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png',
          options: {
            minZoom: 4,
            maxZoom: 18
          }
        },
        Watercolor: {
          url: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
          options: {
            minZoom: 3,
            maxZoom: 16
          }
        }
      }
    },
    Esri: {
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      options: {
        attribution: 'Tiles &copy; Esri'
      },
      variants: {
        WorldStreetMap: {},
        DeLorme: {
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}',
          options: {
            maxZoom: 11,
            attribution: '{attribution.Esri} &mdash; Copyright: ©2012 DeLorme'
          }
        },
        WorldTopoMap: {
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: '{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
          }
        },
        WorldImagery: {
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: '{attribution.Esri} &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          }
        },
        OceanBasemap: {
          url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
          options: {
            maxZoom: 11,
            attribution: '{attribution.Esri} &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
          }
        },
        NatGeoWorldMap: {
          url: 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: '{attribution.Esri} &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
          }
        }
      }
    }
  };
}());

L.TileLayer.provider = function(provider){
  return new L.TileLayer.Provider(provider);
};

