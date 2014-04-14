(function () {
	'use strict';

	var map = new L.Map('map', {
		zoomControl: false,
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

	var isOverlay = function (providerName) {
		var overlayPatterns = [
			'^(OpenWeatherMap|OpenSeaMap)',
			'OpenMapSurfer.AdminBounds',
			'Stamen.Toner(Hybrid|Lines|Labels)',
			'Acetate.(foreground|labels|roads)',
		];

		return providerName.match('(' + overlayPatterns.join('|') + ')') !== null;
	};

	var isIgnored = function (providerName) {
		var ignorePattern = /^(MapBox|OpenSeaMap)/;

		return providerName.match(ignorePattern) !== null;
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
	var baseLayers = {};
	var overlays = {};

	var addLayer = function (name) {
		if (isOverlay(name)) {
			overlays[name] = L.tileLayer.provider(name);
		} else {
			baseLayers[name] = L.tileLayer.provider(name);
		}
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

	L.control.layers.minimap(baseLayers, overlays, {
		collapsed: false
	}).addTo(map);
	baseLayers['OpenStreetMap.Mapnik'].addTo(map);

	// Add the TileLayer source code control to the map
	map.addControl(new (L.Control.extend({
		options: {
			position: 'topleft'
		},
		onAdd: function (map) {
			var container = L.DomUtil.get('info');
			L.DomEvent.disableClickPropagation(container);

			L.DomUtil.create('h4', null, container).innerHTML = 'Provider names for <code>leaflet-providers.js</code>';
			var providerNames = L.DomUtil.create('code', 'provider-names', container);

			L.DomUtil.create('h4', '', container).innerHTML = 'Plain JavaScript:';
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
							//jshint quotmark:double
							tileLayerCode += "'" + escapeHtml(options[option]) + "'";
							//jshint quotmark:single
						} else {
							tileLayerCode += options[option];
						}
					}
					tileLayerCode += '\n});\n';
					code.innerHTML += tileLayerCode;

					providerNames.innerHTML = names.join(', ');
				}
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
