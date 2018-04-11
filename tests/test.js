/* global describe, chai, it */

function isEmpty (obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			return false;
		}
	}

	return true;
}

// List of valid options for L.TileLayer options to check options against
var validTileLayerOptions = [].concat(
	Object.keys(L.Layer.prototype.options),
	Object.keys(L.GridLayer.prototype.options),
	Object.keys(L.TileLayer.prototype.options)
);

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

// set difference on two arrays.
function difference (a, b) {
	var diff = a.slice(0);
	b.forEach(function (item) {
		if (diff.indexOf(item) !== -1) {
			diff.splice(diff.indexOf(item), 1);
		}
	});
	return diff;
}

describe('leaflet-providers', function () {
	chai.should();
	var providers = L.TileLayer.Provider.providers;

	describe('variant definition structure', function () {
		it('each provider has keys which are a subset of [url, options, variants]', function () {
			for (var name in providers) {
				providers[name].should.contain.all.keys('url');
				difference(
					Object.keys(providers[name]),
					['url', 'options', 'variants']
				).should.deep.equal([]);
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
						difference(Object.keys(variants[v]), ['url', 'options']).should.deep.equal([]);
					}
				}
			}
		});
	});

	describe('Nonexistant providers', function () {
		it('should fail for non-existant providers', function () {
			var fn = function () {
				L.tileLayer.provider('Example');
			};
			fn.should.throw('No such provider (Example)');
		});
		it('should fail for non-existant variants of existing providers', function () {
			var fn = function () {
				L.tileLayer.provider('OpenStreetMap.Example');
			};
			fn.should.throw('No such variant of OpenStreetMap (Example)');
		});
	});

	describe('Each layer', function () {
		L.tileLayer.provider.eachLayer(function (name) {
			describe(name, function () {
				var layer = L.tileLayer.provider(name);

				it('should be a L.TileLayer', function () {
					layer.should.be.an.instanceof(L.TileLayer);
				});

				it('should not throw while requesting a tile url', function () {
					layer.getTileUrl({x: 16369, y: 10896});
				});

				it('should have valid options', function () {
					for (var key in layer.options) {
						if (validTileLayerOptions.indexOf(key) !== -1) {
							continue;
						}
						var placeholder = '{' + key + '}';
						layer._url.should.contain(placeholder);
					}
				})
			});
		});
	})
});
