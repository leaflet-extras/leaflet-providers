/* globals mocha:true, describe:true, it:true, chai:true, beforeEach:true, afterEach:true */
(function () {
	'use strict';

	mocha.setup({
		ui: 'bdd',
		reporter: 'html',
		globals: ['L', 'console', '_leaflet_resize3'],
		timeout: 5000
	});
	chai.should();
	function ignored(providerName) {
		return providerName.indexOf('MapBox') !== -1 ||
		       providerName.indexOf('CloudMade') !== -1;
	}

	function isOverlay(providerName) {
		return providerName.match(/^(OpenWeatherMap|OpenSeaMap)/) !== null;
	}

	function allLayers() {
		var layers = {
			base: [],
			overlay: []
		};

		function addLayer(name) {
			if (ignored(name)) {
				return;
			}
			var type = isOverlay(name) ? 'overlay' : 'base';

			var layer = L.tileLayer.provider(name);
			layer._name = name;

			layers[type].push(layer);
		}

		for (var provider in L.TileLayer.Provider.providers) {
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

		describe('provider definition', function () {
			describe('when calling with a non-existing provider name', function () {
				it('throws an error', function () {
			
						L.tileLayer.provider.bind(undefined,'ThisWill.NeverExist').should.throw('No such provider (ThisWill)');
				});
			});

			var map;
			beforeEach(function () {
				map = L.map('map', {
					attributionControl: false
				}).setView([0, 0], 5);
			});
			afterEach(function () {
				map.remove();
			});

			var layers = allLayers();
			['base', 'overlay'].forEach(function (type) {
				describe(type + ' layers', function () {
					layers[type].forEach(function (layer) {
						var minZoom = Math.max(layer.options.minZoom, 1);

						it(layer._name + ' serves a tiles at [0, 0] zoom: ' + minZoom, function (done) {
							layer.on({
								tileerror: function (event) {
									event.url.should.not.exist;
								},
								load: function () {
									done();
								}
							});

							map.setZoom(minZoom);
							layer.addTo(map);
						});
					});
				});
			});
		});

	});
})();