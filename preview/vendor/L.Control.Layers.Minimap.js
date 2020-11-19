(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * Leaflet.layerscontrol-minimap
 *
 * Layers control with synced minimaps for Leaflet.
 *
 * Jan Pieter Waagmeester <jieter@jieter.nl>
 */
var cloneLayer = require('leaflet-clonelayer');

require('leaflet.sync');

L.Control.Layers.Minimap = L.Control.Layers.extend({
    options: {
        position: 'topright',
        topPadding: 10,
        bottomPadding: 40,
        overlayBackgroundLayer: L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
            attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; ' +
            'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
    },

    filter: function (string) {
        string = string.trim();

        var visibleLayers = {};
        var layerLabels = this._container.querySelectorAll('label');
        for (var i = 0; i < layerLabels.length; i++) {
            var layerLabel = layerLabels[i];

            if (string !== '' && layerLabel._layerName.indexOf(string) === -1) {
                L.DomUtil.addClass(layerLabel, 'leaflet-minimap-hidden');
            } else {
                L.DomUtil.removeClass(layerLabel, 'leaflet-minimap-hidden');
                visibleLayers[layerLabel._layerName] = cloneLayer(layerLabel._minimap._layer);
            }
        }
        this._onListScroll();

        return visibleLayers;
    },

    isCollapsed: function () {
        return !L.DomUtil.hasClass(this._container, 'leaflet-control-layers-expanded');
    },

    expand: function () {
        L.Control.Layers.prototype.expand.call(this);
        this._onListScroll();
    },

    _expand: function () {
        // backwards compatibility, should be removed when leaflet 1.1 arrives.
        this.expand();
    },

    _initLayout: function () {
        L.Control.Layers.prototype._initLayout.call(this);
        L.DomUtil.addClass(this._container, 'leaflet-control-layers-minimap');

        var scrollContainer = this._scrollContainer();
        L.DomEvent.on(scrollContainer, 'scroll', this._onListScroll, this);
        // disable scroll propagation, Leaflet is going to do this too
        // https://github.com/Leaflet/Leaflet/issues/5277
        L.DomEvent.disableScrollPropagation(scrollContainer)
    },

    _update: function () {
        L.Control.Layers.prototype._update.call(this);

        if (!this._map) { return; }
        this._map.on('resize', this._onResize, this);
        this._onResize();
        this._map.whenReady(this._onListScroll, this);
    },

    _addItem: function (obj) {
        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
        var label = L.DomUtil.create('label', 'leaflet-minimap-container', container);
        label._layerName = obj.name;
        var checked = this._map.hasLayer(obj.layer);

        label._minimap = this._createMinimap(
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
        this._layerControlInputs.push(input)
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

    _scrollContainer: function () {
        if (this.options.collapsed) {
            return this._container.querySelectorAll('.leaflet-control-layers-list')[0];
        } else {
            return this._container;
        }
    },

    _onListScroll: function () {
        if (!this._map) {
            return;
        }

        var minimaps = this._map._container.querySelectorAll('label[class="leaflet-minimap-container"]');
        if (minimaps.length === 0) {
            return;
        }

        // compute indexes of first and last minimap in view
        var first, last;
        if (this.isCollapsed()) {
            first = last = -1;
        } else {
            var minimapHeight = minimaps.item(0).clientHeight;
            var container = this._container;
            var scrollTop = this._scrollContainer().scrollTop;

            first = Math.floor(scrollTop / minimapHeight);
            last = Math.ceil((scrollTop + container.clientHeight) / minimapHeight);
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
            } else if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        }
    },

    _createMinimap: function (mapContainer, originalLayer, isOverlay) {
        var minimap = mapContainer._miniMap = L.map(mapContainer, {
            attributionControl: false,
            zoomControl: false,
            scrollWheelZoom: false
        });

        // disable minimap interaction.
        minimap.dragging.disable();
        minimap.touchZoom.disable();
        minimap.doubleClickZoom.disable();
        minimap.scrollWheelZoom.disable();

        // create tilelayer, but do not add it to the map yet
        // (only after it's scrolled into view).
        if (isOverlay && this.options.overlayBackgroundLayer) {
            // add a background for overlays if a background layer is defined.
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

        return minimap;
    }
});

L.control.layers.minimap = function (baseLayers, overlays, options) {
    return new L.Control.Layers.Minimap(baseLayers, overlays, options);
};

},{"leaflet-clonelayer":2,"leaflet.sync":3}],2:[function(require,module,exports){
function cloneOptions (options) {
    var ret = {};
    for (var i in options) {
        var item = options[i];
        if (item && item.clone) {
            ret[i] = item.clone();
        } else if (item instanceof L.Layer) {
            ret[i] = cloneLayer(item);
        } else {
            ret[i] = item;
        }
    }
    return ret;
}

function cloneInnerLayers (layer) {
    var layers = [];
    layer.eachLayer(function (inner) {
        layers.push(cloneLayer(inner));
    });
    return layers;
}

function cloneLayer (layer) {
    var options = cloneOptions(layer.options);

    // we need to test for the most specific class first, i.e.
    // Circle before CircleMarker

    // Renderers
    if (layer instanceof L.SVG) {
        return L.svg(options);
    }
    if (layer instanceof L.Canvas) {
        return L.canvas(options);
    }

    // GoogleMutant GridLayer
    if (L.GridLayer.GoogleMutant && layer instanceof L.GridLayer.GoogleMutant) {
        var googleLayer = L.gridLayer.googleMutant(options);

        layer._GAPIPromise.then(function () {
            var subLayers = Object.keys(layer._subLayers); 
     
            for (var i in subLayers) {
                googleLayer.addGoogleLayer(subLayers[i]);
            }
        });

        return googleLayer;
    }

    // Tile layers
    if (layer instanceof L.TileLayer.WMS) {
        return L.tileLayer.wms(layer._url, options);
    }
    if (layer instanceof L.TileLayer) {
        return L.tileLayer(layer._url, options);
    }
    if (layer instanceof L.ImageOverlay) {
        return L.imageOverlay(layer._url, layer._bounds, options);
    }

    // Marker layers
    if (layer instanceof L.Marker) {
        return L.marker(layer.getLatLng(), options);
    }

    if (layer instanceof L.Circle) {
        return L.circle(layer.getLatLng(), layer.getRadius(), options);
    }
    if (layer instanceof L.CircleMarker) {
        return L.circleMarker(layer.getLatLng(), options);
    }

    if (layer instanceof L.Rectangle) {
        return L.rectangle(layer.getBounds(), options);
    }
    if (layer instanceof L.Polygon) {
        return L.polygon(layer.getLatLngs(), options);
    }
    if (layer instanceof L.Polyline) {
        return L.polyline(layer.getLatLngs(), options);
    }

    if (layer instanceof L.GeoJSON) {
        return L.geoJson(layer.toGeoJSON(), options);
    }

    if (layer instanceof L.FeatureGroup) {
        return L.featureGroup(cloneInnerLayers(layer));
    }
    if (layer instanceof L.LayerGroup) {
        return L.layerGroup(cloneInnerLayers(layer));
    }

    throw 'Unknown layer, cannot clone this layer. Leaflet-version: ' + L.version;
}

if (typeof exports === 'object') {
    module.exports = cloneLayer;
}

},{}],3:[function(require,module,exports){
/*
 * Extends L.Map to synchronize the interaction on one map to one or more other maps.
 */

(function () {
    var NO_ANIMATION = {
        animate: false,
        reset: true,
        disableViewprereset: true
    };

    L.Sync = function () {};
    /*
     * Helper function to compute the offset easily.
     *
     * The arguments are relative positions with respect to reference and target maps of
     * the point to sync. If you provide ratioRef=[0, 1], ratioTarget=[1, 0] will sync the
     * bottom left corner of the reference map with the top right corner of the target map.
     * The values can be less than 0 or greater than 1. It will sync points out of the map.
     */
    L.Sync.offsetHelper = function (ratioRef, ratioTarget) {
        var or = L.Util.isArray(ratioRef) ? ratioRef : [0.5, 0.5];
        var ot = L.Util.isArray(ratioTarget) ? ratioTarget : [0.5, 0.5];
        return function (center, zoom, refMap, targetMap) {
            var rs = refMap.getSize();
            var ts = targetMap.getSize();
            var pt = refMap.project(center, zoom)
                           .subtract([(0.5 - or[0]) * rs.x, (0.5 - or[1]) * rs.y])
                           .add([(0.5 - ot[0]) * ts.x, (0.5 - ot[1]) * ts.y]);
            return refMap.unproject(pt, zoom);
        };
    };


    L.Map.include({
        sync: function (map, options) {
            this._initSync();
            options = L.extend({
                noInitialSync: false,
                syncCursor: false,
                syncCursorMarkerOptions: {
                    radius: 10,
                    fillOpacity: 0.3,
                    color: '#da291c',
                    fillColor: '#fff'
                },
                offsetFn: function (center, zoom, refMap, targetMap) {
                    // no transformation at all
                    return center;
                }
            }, options);

            // prevent double-syncing the map:
            if (this._syncMaps.indexOf(map) === -1) {
                this._syncMaps.push(map);
                this._syncOffsetFns[L.Util.stamp(map)] = options.offsetFn;
            }

            if (!options.noInitialSync) {
                map.setView(
                    options.offsetFn(this.getCenter(), this.getZoom(), this, map),
                    this.getZoom(), NO_ANIMATION);
            }
            if (options.syncCursor) {
                if (typeof map.cursor === 'undefined') {
                    map.cursor = L.circleMarker([0, 0], options.syncCursorMarkerOptions).addTo(map);
                }

                this._cursors.push(map.cursor);

                this.on('mousemove', this._cursorSyncMove, this);
                this.on('mouseout', this._cursorSyncOut, this);
            }

            // on these events, we should reset the view on every synced map
            // dragstart is due to inertia
            this.on('resize zoomend', this._selfSetView);
            this.on('moveend', this._syncOnMoveend);
            this.on('dragend', this._syncOnDragend);
            return this;
        },


        // unsync maps from each other
        unsync: function (map) {
            var self = this;

            if (this._cursors) {
                this._cursors.forEach(function (cursor, indx, _cursors) {
                    if (cursor === map.cursor) {
                        _cursors.splice(indx, 1);
                    }
                });
            }

            // TODO: hide cursor in stead of moving to 0, 0
            if (map.cursor) {
                map.cursor.setLatLng([0, 0]);
            }

            if (this._syncMaps) {
                this._syncMaps.forEach(function (synced, id) {
                    if (map === synced) {
                        delete self._syncOffsetFns[L.Util.stamp(map)];
                        self._syncMaps.splice(id, 1);
                    }
                });
            }

            if (!this._syncMaps || this._syncMaps.length == 0) {
                // no more synced maps, so these events are not needed.
                this.off('resize zoomend', this._selfSetView);
                this.off('moveend', this._syncOnMoveend);
                this.off('dragend', this._syncOnDragend);
            }

            return this;
        },

        // Checks if the map is synced with anything or a specifyc map
        isSynced: function (otherMap) {
            var has = (this.hasOwnProperty('_syncMaps') && Object.keys(this._syncMaps).length > 0);
            if (has && otherMap) {
                // Look for this specific map
                has = false;
                this._syncMaps.forEach(function (synced) {
                    if (otherMap == synced) { has = true; }
                });
            }
            return has;
        },


        // Callbacks for events...
        _cursorSyncMove: function (e) {
            this._cursors.forEach(function (cursor) {
                cursor.setLatLng(e.latlng);
            });
        },

        _cursorSyncOut: function (e) {
            this._cursors.forEach(function (cursor) {
                // TODO: hide cursor in stead of moving to 0, 0
                cursor.setLatLng([0, 0]);
            });
        },

        _selfSetView: function (e) {
            // reset the map, and let setView synchronize the others.
            this.setView(this.getCenter(), this.getZoom(), NO_ANIMATION);
        },

        _syncOnMoveend: function (e) {
            if (this._syncDragend) {
                // This is 'the moveend' after the dragend.
                // Without inertia, it will be right after,
                // but when inertia is on, we need this to detect that.
                this._syncDragend = false; // before calling setView!
                this._selfSetView(e);
                this._syncMaps.forEach(function (toSync) {
                    toSync.fire('moveend');
                });
            }
        },

        _syncOnDragend: function (e) {
            // It is ugly to have state, but we need it in case of inertia.
            this._syncDragend = true;
        },


        // overload methods on originalMap to replay interactions on _syncMaps;
        _initSync: function () {
            if (this._syncMaps) {
                return;
            }
            var originalMap = this;

            this._syncMaps = [];
            this._cursors = [];
            this._syncOffsetFns = {};

            L.extend(originalMap, {
                setView: function (center, zoom, options, sync) {
                    // Use this sandwich to disable and enable viewprereset
                    // around setView call
                    function sandwich (obj, fn) {
                        var viewpreresets = [];
                        var doit = options && options.disableViewprereset && obj && obj._events;
                        if (doit) {
                            // The event viewpreresets does an invalidateAll,
                            // that reloads all the tiles.
                            // That causes an annoying flicker.
                            viewpreresets = obj._events.viewprereset;
                            obj._events.viewprereset = [];
                        }
                        var ret = fn(obj);
                        if (doit) {
                            // restore viewpreresets event to its previous values
                            obj._events.viewprereset = viewpreresets;
                        }
                        return ret;
                    }

                    // Looks better if the other maps 'follow' the active one,
                    // so call this before _syncMaps
                    var ret = sandwich(this, function (obj) {
                        return L.Map.prototype.setView.call(obj, center, zoom, options);
                    });

                    if (!sync) {
                        originalMap._syncMaps.forEach(function (toSync) {
                            sandwich(toSync, function (obj) {
                                return toSync.setView(
                                    originalMap._syncOffsetFns[L.Util.stamp(toSync)](center, zoom, originalMap, toSync),
                                    zoom, options, true);
                            });
                        });
                    }

                    return ret;
                },

                panBy: function (offset, options, sync) {
                    if (!sync) {
                        originalMap._syncMaps.forEach(function (toSync) {
                            toSync.panBy(offset, options, true);
                        });
                    }
                    return L.Map.prototype.panBy.call(this, offset, options);
                },

                _onResize: function (event, sync) {
                    if (!sync) {
                        originalMap._syncMaps.forEach(function (toSync) {
                            toSync._onResize(event, true);
                        });
                    }
                    return L.Map.prototype._onResize.call(this, event);
                },

                _stop: function (sync) {
                    L.Map.prototype._stop.call(this);
                    if (!sync) {
                        originalMap._syncMaps.forEach(function (toSync) {
                            toSync._stop(true);
                        });
                    }
                }
            });

            originalMap.dragging._draggable._updatePosition = function () {
                L.Draggable.prototype._updatePosition.call(this);
                var self = this;
                originalMap._syncMaps.forEach(function (toSync) {
                    L.DomUtil.setPosition(toSync.dragging._draggable._element, self._newPos);
                    toSync.eachLayer(function (layer) {
                        if (layer._google !== undefined) {
                            var offsetFn = originalMap._syncOffsetFns[L.Util.stamp(toSync)];
                            var center = offsetFn(originalMap.getCenter(), originalMap.getZoom(), originalMap, toSync);
                            layer._google.setCenter(center);
                        }
                    });
                    toSync.fire('move');
                });
            };
        }
    });
})();

},{}]},{},[1]);
