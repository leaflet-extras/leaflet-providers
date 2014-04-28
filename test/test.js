var test = require('tape');

var L = require('leaflet-headless');
require('../leaflet-providers.js');

// monkey-patch getTileUrl with fake values.
L.TileLayer.prototype.getTileUrl = function (coords) {
	return L.Util.template(this._url, L.extend({
		r: '',
		s: this._getSubdomain(coords),
		x: coords.x,
		y: coords.y,
		z: 15
	}, this.options));
};

function ignored(providerName) {
	return providerName.indexOf('MapBox') !== -1;
}

function allLayers() {
	var layers = [];

	function addLayer(name) {
		if (ignored(name)) {
			return;
		}

		var layer = L.tileLayer.provider(name);
		layer._name = name;

		layers.push(layer);
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

allLayers().forEach(function (layer) {
	test('layer ' + layer._name, function (t) {
		t.plan(2);

		t.assert(layer instanceof L.TileLayer, 'layer is TileLayer');

		t.doesNotThrow(function () {
			// fake getTileUrl call
			layer.getTileUrl({ x: 16369, y: 10896});
		}, 'should not throw when creating url');

	});
});
