(function () {
	'use strict';

	L.TileLayer.Provider = L.TileLayer.extend({
		initialize: function (arg, options) {
			var providers = L.TileLayer.Provider.providers;

			var parts = arg.split('.');

			var providerName = parts[0];
			var variantName = parts[1];

			if (!providers[providerName]) {
				throw 'No such provider (' + providerName + ')';
			}

			var provider = {
				url: providers[providerName].url,
				options: providers[providerName].options
			};

			// overwrite values in provider from variant.
			if (variantName && 'variants' in providers[providerName]) {
				if (!(variantName in providers[providerName].variants)) {
					throw 'No such name in provider (' + variantName + ')';
				}
				var variant = providers[providerName].variants[variantName];
				provider = {
					url: variant.url || provider.url,
					options: L.Util.extend({}, provider.options, variant.options)
				};
			} else if (typeof provider.url === 'function') {
				provider.url = provider.url(parts.splice(1, parts.length - 1).join('.'));
			}

			// replace attribution placeholders with their values from toplevel provider attribution,
			// recursively
			var attributionReplacer = function (attr) {
				if (attr.indexOf('{attribution.') === -1) {
					return attr;
				}
				return attr.replace(/\{attribution.(\w*)\}/,
					function (match, attributionName) {
						return attributionReplacer(providers[attributionName].options.attribution);
					}
				);
			};
			provider.options.attribution = attributionReplacer(provider.options.attribution);

      var tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:';
      if(provider.options.HTTPS) {
        provider.url = tileProtocol+provider.url;
      } else {
        provider.url = 'http:'+provider.url;
      }

			// Compute final options combining provider options with any user overrides
			var layerOpts = L.Util.extend({}, provider.options, options);
			L.TileLayer.prototype.initialize.call(this, provider.url, layerOpts);
		}
	});

	/**
	 * Definition of providers.
	 * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
	 */

	//jshint maxlen:220
	L.TileLayer.Provider.providers = {
		OpenStreetMap: {
			url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
        HTTPS: true,
				attribution:
					'&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			},
			variants: {
				Mapnik: {},
				BlackAndWhite: {
					url: '//{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
				},
				DE: {
					url: '//{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
				},
				HOT: {
					url: '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
					options: {
						attribution: '{attribution.OpenStreetMap}, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
					}
				}
			}
		},
		OpenCycleMap: {
			url: '//{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
			options: {
        HTTPS: true,
				attribution:
					'&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, {attribution.OpenStreetMap}'
			}
		},
		OpenSeaMap: {
			url: '//tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
			options: {
        HTTPS: true,
				attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
			}
		},
		Thunderforest: {
			url: '//{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
			options: {
        HTTPS: true,
				attribution: '{attribution.OpenCycleMap}'
			},
			variants: {
				OpenCycleMap: {},
				Transport: {
					url: '//{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
				},
				Landscape: {
					url: '//{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png'
				},
				Outdoors: {
					url: '//{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png'
				}
			}
		},
		OpenMapSurfer: {
			url: '//openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}',
			options: {
        HTTPS: true,
				attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data {attribution.OpenStreetMap}'
			},
			variants: {
				Roads: {},
				AdminBounds: {
					url: '//openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}'
				},
				Grayscale: {
					url: '//openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}'
				}
			}
		},
		MapQuestOpen: {
			url: '//otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
			options: {
        HTTPS: false,
				attribution:
					'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ' +
					'Map data {attribution.OpenStreetMap}',
				subdomains: '1234'
			},
			variants: {
				OSM: {},
				Aerial: {
					url: '//oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',
					options: {
						attribution:
							'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ' +
							'Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
					}
				}
			}
		},
		MapBox: {
			url: function (id) {
				return '//{s}.tiles.mapbox.com/v3/' + id + '/{z}/{x}/{y}.png';
			},
			options: {
        HTTPS: true,
				attribution:
					'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; ' +
					'Map data {attribution.OpenStreetMap}',
				subdomains: 'abcd'
			}
		},
		Stamen: {
			url: '//{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
			options: {
        HTTPS: false,
				attribution:
					'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
					'<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
					'Map data {attribution.OpenStreetMap}',
				subdomains: 'abcd',
				minZoom: 0,
				maxZoom: 20
			},
			variants: {
				Toner: {},
				TonerBackground: {
					url: '//{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.png'
				},
				TonerHybrid: {
					url: '//{s}.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png'
				},
				TonerLines: {
					url: '//{s}.tile.stamen.com/toner-lines/{z}/{x}/{y}.png'
				},
				TonerLabels: {
					url: '//{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png'
				},
				TonerLite: {
					url: '//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
				},
				Terrain: {
					url: '//{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
					options: {
						minZoom: 4,
						maxZoom: 18
					}
				},
				TerrainBackground: {
					url: '//{s}.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg',
					options: {
						minZoom: 4,
						maxZoom: 18
					}
				},
				Watercolor: {
					url: '//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
					options: {
						minZoom: 3,
						maxZoom: 16
					}
				}
			}
		},
		Esri: {
			url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
			options: {
        HTTPS: true,
				attribution: 'Tiles &copy; Esri'
			},
			variants: {
				WorldStreetMap: {
					options: {
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
					}
				},
				DeLorme: {
					url: '//server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}',
					options: {
						minZoom: 1,
						maxZoom: 11,
						attribution: '{attribution.Esri} &mdash; Copyright: &copy;2012 DeLorme'
					}
				},
				WorldTopoMap: {
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
					options: {
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
					}
				},
				WorldImagery: {
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
					options: {
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
					}
				},
				WorldTerrain: {
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
					options: {
						maxZoom: 13,
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: USGS, Esri, TANA, DeLorme, and NPS'
					}
				},
				WorldShadedRelief: {
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
					options: {
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Source: Esri'
					}
				},
				WorldPhysical: {
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
					options: {
						maxZoom: 8,
						attribution: '{attribution.Esri} &mdash; Source: US National Park Service'
					}
				},
				OceanBasemap: {
					url: '//services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
					options: {
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
					}
				},
				NatGeoWorldMap: {
					url: '//services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
					options: {
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
					}
				},
				WorldGrayCanvas: {
					url: '//server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
					options: {
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ'
					}
				}
			}
		},
		OpenWeatherMap: {
			options: {
        HTTPS: false,
				attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
				opacity: 0.5
			},
			variants: {
				Clouds: {
					url: '//{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png'
				},
				CloudsClassic: {
					url: '//{s}.tile.openweathermap.org/map/clouds_cls/{z}/{x}/{y}.png'
				},
				Precipitation: {
					url: '//{s}.tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png'
				},
				PrecipitationClassic: {
					url: '//{s}.tile.openweathermap.org/map/precipitation_cls/{z}/{x}/{y}.png'
				},
				Rain: {
					url: '//{s}.tile.openweathermap.org/map/rain/{z}/{x}/{y}.png'
				},
				RainClassic: {
					url: '//{s}.tile.openweathermap.org/map/rain_cls/{z}/{x}/{y}.png'
				},
				Pressure: {
					url: '//{s}.tile.openweathermap.org/map/pressure/{z}/{x}/{y}.png'
				},
				PressureContour: {
					url: '//{s}.tile.openweathermap.org/map/pressure_cntr/{z}/{x}/{y}.png'
				},
				Wind: {
					url: '//{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png'
				},
				Temperature: {
					url: '//{s}.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png'
				},
				Snow: {
					url: '//{s}.tile.openweathermap.org/map/snow/{z}/{x}/{y}.png'
				}
			}
		},
		HERE: {
			/*
			 * HERE maps, formerly Nokia maps.
			 * These basemaps are free, but you need an API key. Please sign up at
			 * //developer.here.com/getting-started
			 *
			 * Note that the base urls contain '.cit' whichs is HERE's
			 * 'Customer Integration Testing' environment. Please remove for production
			 * envirionments.
			 */
			url:
				'//{s}.{base}.maps.cit.api.here.com/maptile/2.1/' +
				'maptile/{mapID}/{scheme}/{z}/{x}/{y}/256/png8?' +
				'app_id={app_id}&app_code={app_code}',
			options: {
        HTTPS: true,
				attribution:
					'Map &copy; <a href="http://developer.here.com">HERE</a>, Data &copy; NAVTEQ 2012',
				subdomains: '1234',
				mapID: 'newest',
				'app_id': '<insert your app_id here>',
				'app_code': '<insert your app_code here>',
				base: 'base',
				scheme: 'normal.day',
				minZoom: 0,
				maxZoom: 20
			},
			variants: {
				normalDay: {},
				normalDayCustom: { options: { scheme: 'normal.day.custom' }},
				normalDayGrey: { options: { scheme: 'normal.day.grey' }},
				normalDayMobile: { options: { scheme: 'normal.day.mobile' }},
				normalDayGreyMobile: { options: { scheme: 'normal.day.grey.mobile' }},
				normalDayTransit: { options: { scheme: 'normal.day.transit' }},
				normalDayTransitMobile: { options: { scheme: 'normal.day.transit.mobile' }},
				normalNight: { options: { scheme: 'normal.night' }},
				normalNightMobile: { options: { scheme: 'normal.night.mobile' }},
				normalNightGrey: { options: { scheme: 'normal.night.grey' }},
				normalNightGreyMobile: { options: { scheme: 'normal.night.grey.mobile' }},

				carnavDayGrey: { options: { scheme: 'carnav.day.grey' }},
				hybridDay: {
					options: {
						base: 'aerial',
						scheme: 'hybrid.day'
					}
				},
				hybridDayMobile: {
					options: {
						base: 'aerial',
						scheme: 'hybrid.day.mobile'
					}
				},
				pedestrianDay: { options: { scheme: 'pedestrian.day' }},
				pedestrianNight: { options: { scheme: 'pedestrian.night' }},
				satelliteDay: {
					options: {
						base: 'aerial',
						scheme: 'satellite.day'
					}
				},
				terrainDay: {
					options: {
						base: 'aerial',
						scheme: 'terrain.day'
					}
				},
				terrainDayMobile: {
					options: {
						base: 'aerial',
						scheme: 'terrain.day.mobile'
					}
				}
			}
		},
		Acetate: {
			url: '//a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png',
			options: {
        HTTPS: false,
				attribution:
					'&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
				subdomains: '0123',
				minZoom: 2,
				maxZoom: 18
			},
			variants: {
				all: {},
				basemap: {
					url: '//a{s}.acetate.geoiq.com/tiles/acetate-base/{z}/{x}/{y}.png'
				},
				terrain: {
					url: '//a{s}.acetate.geoiq.com/tiles/terrain/{z}/{x}/{y}.png'
				},
				foreground: {
					url: '//a{s}.acetate.geoiq.com/tiles/acetate-fg/{z}/{x}/{y}.png'
				},
				roads: {
					url: '//a{s}.acetate.geoiq.com/tiles/acetate-roads/{z}/{x}/{y}.png'
				},
				labels: {
					url: '//a{s}.acetate.geoiq.com/tiles/acetate-labels/{z}/{x}/{y}.png'
				},
				hillshading: {
					url: '//a{s}.acetate.geoiq.com/tiles/hillshading/{z}/{x}/{y}.png'
				}
			}
		}
	};

	L.tileLayer.provider = function (provider, options) {
		return new L.TileLayer.Provider(provider, options);
	};

	L.Control.Layers.Provided = L.Control.Layers.extend({
		initialize: function (base, overlay, options) {
			var first;

			var labelFormatter = function (label) {
				return label.replace(/\./g, ': ').replace(/([a-z])([A-Z])/g, '$1 $2');
			};

			if (base.length) {
				(function () {
					var out = {},
					    len = base.length,
					    i = 0;

					while (i < len) {
						if (typeof base[i] === 'string') {
							if (i === 0) {
								first = L.tileLayer.provider(base[0]);
								out[labelFormatter(base[i])] = first;
							} else {
								out[labelFormatter(base[i])] = L.tileLayer.provider(base[i]);
							}
						}
						i++;
					}
					base = out;
				}());
				this._first = first;
			}

			if (overlay && overlay.length) {
				(function () {
					var out = {},
					    len = overlay.length,
					    i = 0;

					while (i < len) {
						if (typeof overlay[i] === 'string') {
							out[labelFormatter(overlay[i])] = L.tileLayer.provider(overlay[i]);
						}
						i++;
					}
					overlay = out;
				}());
			}
			L.Control.Layers.prototype.initialize.call(this, base, overlay, options);
		},
		onAdd: function (map) {
			this._first.addTo(map);
			return L.Control.Layers.prototype.onAdd.call(this, map);
		}
	});

	L.control.layers.provided = function (baseLayers, overlays, options) {
		return new L.Control.Layers.Provided(baseLayers, overlays, options);
	};
}());

