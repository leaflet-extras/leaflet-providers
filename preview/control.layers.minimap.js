L.Control.Layers.Minimap = L.Control.Layers.extend({


	_initLayout: function () {
		var className = 'leaflet-control-layers-minimap',
		    container = this._container = L.DomUtil.create('div', className);

		//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
			L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		this._layerList = this._form = container;
	},

	_update: function () {
		if (!this._container) {
			return;
		}

		this._layerList.innerHTML = '';

		for (i in this._layers) {
			this._addItem(this._layers[i]);
		}
	},

	_addItem: function (obj) {
		var container = L.DomUtil.create('label', 'minimap-container', this._layerList);
		var checked = this._map.hasLayer(obj.layer);

		this._createMinimap(
			L.DomUtil.create('div', 'minimap', container),
			obj.layer
		);
		var span = L.DomUtil.create('span', 'label', container);

		input = L.DomUtil.create('input', 'leaflet-control-layers-selector', span);
		input.type = 'checkbox';
		input.defaultChecked = checked;
		input.layerId = L.stamp(obj.layer);

		L.DomEvent.on(container, 'click', this._onInputClick, this);

		var name = L.DomUtil.create('span', '', span);
		name.innerHTML = ' ' + obj.name;''

		return container;
	},

	_createMinimap: function (mapContainer, originalLayer) {
		var map = this._map;
		map.whenReady(function () {
			var mini = L.map(mapContainer, {
				attributionControl: false,
				zoomControl: false
			});
			mini.setView(map.getCenter(), Math.max(map.getZoom() - 3, 0));
			mini.invalidateSize();

			var layer = L.tileLayer.provider(originalLayer._providerName, originalLayer._properties).addTo(mini);

			mini.dragging.disable();
			mini.touchZoom.disable();
			mini.doubleClickZoom.disable();
			mini.scrollWheelZoom.disable();

			map.sync(mini);
		});
	}
});

L.control.layers.minimap = function (layers, options) {
	return new L.Control.Layers.Minimap(layers, options);
};