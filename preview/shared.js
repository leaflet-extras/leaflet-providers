// This is a list of example API codes, to make this preview
// functioning. Please register with the providers to use them
// with your own app.
var exampleAPIcodes = {
	'HERE': {
		'app_id': 'oenPwMCqbQkUSqj1WhRx',
		'app_code': 'kBxLcdTofTHUlsT7tl2X5w'
	},
	'MapBox': {
		'id': 'mapbox.streets',
		'accessToken': 'pk.eyJ1IjoiZ3V0ZW55ZSIsImEiOiJmNjJlMDNmYTUyMzNjMzQxZmY4Mzc1ZmFiYmExNjMxOSJ9.xgl1PBwQV9CtwW-usedrcQ'
	},
	'Thunderforest': {
		'apikey': 'db5ae1f5778a448ca662554581f283c5'
	}
};

var origProviderInit = L.TileLayer.Provider.prototype.initialize;
L.TileLayer.Provider.include({
	initialize: function (providerName, options) {
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

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (searchString, position) {
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}
