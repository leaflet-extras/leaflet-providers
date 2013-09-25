'use strict';

mocha.setup({
	ui: 'bdd',
	globals: ['L', 'console', '_leaflet_resize3'],
	timeout: 5000
});


function isOverlay(layer) {
	if (layer.match(/^(OpenWeatherMap|OpenSeaMap)/)) {
		return true;
	}
}

function allLayers() {
	var layers = {
		base: [],
		overlay: []
	};

	function addLayer(name) {
		var type = isOverlay(name) ? 'overlay' : 'base';

		var layer = L.tileLayer.provider(name);
		layer._name = name;

		layers[type].push(layer);
	};

	for (var provider in L.TileLayer.Provider.providers) {
		if (provider === 'MapBox') {
			continue;
		}
		if (L.TileLayer.Provider.providers[provider].variants) {
			for (var variant in L.TileLayer.Provider.providers[provider].variants) {
				addLayer(provider + '.' + variant);
			}
		} else {
			addLayer(provider);
		}
	}

	return layers;
}

describe('leaflet-providers', function () {
	var map;
	beforeEach(function () {
		map = L.map('map', {
			attributionControl: false
		}).setView([0, 0], 5);
	});
	afterEach(function () {
		map.remove();
	});

	describe('provider definition', function () {
		var layers = allLayers();

		['base', 'overlay'].forEach(function (type) {
			describe(type + ' layers', function () {
				layers[type].forEach(function (layer) {
					var minZoom = layer.options.minZoom;

					it(layer._name + ' serves a tiles at [0, 0] zoom: ' + minZoom, function (done) {
						map.setZoom(minZoom);

						layer.addTo(map);
						layer.on({
							tileerror: function (event) {
								expect().fail('Error loading tile url: ' + event.url)
							},
							load: function () {
								done();
							}
						});
					});
				});
			});

		})
	});
});