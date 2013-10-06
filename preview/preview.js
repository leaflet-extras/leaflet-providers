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

	// Define the names of the layers that should be inserted in the control as
	// an overlay.
	var isOverlay = function (layer) {
		if (layer.match(/^(OpenWeatherMap|OpenSeaMap)/)) {
			return true;
		}
	};

	var isIgnored = function (layer) {
		if (layer.match(/^(CloudMade|MapBox)/)) {
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
	var baselayers = {};
	var overlays = {};
	var addLayer = function (name) {
		if (isOverlay(name)) {
			overlays[name] = L.tileLayer.provider(name);
		} else {
			baselayers[name] = L.tileLayer.provider(name);
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
	L.control.layers(baselayers, overlays, {collapsed: false}).addTo(map);
	baselayers['OpenStreetMap.Mapnik'].addTo(map);

	// Add the TileLayer source code control to the map
	map.addControl(new (L.Control.extend({
		options: {
			position: 'bottomleft'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-layers leaflet-providers-control');
			L.DomEvent.disableClickPropagation(container);
			L.DomUtil.create('h4', null, container).innerHTML = 'Provider names';
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
	map.addControl(new (L.Control.extend({
		options: {
			position: 'topleft'
		},
		onAdd: function () {
			var div = L.DomUtil.create('div', 'info');
			div.innerHTML =
				'<h4><a href="https://github.com/leaflet-extras/leaflet-providers">Leaflet-providers preview</a></h4>' +
				'This page shows all the layers available in ' +
				'<a href="https://github.com/leaflet-extras/leaflet-providers">Leaflet-providers</a> ' +
				'in the layer control on the right. After selecting a layer, the box in the bottom left ' +
				'corner shows the provider name(s) to use with Leaflet-providers, ' +
				'plus the Javascript code required to include that layer in your own code without including <code>leaflet-providers.js</code>.';
			return div;
		}
	}))());

	// resize layers control to fit into view.
	function resizeLayerControl() {
		var layerControlHeight = document.body.clientHeight - (10 + 50);
		var layerControl = document.getElementsByClassName('leaflet-control-layers-expanded')[0];

		layerControl.style.overflowY = 'auto';
		layerControl.style.maxHeight = layerControlHeight + 'px';
	}
	map.on('resize', resizeLayerControl);
	resizeLayerControl();
})();