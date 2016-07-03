const { createSelector } = require("reselect");

// Handles layer visibility from FeatureSet state.
const buildSelector = (map) => 
    createSelector([
        (state) => state.features.featureSets
    ],
    
    (featureSets) => {
        // Find the remote layer group.
        var remoteGroup = _.find(map.getLayers().getArray(), 
            (l) => l instanceof ol.layer.Group && l.get("source") === "remote");

        var layers = remoteGroup.getLayers();

        _.each(layers.getArray(), (layer) => {
            var set =  _.find(featureSets, (s) => s.id === layer.get("featureSetId"));

            if (!!set) {
                layer.setVisible(set.visible);
            }
        })
    });

module.exports = buildSelector;