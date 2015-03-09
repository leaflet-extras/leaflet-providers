// This is a list of example API codes, to make this preview
// functioning. Please register with the providers to use them
// with your own app.
var exampleAPIcodes = {
	'HERE': {
		'app_id': 'Y8m9dK2brESDPGJPdrvs',
		'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg'
	},
	'MapBox': 'MapBox.examples.map-i86nkdio'
};

var origProviderInit = L.TileLayer.Provider.prototype.initialize;
L.TileLayer.Provider.include({
	initialize: function (providerName, options) {
		this._providerName = providerName;
		options = options || {};

		// replace example API codes in options
		if (this._providerName === 'MapBox') {
			providerName = exampleAPIcodes.MapBox;
			this._exampleUrl = L.TileLayer.Provider.providers.MapBox.url('MapBox.\' + your_api_code + \'');
		} else {
			var provider = this._providerName.split('.')[0];
			if (provider in exampleAPIcodes) {
				L.extend(options, exampleAPIcodes[provider]);
			}
		}
		origProviderInit.call(this, providerName, options);
	}
});

// save the options while creating tilelayers to cleanly access them later.
var origTileLayerInit = L.TileLayer.prototype.initialize;
L.TileLayer.include({
	initialize: function (url, options) {
		this._options = options;
		origTileLayerInit.apply(this, arguments);
	}
});

L.tileLayer.provider.eachLayer = function (callback) {
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
