(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['leaflet'], factory);
	} else if (typeof modules === 'object' && module.exports) {
		// define a Common JS module that relies on 'leaflet'
		module.exports = factory(require('leaflet'));
	} else {
		// Assume Leaflet is loaded into global object L already
		factory(L);
	}
}(this, function(L) {
	'use strict';

	L.TileLayer.Provider = L.TileLayer.extend({
		initialize: function(arg, options) {
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
					throw 'No such variant of ' + providerName + ' (' + variantName + ')';
				}
				var variant = providers[providerName].variants[variantName];
				var variantOptions;
				if (typeof variant === 'string') {
					variantOptions = {
						variant: variant
					};
				} else {
					variantOptions = variant.options;
				}
				provider = {
					url: variant.url || provider.url,
					options: L.Util.extend({}, provider.options, variantOptions)
				};
			}

			// replace attribution placeholders with their values from toplevel provider attribution,
			// recursively
			var attributionReplacer = function(attr) {
				if (attr.indexOf('{attribution.') === -1) {
					return attr;
				}
				return attr.replace(
					/\{attribution.(\w*)\}/g,
					function(match, attributionName) {
						return attributionReplacer(providers[attributionName].options.attribution);
					}
				);
			};
			provider.options.attribution = attributionReplacer(provider.options.attribution);

			// Compute final options combining provider options with any user overrides
			var layerOpts = L.Util.extend({}, provider.options, options);
			L.TileLayer.prototype.initialize.call(this, provider.url, layerOpts);
		}
	});

	/**
	 * Definition of providers.
	 * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
	 */

	L.TileLayer.Provider.providers = {
		OpenStreetMap: {
			url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			},
			variants: {
				Mapnik: {},
				DE: {
					url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
					options: {
						maxZoom: 18
					}
				},
				CH: {
					url: 'https://tile.osm.ch/switzerland/{z}/{x}/{y}.png',
					options: {
						maxZoom: 18,
						bounds: [[45, 5], [48, 11]]
					}
				},
				France: {
					url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
					options: {
						maxZoom: 20,
						attribution: '&copy; OpenStreetMap France | {attribution.OpenStreetMap}'
					}
				},
				HOT: {
					url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
					options: {
						attribution:
							'{attribution.OpenStreetMap}, ' +
							'Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> ' +
							'hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
					}
				},
				BZH: {
					url: 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
					options: {
						attribution: '{attribution.OpenStreetMap}, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
						bounds: [[46.2, -5.5], [50, 0.7]]
					}
				},
				CAT: {
					url: 'https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png',
					options: {
						attribution: '{attribution.OpenStreetMap}, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>',
					}
				}
			}
		},
		MapTilesAPI: {
			url: 'https://maptiles.p.rapidapi.com/{variant}/{z}/{x}/{y}.png?rapidapi-key={apikey}',
			options: {
				attribution:
					'&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, {attribution.OpenStreetMap}',
				variant: 'en/map/v1',
				// Get your own MapTiles API access token here : https://www.maptilesapi.com/
				// NB : this is a demonstration key that comes with no guarantee and not to be used in production
				apikey: '<insert your api key here>',
				maxZoom: 19
			},
			variants: {
				OSMEnglish: {
					options: {
						variant: 'en/map/v1'
					}
				},
				OSMFrancais: {
					options: {
						variant: 'fr/map/v1'
					}
				},
				OSMEspagnol: {
					options: {
						variant: 'es/map/v1'
					}
				}
			}
		},
		OpenSeaMap: {
			url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
			options: {
				attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
			}
		},
		OPNVKarte: {
			url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
			options: {
				maxZoom: 18,
				attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data {attribution.OpenStreetMap}'
			}
		},
		OpenTopoMap: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 17,
				attribution: 'Map data: {attribution.OpenStreetMap}, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		OpenRailwayMap: {
			url: 'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		OpenFireMap: {
			url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		SafeCast: {
			url: 'https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 16,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://blog.safecast.org/about/">SafeCast</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		Stadia: {
			url: 'https://tiles.stadiamaps.com/tiles/{variant}/{z}/{x}/{y}{r}.{ext}',
			options: {
				minZoom: 0,
				maxZoom: 20,
				attribution:
					'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
					'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
					'{attribution.OpenStreetMap}',
				variant: 'alidade_smooth',
				ext: 'png'
			},
			variants: {
				AlidadeSmooth: 'alidade_smooth',
				AlidadeSmoothDark: 'alidade_smooth_dark',
				AlidadeSatellite: {
					options: {
						attribution:
						  '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | ' +
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'alidade_satellite',
						ext: 'jpg',
					}
				},
				OSMBright: 'osm_bright',
				Outdoors: 'outdoors',
				StamenToner: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_toner'
					}
				},
				StamenTonerBackground: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_toner_background'
					}
				},
				StamenTonerLines: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_toner_lines'
					}
				},
				StamenTonerLabels: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_toner_labels'
					}
				},
				StamenTonerLite: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_toner_lite'
					}
				},
				StamenWatercolor: {
					url: 'https://tiles.stadiamaps.com/tiles/{variant}/{z}/{x}/{y}.{ext}',
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_watercolor',
						ext: 'jpg',
						minZoom: 1,
						maxZoom: 16
					}
				},
				StamenTerrain: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_terrain',
						minZoom: 0,
						maxZoom: 18
					}
				},
				StamenTerrainBackground: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_terrain_background',
						minZoom: 0,
						maxZoom: 18
					}
				},
				StamenTerrainLabels: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_terrain_labels',
						minZoom: 0,
						maxZoom: 18
					}
				},
				StamenTerrainLines: {
					options: {
						attribution:
							'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
							'&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> ' +
							'&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
							'{attribution.OpenStreetMap}',
						variant: 'stamen_terrain_lines',
						minZoom: 0,
						maxZoom: 18
					}
				}
			}
		},
		Thunderforest: {
			url: 'https://{s}.tile.thunderforest.com/{variant}/{z}/{x}/{y}{r}.png?apikey={apikey}',
			options: {
				attribution:
					'&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, {attribution.OpenStreetMap}',
				variant: 'cycle',
				apikey: '<insert your api key here>',
				maxZoom: 22
			},
			variants: {
				OpenCycleMap: 'cycle',
				Transport: {
					options: {
						variant: 'transport'
					}
				},
				TransportDark: {
					options: {
						variant: 'transport-dark'
					}
				},
				SpinalMap: {
					options: {
						variant: 'spinal-map'
					}
				},
				Landscape: 'landscape',
				Outdoors: 'outdoors',
				Pioneer: 'pioneer',
				MobileAtlas: 'mobile-atlas',
				Neighbourhood: 'neighbourhood'
			}
		},
		BaseMapDE: {
			url: 'https://sgx.geodatenzentrum.de/wmts_basemapde/tile/1.0.0/{variant}/default/GLOBAL_WEBMERCATOR/{z}/{y}/{x}.png',
			options: {
				attribution: 'Map data: &copy; <a href="http://www.govdata.de/dl-de/by-2-0">dl-de/by-2-0</a>',
				variant: 'de_basemapde_web_raster_farbe',
			},
			variants: {
				Color: 'de_basemapde_web_raster_farbe',
				Grey: 'de_basemapde_web_raster_grau'
			}
		},
		CyclOSM: {
			url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
			options: {
				maxZoom: 20,
				attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: {attribution.OpenStreetMap}'
			}
		},
		Jawg: {
			url: 'https://tile.jawg.io/{variant}/{z}/{x}/{y}{r}.png?access-token={accessToken}',
			options: {
				attribution:
					'<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> ' +
					'{attribution.OpenStreetMap}',
				minZoom: 0,
				maxZoom: 22,
				variant: 'jawg-streets',
				// Get your own Jawg access token here : https://www.jawg.io/lab/
				// NB : this is a demonstration key that comes with no guarantee
				accessToken: '<insert your access token here>',
			},
			variants: {
				Streets: 'jawg-streets',
				Terrain: 'jawg-terrain',
				Lagoon: 'jawg-lagoon',
				Sunny: 'jawg-sunny',
				Dark: 'jawg-dark',
				Light: 'jawg-light',
				Matrix: 'jawg-matrix'
			}
		},
		MapBox: {
			url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}',
			options: {
				attribution:
					'&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> ' +
					'{attribution.OpenStreetMap} ' +
					'<a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>',
				tileSize: 512,
				maxZoom: 18,
				zoomOffset: -1,
				id: 'mapbox/streets-v11',
				accessToken: '<insert your access token here>',
			}
		},
		MapTiler: {
			url: 'https://api.maptiler.com/maps/{variant}/{z}/{x}/{y}{r}.{ext}?key={key}',
			options: {
				attribution:
					'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
				variant: 'streets',
				ext: 'png',
				key: '<insert your MapTiler Cloud API key here>',
				tileSize: 512,
				zoomOffset: -1,
				minZoom: 0,
				maxZoom: 21
			},
			variants: {
				Streets: 'streets-v2',
				Basic: 'basic-v2',
				Bright: 'bright-v2',
				Pastel: 'pastel',
				Positron: 'positron',
				Hybrid: {
					options: {
						variant: 'hybrid',
						ext: 'jpg'
					}
				},
				Toner: 'toner-v2',
				Topo: 'topo-v2',
				Voyager: 'voyager-v2',
				Ocean: 'ocean',
				Backdrop: 'backdrop',
				Dataviz: 'dataviz',
				DatavizLight: 'dataviz-light',
				DatavizDark: 'dataviz-dark',
				Aquarelle: {
					options: {
						variant: 'aquarelle',
						ext: 'webp'
					}
				},
				Landscape: 'landscape',
				Openstreetmap: {
					options: {
						variant: 'openstreetmap',
						ext: 'jpg'
					}
				},
				Outdoor: 'outdoor-v2',
				Satellite: {
					options: {
						variant: 'satellite',
						ext: 'jpg'
					}
				},
				Winter: 'winter-v2',
			}
		},
		TomTom: {
			url: 'https://{s}.api.tomtom.com/map/1/tile/{variant}/{style}/{z}/{x}/{y}.{ext}?key={apikey}',
			options: {
				variant: 'basic',
				maxZoom: 22,
				attribution:
					'<a href="https://tomtom.com" target="_blank">&copy;  1992 - ' + new Date().getFullYear() + ' TomTom.</a> ',
				subdomains: 'abcd',
				style: 'main',
				ext: 'png',
				apikey: '<insert your API key here>',
			},
			variants: {
				Basic: 'basic',
				Hybrid: 'hybrid',
				Labels: 'labels'
			}
		},
		Esri: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/{variant}/MapServer/tile/{z}/{y}/{x}',
			options: {
				variant: 'World_Street_Map',
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
				WorldTopoMap: {
					options: {
						variant: 'World_Topo_Map',
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
					}
				},
				WorldImagery: {
					options: {
						variant: 'World_Imagery',
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
					}
				},
				WorldTerrain: {
					options: {
						variant: 'World_Terrain_Base',
						maxZoom: 13,
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: USGS, Esri, TANA, DeLorme, and NPS'
					}
				},
				WorldShadedRelief: {
					options: {
						variant: 'World_Shaded_Relief',
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Source: Esri'
					}
				},
				WorldPhysical: {
					options: {
						variant: 'World_Physical_Map',
						maxZoom: 8,
						attribution: '{attribution.Esri} &mdash; Source: US National Park Service'
					}
				},
				OceanBasemap: {
					options: {
						variant: 'Ocean/World_Ocean_Base',
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
					}
				},
				NatGeoWorldMap: {
					options: {
						variant: 'NatGeo_World_Map',
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
					}
				},
				WorldGrayCanvas: {
					options: {
						variant: 'Canvas/World_Light_Gray_Base',
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ'
					}
				}
			}
		},
		OpenWeatherMap: {
			url: 'http://{s}.tile.openweathermap.org/map/{variant}/{z}/{x}/{y}.png?appid={apiKey}',
			options: {
				maxZoom: 19,
				attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
				apiKey: '<insert your api key here>',
				opacity: 0.5
			},
			variants: {
				Clouds: 'clouds',
				CloudsClassic: 'clouds_cls',
				Precipitation: 'precipitation',
				PrecipitationClassic: 'precipitation_cls',
				Rain: 'rain',
				RainClassic: 'rain_cls',
				Pressure: 'pressure',
				PressureContour: 'pressure_cntr',
				Wind: 'wind',
				Temperature: 'temp',
				Snow: 'snow'
			}
		},

		HERE: {

			/*
			 * HERE maps API Version 3.
			 * documentation at: https://www.here.com/docs/bundle/raster-tile-api-developer-guide/page/README.html
			 * These basemaps are free, but you need an API key. Please sign up at
			 * https://platform.here.com/portal/
			 * Subscription remains for free, pricing details can be found here: https://www.here.com/get-started/pricing
			 * Version 3 deprecates the app_id and app_code access in favor of apiKey
			 */
			url:
				'https://maps.hereapi.com/v3/base/mc/' + // new base url for HERE maptile v3 api
				'{z}/{x}/{y}/{format}?style={variant}&size={size}' + // slightly modified parameters
				'&apiKey={app_id}&lg={language}', // replacing app-id with apikey
			options: {
				attribution:
					'Map &copy; 1987-' + new Date().getFullYear() + ' <a href="http://platform.here.com">HERE</a>',
				subdomains: '1234',
				mapID: 'newest',
				apiKey: '<insert your apiKey here>', // switching from appid and appcode to apikey
				base: 'base',
				variant: 'explore.day',
				maxZoom: 20,
				type: 'maptile',
				language: 'eng',
				format: 'png8',
				size: '256'
			},
			variants: {
				exploreDay: 'explore.day',
				liteDay: 'lite.day',
				logisticsDay: 'logistics.day',
				topoDay: 'topo.day',
				logisticsNight: 'logistics.night',
				exploreNight: 'explore.night',
				topoNight: 'topo.night',
				liteNight: 'lite.night',
				exploreSatelliteDay: 'explore.satellite.day',
				liteSatelliteDay: 'lite.satellite.day',
				logisticsSatelliteDay: 'logistics.satellite.day',
				basicMap: {
					options: {
						type: 'basetile'
					}
				},
				mapLabels: {
					options: {
						type: 'labeltile',
						format: 'png'
					}
				},
				trafficFlow: {
					options: {
						base: 'traffic',
						type: 'flowtile'
					}
				},
				carnavDayGrey: 'carnav.day.grey',
				hybridDay: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day'
					}
				},
				hybridDayMobile: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day.mobile'
					}
				},
				hybridDayTransit: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day.transit'
					}
				},
				hybridDayGrey: {
					options: {
						base: 'aerial',
						variant: 'hybrid.grey.day'
					}
				},
				pedestrianDay: 'pedestrian.day',
				pedestrianNight: 'pedestrian.night',
				satelliteDay: {
					options: {
						base: 'aerial',
						variant: 'satellite.day'
					}
				},
				terrainDay: {
					options: {
						base: 'aerial',
						variant: 'terrain.day'
					}
				},
				terrainDayMobile: {
					options: {
						base: 'aerial',
						variant: 'terrain.day.mobile'
					}
				}
			}
		},
		FreeMapSK: {
			url: 'https://{s}.freemap.sk/T/{z}/{x}/{y}.jpeg',
			options: {
				minZoom: 8,
				maxZoom: 16,
				subdomains: 'abcd',
				bounds: [[47.204642, 15.996093], [49.830896, 22.576904]],
				attribution:
					'{attribution.OpenStreetMap}, visualization CC-By-SA 2.0 <a href="http://freemap.sk">Freemap.sk</a>'
			}
		},
		MtbMap: {
			url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png',
			options: {
				attribution:
					'{attribution.OpenStreetMap} &amp; USGS'
			}
		},
		CartoDB: {
			url: 'https://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}{r}.png',
			options: {
				attribution: '{attribution.OpenStreetMap} &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 20,
				variant: 'light_all'
			},
			variants: {
				Positron: 'light_all',
				PositronNoLabels: 'light_nolabels',
				PositronOnlyLabels: 'light_only_labels',
				DarkMatter: 'dark_all',
				DarkMatterNoLabels: 'dark_nolabels',
				DarkMatterOnlyLabels: 'dark_only_labels',
				Voyager: 'rastertiles/voyager',
				VoyagerNoLabels: 'rastertiles/voyager_nolabels',
				VoyagerOnlyLabels: 'rastertiles/voyager_only_labels',
				VoyagerLabelsUnder: 'rastertiles/voyager_labels_under'
			}
		},
		HikeBike: {
			url: 'https://tiles.wmflabs.org/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: '{attribution.OpenStreetMap}',
				variant: 'hikebike'
			},
			variants: {
				HikeBike: {},
				HillShading: {
					options: {
						maxZoom: 15,
						variant: 'hillshading'
					}
				}
			}
		},
		BasemapAT: {
			url: 'https://mapsneu.wien.gv.at/basemap/{variant}/{type}/google3857/{z}/{y}/{x}.{format}',
			options: {
				maxZoom: 19,
				attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
				type: 'normal',
				format: 'png',
				bounds: [[46.358770, 8.782379], [49.037872, 17.189532]],
				variant: 'geolandbasemap'
			},
			variants: {
				basemap: {
					options: {
						maxZoom: 20, // currently only in Vienna
						variant: 'geolandbasemap'
					}
				},
				grau: 'bmapgrau',
				overlay: 'bmapoverlay',
				terrain: {
					options: {
						variant: 'bmapgelaende',
						type: 'grau',
						format: 'jpeg'
					}
				},
				surface: {
					options: {
						variant: 'bmapoberflaeche',
						type: 'grau',
						format: 'jpeg'
					}
				},
				highdpi: {
					options: {
						variant: 'bmaphidpi',
						format: 'jpeg'
					}
				},
				orthofoto: {
					options: {
						maxZoom: 20, // currently only in Vienna
						variant: 'bmaporthofoto30cm',
						format: 'jpeg'
					}
				}
			}
		},
		nlmaps: {
			url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/{variant}/EPSG:3857/{z}/{x}/{y}.png',
			options: {
				minZoom: 6,
				maxZoom: 19,
				bounds: [[50.5, 3.25], [54, 7.6]],
				attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl">Kadaster</a>'
			},
			variants: {
				standaard: 'standaard',
				pastel: 'pastel',
				grijs: 'grijs',
				water: 'water',
				luchtfoto: {
					url: 'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg',
				}
			}
		},
		NASAGIBS: {
			url: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/{variant}/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
			options: {
				attribution:
					'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System ' +
					'(<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
				bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
				minZoom: 1,
				maxZoom: 9,
				format: 'jpg',
				time: '',
				tilematrixset: 'GoogleMapsCompatible_Level'
			},
			variants: {
				ModisTerraTrueColorCR: 'MODIS_Terra_CorrectedReflectance_TrueColor',
				ModisTerraBands367CR: 'MODIS_Terra_CorrectedReflectance_Bands367',
				ViirsEarthAtNight2012: {
					options: {
						variant: 'VIIRS_CityLights_2012',
						maxZoom: 8
					}
				},
				ModisTerraLSTDay: {
					options: {
						variant: 'MODIS_Terra_Land_Surface_Temp_Day',
						format: 'png',
						maxZoom: 7,
						opacity: 0.75
					}
				},
				ModisTerraSnowCover: {
					options: {
						variant: 'MODIS_Terra_NDSI_Snow_Cover',
						format: 'png',
						maxZoom: 8,
						opacity: 0.75
					}
				},
				ModisTerraAOD: {
					options: {
						variant: 'MODIS_Terra_Aerosol',
						format: 'png',
						maxZoom: 6,
						opacity: 0.75
					}
				},
				ModisTerraChlorophyll: {
					options: {
						variant: 'MODIS_Terra_L2_Chlorophyll_A',
						format: 'png',
						maxZoom: 7,
						opacity: 0.75
					}
				}
			}
		},
		NLS: {
			// NLS maps are copyright National library of Scotland.
			// http://maps.nls.uk/projects/subscription-api
			// Please contact NLS for anything other than non-commercial low volume usage
			//
			// Map sources: Ordnance Survey 1:1m to 1:63K, 1880s-1961
			//   z0-9  - 1:1m
			//  z10-11 - quarter inch (1:253440)
			//  z12-18 - one inch (1:63360)
			url: 'https://api.maptiler.com/tiles/{variant}/{z}/{x}/{y}.jpg?key={apikey}',
			options: {
				attribution: '<a href="http://maps.nls.uk/projects/subscription-api">National Library of Scotland Historic Maps</a>',
				bounds: [[49.6, -12], [61.7, 3]],
				minZoom: 1,
				maxZoom: 18,
				apikey: '<insert your api key here>'
			},
			variants: {
				osgb63k1885: 'uk-osgb63k1885',
				osgb1888: 'uk-osgb1888',
				osgb10k1888: 'uk-osgb10k1888',
				osgb1919: 'uk-osgb1919',
				osgb25k1937: 'uk-osgb25k1937',
				osgb63k1955: 'uk-osgb63k1955',
				oslondon1k1893: 'uk-oslondon1k1893'
			}
		},
		JusticeMap: {
			// Justice Map (http://www.justicemap.org/)
			// Visualize race and income data for your community, county and country.
			// Includes tools for data journalists, bloggers and community activists.
			url: 'https://www.justicemap.org/tile/{size}/{variant}/{z}/{x}/{y}.png',
			options: {
				attribution: '<a href="http://www.justicemap.org/terms.php">Justice Map</a>',
				// one of 'county', 'tract', 'block'
				size: 'county',
				// Bounds for USA, including Alaska and Hawaii
				bounds: [[14, -180], [72, -56]]
			},
			variants: {
				income: 'income',
				americanIndian: 'indian',
				asian: 'asian',
				black: 'black',
				hispanic: 'hispanic',
				multi: 'multi',
				nonWhite: 'nonwhite',
				white: 'white',
				plurality: 'plural'
			}
		},
		GeoportailFrance: {
			url: 'https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER={variant}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
			options: {
				attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
				bounds: [[-75, -180], [81, 180]],
				minZoom: 2,
				maxZoom: 18,
				format: 'image/png',
				style: 'normal',
				variant: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2'
			},
			variants: {
				plan: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
				parcels: {
					options: {
						variant: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS',
						style: 'PCI vecteur',
						maxZoom: 20
					}
				},
				orthos: {
					options: {
						maxZoom: 19,
						format: 'image/jpeg',
						variant: 'ORTHOIMAGERY.ORTHOPHOTOS'
					}
				}
			}
		},
		OneMapSG: {
			url: 'https://maps-{s}.onemap.sg/v3/{variant}/{z}/{x}/{y}.png',
			options: {
				variant: 'Default',
				minZoom: 11,
				maxZoom: 18,
				bounds: [[1.56073, 104.11475], [1.16, 103.502]],
				attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
			},
			variants: {
				Default: 'Default',
				Night: 'Night',
				Original: 'Original',
				Grey: 'Grey',
				LandLot: 'LandLot'
			}
		},
		USGS: {
			url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
			options: {
				maxZoom: 20,
				attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
			},
			variants: {
				USTopo: {},
				USImagery: {
					url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'
				},
				USImageryTopo: {
					url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}'
				}
			}
		},
		WaymarkedTrails: {
			url: 'https://tile.waymarkedtrails.org/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 18,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			},
			variants: {
				hiking: 'hiking',
				cycling: 'cycling',
				mtb: 'mtb',
				slopes: 'slopes',
				riding: 'riding',
				skating: 'skating'
			}
		},
		OpenAIP: {
			url: 'https://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.{ext}',
			options: {
				attribution: '<a href="https://www.openaip.net/">openAIP Data</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-NC-SA</a>)',
				ext: 'png',
				minZoom: 4,
				maxZoom: 14,
				tms: true,
				detectRetina: true,
				subdomains: '12'
			}
		},
		OpenSnowMap: {
			url: 'https://tiles.opensnowmap.org/{variant}/{z}/{x}/{y}.png',
			options: {
				minZoom: 9,
				maxZoom: 18,
				attribution: 'Map data: {attribution.OpenStreetMap} & ODbL, &copy; <a href="https://www.opensnowmap.org/iframes/data.html">www.opensnowmap.org</a> <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			},
			variants: {
				pistes: 'pistes',
			}
		},
		AzureMaps: {
			url:
				'https://atlas.microsoft.com/map/tile?api-version={apiVersion}' +
				'&tilesetId={variant}&x={x}&y={y}&zoom={z}&language={language}' +
				'&subscription-key={subscriptionKey}',
			options: {
				attribution: 'See https://docs.microsoft.com/en-us/rest/api/maps/render-v2/get-map-tile for details.',
				apiVersion: '2.0',
				variant: 'microsoft.imagery',
				subscriptionKey: '<insert your subscription key here>',
				language: 'en-US',
			},
			variants: {
				MicrosoftImagery: 'microsoft.imagery',
				MicrosoftBaseDarkGrey: 'microsoft.base.darkgrey',
				MicrosoftBaseRoad: 'microsoft.base.road',
				MicrosoftBaseHybridRoad: 'microsoft.base.hybrid.road',
				MicrosoftTerraMain: 'microsoft.terra.main',
				MicrosoftWeatherInfraredMain: {
					url:
					'https://atlas.microsoft.com/map/tile?api-version={apiVersion}' +
					'&tilesetId={variant}&x={x}&y={y}&zoom={z}' +
					'&timeStamp={timeStamp}&language={language}' +
					'&subscription-key={subscriptionKey}',
					options: {
						timeStamp: '2021-05-08T09:03:00Z',
						attribution: 'See https://docs.microsoft.com/en-us/rest/api/maps/render-v2/get-map-tile#uri-parameters for details.',
						variant: 'microsoft.weather.infrared.main',
					},
				},
				MicrosoftWeatherRadarMain: {
					url:
					'https://atlas.microsoft.com/map/tile?api-version={apiVersion}' +
					'&tilesetId={variant}&x={x}&y={y}&zoom={z}' +
					'&timeStamp={timeStamp}&language={language}' +
					'&subscription-key={subscriptionKey}',
					options: {
						timeStamp: '2021-05-08T09:03:00Z',
						attribution: 'See https://docs.microsoft.com/en-us/rest/api/maps/render-v2/get-map-tile#uri-parameters for details.',
						variant: 'microsoft.weather.radar.main',
					},
				}
			},
		},
		SwissFederalGeoportal: {
			url: 'https://wmts.geo.admin.ch/1.0.0/{variant}/default/current/3857/{z}/{x}/{y}.jpeg',
			options: {
				attribution: '&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>',
				minZoom: 2,
				maxZoom: 18,
				bounds: [[45.398181, 5.140242], [48.230651, 11.47757]]
			},
			variants: {
				NationalMapColor: 'ch.swisstopo.pixelkarte-farbe',
				NationalMapGrey: 'ch.swisstopo.pixelkarte-grau',
				SWISSIMAGE: {
					options: {
						variant: 'ch.swisstopo.swissimage',
						maxZoom: 19
					}
				}
			}
		},
		TopPlusOpen: {
			url: 'http://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/{variant}/default/WEBMERCATOR/{z}/{y}/{x}.png',
			options: {
				maxZoom: 18,
				attribution: 'Map data: &copy; <a href="http://www.govdata.de/dl-de/by-2-0">dl-de/by-2-0</a>',
				variant: 'web',
			},
			variants: {
				Color: 'web',
				Grey: 'web_grau'
			}
		}
	};

	L.tileLayer.provider = function(provider, options) {
		return new L.TileLayer.Provider(provider, options);
	};

	return L;
}));
