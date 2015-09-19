var table = L.DomUtil.get('table');
var container = L.DomUtil.get('maps');

var map;

function addLayer (provider) {
	var layer = L.tileLayer.provider(provider);

	var url = layer._url.replace('{variant}', layer.options.variant);
	var options = L.extend({}, layer.options, layer._options);

	// we're only interested in layers with bounds here.
	if (!options.bounds) {
		return;
	}
	var bounds = L.latLngBounds(options.bounds);

	var row = L.DomUtil.create('tr', '', table);
	L.DomUtil.create('td', '', row).innerHTML = provider;

	L.DomEvent.on(row, 'click', function () {
		if (map && map.remove) {
			map.remove();
		}
		for (var i = 0; i < table.children.length; i++) {
			L.DomUtil.removeClass(table.children[i], 'active');
		}
		L.DomUtil.addClass(row, 'active');

		container.innerHTML = '';
		L.DomUtil.create('h2', '', container).innerHTML = provider;

		map = L.map(L.DomUtil.create('div', 'map', container)).setView([52, 4], 6);
		map.addLayer(L.tileLayer.provider('Acetate.basemap'))
		map.addLayer(layer);

		L.rectangle(options.bounds, {
			fill: false,
			weight: 2,
			opacity: 1
		}).addTo(map);

		map.fitBounds(options.bounds);
	});
}

L.tileLayer.provider.eachLayer(addLayer);
