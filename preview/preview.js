(function () {
	'use strict';

	var map = new L.Map('map', {
		zoomControl: false,
		center: [48, -3],
		zoom: 5
	});

	// This is a list of example API codes, to make this preview
	// functioning. Please register with the providers to use them
	// with your own app.
	var exampleAPIcodes = {
		'HERE': {
			'app_id': 'Y8m9dK2brESDPGJPdrvs',
			'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg'
		}
	};

	// save the options while creating tilelayers to cleanly access them later.
	var origTileLayerInit = L.TileLayer.prototype.initialize;
	L.TileLayer.include({
		initialize: function (url, options) {
			this._options = options;
			origTileLayerInit.apply(this, arguments);

			// replace example API codes in options
			if (this._providerName) {
				var provider = this._providerName.split('.')[0];
				if (provider in exampleAPIcodes) {
					L.extend(this.options, exampleAPIcodes[provider]);
				}
			}
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
			'Hydda.RoadsAndLabels'
		];

		return providerName.match('(' + overlayPatterns.join('|') + ')') !== null;
	};

	// Ignore some providers in the preview
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

	// add minimap control to the map
	var layersControl = L.control.layers.minimap(baseLayers, overlays, {
		collapsed: false
	}).addTo(map);

	// Pass a filter in the hash tag to show only layers containing that string
	// for example: #filter=Open
	var filterLayersControl = function () {
		var hash = window.location.hash;
		var filterIndex = hash.indexOf('filter=');
		if (filterIndex !== -1) {
			var filterString = hash.substr(filterIndex + 7).trim();
			layersControl.filter(filterString);
		}
	};
	L.DomEvent.on(window, 'hashchange', filterLayersControl);

	// Does not work if called immediately, so ugly hack to apply filter
	// at first page load
	setTimeout(filterLayersControl, 100);

	// add OpenStreetMap.Mapnik, or the first if it does not exist
	if (baseLayers['OpenStreetMap.Mapnik']) {
		baseLayers['OpenStreetMap.Mapnik'].addTo(map);
	} else {
		baseLayers[Object.keys(baseLayers)[0]].addTo(map);
	}

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
					var url = layer._url;
					var options = L.extend({}, layer._options);

					// replace {variant} in urls with the selected variant, since
					// keeping it in the options map doesn't make sense for one layer
					if (options.variant) {
						url = url.replace('{variant}', options.variant);
						delete options.variant;
					}
					var tileLayerCode = 'var ' + layerName + ' = L.tileLayer(\'' + url + '\', {\n';

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
							/* global JSON:true */
							tileLayerCode += JSON.stringify(options[option]);
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
