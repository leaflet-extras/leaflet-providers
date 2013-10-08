(function () {
	'use strict';

	var map = new L.Map('map', {
		zoomControl: false,
		attributionControl: false,
		center: [48, -3],
		zoom: 5
	});

	// save the options object while creating tilelayers to cleanly access it later.
	var origTileLayerInit = L.TileLayer.prototype.initialize;
	L.TileLayer.include({
		initialize: function (url, options) {
			this._options = options;
			origTileLayerInit.apply(this, arguments);
		}
	});
	var origProviderInit = L.TileLayer.Provider.prototype.initialize;
	L.TileLayer.Provider.include({
		initialize: function (arg) {
			this._providerName = arg;
			origProviderInit.apply(this, arguments);
		}
	});

	var isIgnored = function (layer) {
		if (layer.match(/^(CloudMade|MapBox|OpenSeaMap)/)) {
			return true;
		}
	};

	var escapeHtml = function (string) {
		return string
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	};

	// collect all layers available in the provider definition
	var layers = {};
	var addLayer = function (name) {
		layers[name] = L.tileLayer.provider(name);
	};

	for (var provider in L.TileLayer.Provider.providers) {
		if (isIgnored(provider)) {
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

	var layerControl = L.control.layers.minimap(layers, null).addTo(map);
	layers['OpenStreetMap.Mapnik'].addTo(map);

	// Add the TileLayer source code control to the map
	map.addControl(new (L.Control.extend({
		options: {
			position: 'topleft'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'info');
			L.DomEvent.disableClickPropagation(container);

			container.innerHTML =
				'<h4><a href="https://github.com/leaflet-extras/leaflet-providers">Leaflet-providers preview</a></h4>' +
				'<p>This page shows mini maps for all the layers available in ' +
				'<a href="https://github.com/leaflet-extras/leaflet-providers">Leaflet-providers</a>. ' +
				'Click to add them to the map and you will find: ' +
				'the provider name(s) to use with Leaflet-providers and ' +
				'the JS required to include that layer in your own code without including ' +
				'<code>leaflet-providers.js</code>' +
				'</p>' +
				'<h4>Provider names</h4>';

			var providerNames = L.DomUtil.create('code', 'provider-names', container);

			L.DomUtil.create('h4', '', container).innerHTML = 'Copy to create your TileLayer:';
			var pre = L.DomUtil.create('pre', null, container);
			var code = L.DomUtil.create('code', 'javascript', pre);

			var update = function (event) {
				code.innerHTML = '';

				var names = [];

				// loop over the layers in the map and add the JS
				for (var key in map._layers) {
					var layer = map._layers[key];

					names.push(layer._providerName);
					var layerName = layer._providerName.replace('.', '_');

					// do not add the layer currently being removed
					if (event && event.type === 'layerremove' && layer === event.layer) {
						continue;
					}
					var tileLayerCode = 'var ' + layerName + ' = L.tileLayer(\'' + layer._url + '\', {\n';

					var options = layer._options;
					var first = true;
					for (var option in options) {
						if (first) {
							first = false;
						} else {
							tileLayerCode += ',\n';
						}
						tileLayerCode += '\t' + option + ': ';
						if (typeof options[option] === 'string') {
							tileLayerCode += "'" + escapeHtml(options[option]) + "'";
							//jshint quotmark:single
						} else {
							tileLayerCode += options[option];
						}
					}
					tileLayerCode += '\n});\n';
					code.innerHTML += tileLayerCode;

					providerNames.innerHTML = names.join(', ');
				};
				/* global hljs:true */
				hljs.highlightBlock(code);
			};

			map.on({
				'layeradd': update,
				'layerremove': update
			});
			update();

			return container;
		}
	}))());

})();