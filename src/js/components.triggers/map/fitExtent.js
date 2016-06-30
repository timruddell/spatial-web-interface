const { createSelector } = require("reselect");

// Fits the state's fitted extent onto the map.
const buildSelector = (map) => 
    createSelector([
        (state) => state.map.view.fittedExtent
    ], 
    
    (extent) => {
        if (!extent) {
            return;
        }

        var view = map.getView();

        // Do nice animations to the selected extent.
        var pan = ol.animation.pan({
            duration: 700,
            source: view.getCenter()
        });

        var zoom = ol.animation.zoom({
            duration: 700,
            resolution: view.getResolution(),
            source: view.getZoom()
        });

        map.beforeRender(pan, zoom);
        
        // TODO: calculate padding based on device metrics (i.e. percentage).
        view.fit(extent, map.getSize(), { padding: [60, 60, 60, 60]});

        // TODO: consider clearing fittedExtent state via action. This could be the
        // cause of a delayed render bug.
    });

module.exports = buildSelector;