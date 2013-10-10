(function () {
    'use strict';

	L.Control.Layers.Minimap = L.Control.Layers.extend({
		options: {
			position: 'bottomleft'
		},

		_initLayout: function () {
			var className = 'leaflet-control-layers-minimap',
			    container = this._container = L.DomUtil.create('div', className);
			container.id = 'layer-list';

			// Makes this work on IE10 Touch devices by stopping it from firing a
			// mouseout event when the touch is released
			container.setAttribute('aria-haspopup', true);

			if (!L.Browser.touch) {
				L.DomEvent.disableClickPropagation(container);
				L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
			} else {
				L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
			}

			this._layerList = this._form = container;

			L.DomEvent.on(this._layerList, 'scroll', this._onLayerListScroll);
		},

		_onLayerListScroll: function () {
			var minimaps = this.childNodes;

			var minimapHeight = minimaps[0].clientHeight;
			var listHeight = this.clientHeight;
			var scrollTop = this.scrollTop;

			var first = Math.floor(scrollTop / minimapHeight);
			var last = Math.ceil((scrollTop + listHeight) / minimapHeight);

			for (var i = 0; i < minimaps.length; ++i) {
				var mini = minimaps[i].childNodes.item(0);
				var map = mini._miniMap;
				var layer = map._layer;

				if (i >= first && i <= last) {
					if (!map.hasLayer(layer)) {
						layer.addTo(map);
					}
				} else {
					if (map.hasLayer(layer)) {
						map.removeLayer(layer);
					}
				}
			}
		},

		_update: function () {
			if (!this._container) {
				return;
			}
			this._layerList.innerHTML = '';

			for (var i in this._layers) {
				this._addItem(this._layers[i]);
			}

			var self = this;
			this._map.whenReady(function () {
				self._onLayerListScroll.call(self._layerList);
			});
		},

		_addItem: function (obj) {
			var container = L.DomUtil.create('label', 'minimap-container', this._layerList);
			var checked = this._map.hasLayer(obj.layer);

			this._createMinimap(
				L.DomUtil.create('div', 'minimap', container),
				obj.layer
			);
			var span = L.DomUtil.create('span', 'label', container);

			var input = L.DomUtil.create('input', 'leaflet-control-layers-selector', span);
			input.type = 'checkbox';
			input.defaultChecked = checked;
			input.layerId = L.stamp(obj.layer);

			L.DomEvent.on(container, 'click', this._onInputClick, this);

			var name = L.DomUtil.create('span', '', span);
			name.innerHTML = ' ' + obj.name;

			return container;
		},

		_createMinimap: function (mapContainer, originalLayer) {
			var minimap = mapContainer._miniMap = L.map(mapContainer, {
				attributionControl: false,
				zoomControl: false
			});

			// disable interaction.
			minimap.dragging.disable();
			minimap.touchZoom.disable();
			minimap.doubleClickZoom.disable();
			minimap.scrollWheelZoom.disable();

			// create tilelayer, but do not add it to the map yet.
			minimap._layer = L.tileLayer.provider(originalLayer._providerName, originalLayer._properties);

			var map = this._map;
			map.whenReady(function () {
				minimap.setView(map.getCenter(), map.getZoom());
				map.sync(minimap);
			});
		}
	});

	L.control.layers.minimap = function (layers, options) {
		return new L.Control.Layers.Minimap(layers, options);
	};

})();