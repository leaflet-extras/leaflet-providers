L.TileLayer.prototype._tileOnError = function () {
	var layer = this._layer;
	if (layer.errorContainer) {
		layer.errorContainer.innerHTML = '<span class="fail">seems to be not supported</span>';
	}
};

var table = L.DomUtil.get('table');
var container = L.DomUtil.get('maps');

function addLayer(provider) {
	var layer = L.tileLayer.provider(provider);
	var url = layer._url.replace('{variant}', layer.options.variant);
	var options = L.extend({}, layer.options, layer._options);

	if (url.indexOf('http:') === 0) {
		url = url.slice(5);
	} else if (url.indexOf('https:') === 0) {
		url = url.slice(6);
	}

	var row = L.DomUtil.create('tr', '', table);
	L.DomUtil.create('td', '', row).innerHTML = provider;
	var result = L.DomUtil.create('td', '', row);

	if (layer._url.indexOf('//') === 0) {
		result.innerHTML = '<span class="ok">☑ Supported</span>';
	} else {
		var but = L.DomUtil.create('button', '', result);
		but.innerHTML = 'test...';
	}

	L.DomEvent.on(result, 'click', function () {
		var center = [52, 4];
		if ('bounds' in options) {
			center = options.bounds.getCenter();
		}
		result.innerHTML = 'testing...';
		container.innerHTML = '';
		L.DomUtil.create('h2', '', container).innerHTML = provider + ' (http):';

		var map1 = L.map(L.DomUtil.create('div', 'map', container)).setView(center, 9);
		map1.addLayer(L.tileLayer('http:' + url, options));

		L.DomUtil.create('h2', '', container).innerHTML = provider + ' (https):';
		var map2 = L.map(L.DomUtil.create('div', 'map', container)).setView(center, 9);
		var httpsLayer = L.tileLayer('https:' + url, options);

		map2.addLayer(httpsLayer);

		httpsLayer.errorContainer = result;
		httpsLayer.on('load', function () {
			result.innerHTML = '<span class="ok">seems to be OK</span>';
		});
	});
}

L.tileLayer.provider.eachLayer(addLayer);
