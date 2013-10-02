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
		if (provider === 'MapBox' || provider === 'CloudMade') {
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
			container.innerHTML = '<strong>Copy to create your TileLayer:</strong><br />';
			var pre = L.DomUtil.create('pre', '', container);
			var code = L.DomUtil.create('code', 'javascript', pre);

			var update = function (event) {
				code.innerHTML = '';

				// loop over the layers in the map and add the JS
				for (var key in map._layers) {
					var layer = map._layers[key];

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
							var string = options[option]
								.replace(/&/g, '&amp;')
								.replace(/</g, '&lt;')
								.replace(/>/g, '&gt;')
								.replace(/"/g, '&quot;')
								.replace(/'/g, '&#039;');
							//jshint quotmark:true
							tileLayerCode += "'" + string + "'";
							//jshint quotmark:single
						} else {
							tileLayerCode += options[option];
						}
					}
					tileLayerCode += '\n});\n';
					code.innerHTML += tileLayerCode;
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
				'in the layer control on the right. After selecting a layer, the source box in the bottom left ' +
				'corner shows the JS code required to include that layer in your own code.';
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