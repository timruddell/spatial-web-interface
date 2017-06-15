const { createSelector } = require("reselect");
const { olSource } = require("../../components.consts/MapConsts");

// Changes the map base layer source type on state change.
const buildSelector = (map) => 
    createSelector([
        (state) => state.map.sourceType
    ], 
    
    (sourceType) => {
        var layerCollection = map.getLayers();
        
        var baseLayer = _.find(layerCollection.getArray(), function (layer) { 
            return layer.get("key") === "base-layer"; 
        });

        layerCollection.remove(baseLayer);
        
        // Recreate the base layer with the new source type.
        baseLayer = new ol.layer.Tile({
            key: "base-layer",
            source: olSource
        });

        layerCollection.insertAt(0, baseLayer);
    });

module.exports = buildSelector;