// This is a list of example API codes, to make this preview
// functioning. Please register with the providers to use them
// with your own app.
var exampleAPIcodes = {
	HERE: {
		app_id: 'tFZyfnyJAmhfh5gdoGcR',
		app_code: 'vJ8o9OCQ1o0Y2wwbRspzSA'
	},
	Jawg: {
		accessToken: 'PyTJUlEU1OPJwCJlW1k0NC8JIt2CALpyuj7uc066O7XbdZCjWEL3WYJIk6dnXtps'
	},
	MapTilesAPI: {
		apikey: '91eb180eb9msh46beac27e6084cep17a106jsn18a17417dbb6'
	},
	Thunderforest: {
		apikey: 'db5ae1f5778a448ca662554581f283c5'
	},
	CartoDB: {
		apikey: 'cb1_2vcv_1_65e9288afee49d13d6eb7758'
	}
};

var origProviderInit = L.TileLayer.Provider.prototype.initialize;
L.TileLayer.Provider.include({
	initialize: function(providerName, options) {
		this._providerName = providerName;
		options = options || {};

		// replace example API codes in options
		var provider = this._providerName.split('.')[0];
		if (provider in exampleAPIcodes) {

			// overwrite exampleAPIcodes with a placeholder to prevent accidental use
			// of these API codes.
			this._exampleAPIcodes = {};
			for (var key in exampleAPIcodes[provider]) {
				this._exampleAPIcodes[key] = '<your ' + key + '>';
			}
			L.extend(options, exampleAPIcodes[provider]);
		}
		origProviderInit.call(this, providerName, options);
	}
});

// save the options while creating tilelayers to cleanly access them later.
var origTileLayerInit = L.TileLayer.prototype.initialize;
L.TileLayer.include({
	initialize: function(url, options) {
		this._options = options;
		origTileLayerInit.apply(this, arguments);
	}
});

L.tileLayer.provider.eachLayer = function(callback) {
	for (var provider in L.TileLayer.Provider.providers) {
		if (L.TileLayer.Provider.providers[provider].variants) {
			for (var variant in L.TileLayer.Provider.providers[provider].variants) {
				callback(provider + '.' + variant);
			}
		} else {
			callback(provider);
		}
	}
};

// Wrap the factory so every returned layer has the preview metadata that
// preview.js relies on (_providerName, getExampleJS). For L.TileLayer.Provider
// instances, _providerName is already set by the monkeypatched initialize above;
// for vector layers (L.MaplibreGL) that bypass that class, we set them here.
var origFactory = L.tileLayer.provider;
L.tileLayer.provider = function (name, options) {
	var layer = origFactory(name, options);
	if (!layer._providerName) {
		layer._providerName = name;
		// Mark that this layer type needs extra dependencies beyond Leaflet.
		layer._depsVector = [
			{ name: 'maplibre-gl', url: 'https://maplibre.org/maplibre-gl-js/' },
			{ name: 'maplibre-gl-leaflet', url: 'https://github.com/maplibre/maplibre-gl-leaflet' }
		];
	}
	if (!layer.getExampleJS) {
		layer.getExampleJS = function () {
			var layerName = name.replace('.', '_');

			// Create a provider instance to resolve the template URL & attribution
			var providerInstance = new L.TileLayer.Provider(name);
			var exampleCodes = providerInstance._exampleAPIcodes || {};
			var opts = L.extend({}, providerInstance.options, exampleCodes);
			var styleUrl = L.Util.template(providerInstance._url, opts);

			var code = 'var ' + layerName + ' = L.maplibreGL({\n';
			code += '\tstyle: \'' + styleUrl + '\'';
			if (providerInstance.options.attribution) {
				var attr = providerInstance.options.attribution
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#039;');
				code += ',\n\tattribution: \'' + attr + '\'';
			}
			code += '\n});\n';
			return code;
		};
	}
	return layer;
};
L.tileLayer.provider.eachLayer = origFactory.eachLayer;

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}
