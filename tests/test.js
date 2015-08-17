/* global describe, chai, it */

function isEmpty (obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			return false;
		}
	}

	return true;
}

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

describe('leaflet-providers', function () {
	chai.should();
	var providers = L.TileLayer.Provider.providers;

	describe('variant definition structure', function () {
		it('each provider has keys url, options, variants', function () {
			for (var name in providers) {
				providers[name].should.contain.any.keys('url', 'options', 'variants');
			}
		});
		it('each variant should be an object or a string', function () {
			for (var name in providers) {
				var variants = providers[name].variants;

				for (var v in variants) {
					if (typeof variants[v] === 'string' || isEmpty(variants[v])) {
						// string or empty object, which is fine.
						continue;
					} else {
						variants[v].should.be.an.instanceof(Object);
						variants[v].should.contain.any.keys('url', 'options');
					}
				}
			}
		});
	});

	L.tileLayer.provider.eachLayer(function (name) {
		describe(name, function () {
			var layer = L.tileLayer.provider(name);

			it('should be a L.TileLayer', function () {
				layer.should.be.an.instanceof(L.TileLayer);
			});

			it('should not throw while requesting a tile url', function () {
				layer.getTileUrl({x: 16369, y: 10896});
			});
		});
	});
});
