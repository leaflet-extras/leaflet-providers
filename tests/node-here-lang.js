// Standalone Node test that loads leaflet-providers.js in CommonJS mode
// and verifies that the HERE provider's URL template uses the HERE v3
// `lang` query parameter (per https://www.here.com/docs/bundle/raster-tile-api-v3-api-reference/page/index.html#tag/Tiles/operation/getTile)
// rather than the invalid `lg` alias.
//
// This test runs without a browser because mocha-chrome cannot launch Chrome
// in the campaign's Windows environment (see issue #525). It is intentionally
// scoped to issue #685 so we keep the change minimal and focused.

'use strict';

var assert = require('node:assert/strict');
var path = require('node:path');

// Minimal Leaflet stub: only L.TileLayer.Provider is exercised.
// We monkey-patch getTileUrl below to template the URL the same way
// L.TileLayer.prototype.getTileUrl does in tests/test.js.
global.L = {
	TileLayer: function() {
	},
	tileLayer: function() {
		return {};
	},
	Util: {
		template: function(str, data) {
			// Mirror Leaflet's L.Util.template: replace {key} tokens.
			return String(str).replace(/\{ *([\w_ -]+) *\}/g, function(_, key) {
				var v = data[key];
				return v === undefined
					? ''
					: String(v);
			});
		}
	}
};
global.L.TileLayer.prototype = {
	_getSubdomain: function() {
		return 'a';
	}
};
global.L.TileLayer.extend = function(proto) {
	function Ctor() {}
	Ctor.prototype = proto;
	return Ctor;
};

// Load the provider module via its CommonJS entry point.
require(path.join(__dirname, '..', 'leaflet-providers.js'));
var providers = global.L.TileLayer.Provider.providers;

// Reproduce tests/test.js monkey-patch: template the URL with default opts.
function buildUrl(providerName, variantName, extra) {
	var parts = providerName.split('.');
	var providerEntry = providers[parts[0]];
	assert.ok(providerEntry, 'provider ' + parts[0] + ' must exist');

	var url = providerEntry.url;
	var options = Object.assign({}, providerEntry.options);

	if (parts[1] && providerEntry.variants && providerEntry.variants[parts[1]]) {
		var v = providerEntry.variants[parts[1]];
		if (typeof v === 'object') {
			if (v.options) {
				options = Object.assign({}, options, v.options);
			}
			if (v.url) {
				url = v.url;
			}
		} else if (typeof v === 'string') {
			options.variant = v;
		}
	}

	var data = Object.assign({
		r: '',
		s: 'a',
		x: 7273,
		y: 3224,
		z: 13
	}, options, extra || {});

	return global.L.Util.template(url, data);
}

var hereUrl = buildUrl('HERE', undefined, { apiKey: 'test-key' });

// Negative assertion (RED): the URL must not use the legacy `lg=` alias.
assert.doesNotMatch(
	hereUrl,
	/[?&]lg=/,
	'HERE provider URL must not contain the legacy `lg=` parameter; HERE v3 expects `lang=` (issue #685). Got: ' + hereUrl
);

// Positive assertion (GREEN): the URL must contain `lang=`.
assert.match(
	hereUrl,
	/[?&]lang=en(?![A-Za-z-])/,
	'HERE provider URL must contain `lang=<language>` per HERE v3 docs.'
);

console.log('here-lang-uses-lang-query: PASS');
console.log('  resolved URL: ' + hereUrl);
