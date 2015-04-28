var eachLayer = function (callback) {
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


describe('L.Sync', function () {
	chai.should();
	eachLayer(function (name) {

	});
});
