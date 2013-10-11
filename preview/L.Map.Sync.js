/*
 * Extends L.Map to synchronize the interaction on one map to one or more other maps.
 */

(function () {
    'use strict';

    L.Map = L.Map.extend({
        sync: function (map) {
            var originalMap = this;
            this._syncMaps = this._syncMaps || [];

            this._syncMaps.push(L.extend(map, {
                setView: function (center, zoom, options, sync) {
                    if (!sync) {
                        originalMap._syncMaps.forEach(function (toSync) {
                            toSync.setView(center, zoom, options, true);
                        });
                    }
                    return L.Map.prototype.setView.call(this, center, zoom, options);
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
                }
            }));

            if (!originalMap.hasEventListeners('zoomend')) {
                originalMap.on('zoomend', function () {
                    originalMap._syncMaps.forEach(function (toSync) {
                        toSync.setView(originalMap.getCenter(), originalMap.getZoom(), {reset: false}, true);
                    });
                }, this);
            }

            originalMap.dragging._draggable._updatePosition = function () {
                L.Draggable.prototype._updatePosition.call(this);
                var self = this;
                originalMap._syncMaps.forEach(function (toSync) {
                    L.DomUtil.setPosition(toSync.dragging._draggable._element, self._newPos);
                    toSync.fire('moveend');
                });
            };

            return originalMap;
        }
    });

})();
