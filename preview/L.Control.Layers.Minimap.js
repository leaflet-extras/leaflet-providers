/*
 * Leaflet.layerscontrol-minimap
 *
 * Layers control with synced minimaps for Leaflet.
 *
 * Jan Pieter Waagmeester <jieter@jieter.nl>
 */
(function () {
	'use strict';

	var cloneLayer = function (layer) {
		var options = layer.options;
		if (layer instanceof L.TileLayer) {
			return L.tileLayer(layer._url, options);
		}
		if (layer instanceof L.ImageOverlay) {
			return L.imageOverlay(layer._url, layer._bounds, options);
		}

		if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
			return L.polygon(layer.getLatLngs(), options);
		}
		if (layer instanceof L.Marker) {
			return L.marker(layer.getLatLng(), options);
		}
		if (layer instanceof L.circleMarker) {
			return L.circleMarker(layer.getLatLng(), options);
		}
		if (layer instanceof L.Polyline) {
			return L.polyline(layer.getLatLngs(), options);
		}
		if (layer instanceof L.MultiPolyline) {
			return L.polyline(layer.getLatLngs(), options);
		}
		if (layer instanceof L.MultiPolygon) {
			return L.MultiPolygon(layer.getLatLngs(), options);
		}
		if (layer instanceof L.Circle) {
			return L.circle(layer.getLatLng(), layer.getRadius(), options);
		}
		if (layer instanceof L.GeoJSON) {
			return L.geoJson(layer.toGeoJSON(), options);
		}

		// no interaction on minimaps, add FeatureGroup as LayerGroup
		if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
			var layergroup = L.layerGroup();
			layer.eachLayer(function (inner) {
				layergroup.addLayer(cloneLayer(inner));
			});
			return layergroup;
		}
	};

	L.Control.Layers.Minimap = L.Control.Layers.extend({
		options: {
			position: 'topright',
			topPadding: 10,
			bottomPadding: 40,
			overlayBackgroundLayer: L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-base/{z}/{x}/{y}.png', {
				attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
				subdomains: '0123',
				minZoom: 2,
				maxZoom: 18
			})
		},

		isCollapsed: function () {
			return !L.DomUtil.hasClass(this._container, 'leaflet-control-layers-expanded');
		},

		_expand: function () {
			L.Control.Layers.prototype._expand.call(this);
			this._onListScroll();
		},

		_initLayout: function () {
			L.Control.Layers.prototype._initLayout.call(this);

			L.DomUtil.addClass(this._container, 'leaflet-control-layers-minimap');
			L.DomEvent.on(this._container, 'scroll', this._onListScroll, this);
		},

		_update: function () {
			L.Control.Layers.prototype._update.call(this);

			this._map.on('resize', this._onResize, this);
			this._onResize();

			this._map.whenReady(this._onListScroll, this);
		},

		_addItem: function (obj) {
			var container = obj.overlay ? this._overlaysList : this._baseLayersList;
			var label = L.DomUtil.create('label', 'leaflet-minimap-container', container);
			var checked = this._map.hasLayer(obj.layer);

			this._createMinimap(
				L.DomUtil.create('div', 'leaflet-minimap', label),
				obj.layer,
				obj.overlay
			);
			var span = L.DomUtil.create('span', 'leaflet-minimap-label', label);

			var input;
			if (obj.overlay) {
				input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'leaflet-control-layers-selector';
				input.defaultChecked = checked;
			} else {
				input = this._createRadioElement('leaflet-base-layers', checked);
			}
			input.layerId = L.stamp(obj.layer);
			span.appendChild(input);

			L.DomEvent.on(label, 'click', this._onInputClick, this);

			var name = L.DomUtil.create('span', '', span);
			name.innerHTML = ' ' + obj.name;

			return label;
		},

		_onResize: function () {
			var mapHeight = this._map.getContainer().clientHeight;
			var controlHeight = this._container.clientHeight;

			if (controlHeight > mapHeight - this.options.bottomPadding) {
				this._container.style.overflowY = 'scroll';
			}
			this._container.style.maxHeight = (mapHeight - this.options.bottomPadding - this.options.topPadding) + 'px';
		},

		_onListScroll: function () {
			var minimaps = document.getElementsByClassName('leaflet-minimap-container');
			if (minimaps.length === 0) {
				return;
			}

			var first, last;
			if (this.isCollapsed()) {
				first = last = -1;
			} else {
				var minimapHeight = minimaps.item(0).clientHeight;
				var container = this._container;
				var listHeight = container.clientHeight;
				var scrollTop = container.scrollTop;

				first = Math.floor(scrollTop / minimapHeight);
				last = Math.ceil((scrollTop + listHeight) / minimapHeight);
			}

			for (var i = 0; i < minimaps.length; ++i) {
				var minimap = minimaps[i].childNodes.item(0);
				var map = minimap._miniMap;
				var layer = map._layer;

				if (!layer) {
					continue;
				}

				if (i >= first && i <= last) {
					if (!map.hasLayer(layer)) {
						layer.addTo(map);
					}
					map.invalidateSize();
				} else {
					if (map.hasLayer(layer)) {
						map.removeLayer(layer);
					}
				}
			}
		},

		_createMinimap: function (mapContainer, originalLayer, isOverlay) {
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
			if (isOverlay) {
				minimap._layer = L.layerGroup([
					cloneLayer(this.options.overlayBackgroundLayer),
					cloneLayer(originalLayer)
				]);
			} else {
				minimap._layer = cloneLayer(originalLayer);
			}

			var map = this._map;
			map.whenReady(function () {
				minimap.setView(map.getCenter(), map.getZoom());
				map.sync(minimap);
			});
		}
	});

	L.control.layers.minimap = function (baseLayers, overlays, options) {
		return new L.Control.Layers.Minimap(baseLayers, overlays, options);
	};

})();