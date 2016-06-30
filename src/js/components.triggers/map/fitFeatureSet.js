const { createSelector } = require("reselect");
const mapActions = require("../../components.state/actions/mapActions");

// Fit the state's fitted FeatureSet onto the map context.
const buildSelector = (map, dispatch) => 
    createSelector([
        (state) => state.map.view.fittedFeatureSetId
    ], 
    
    (featureSetId) => {
        if (!featureSetId) {
            return;
        }

        // Find the remote layer group.
        var remoteGroup = _.find(map.getLayers().getArray(), 
            (l) => l instanceof ol.layer.Group && l.get("source") === "remote");

        // Get the layer corresponding to the FeatureSet ID, and fit to its extent.
        var layers = remoteGroup.getLayers().getArray();

        var layer = _.find(layers, (l) => {
            return l.get("featureSetId") === featureSetId;
        });

        if (!!layer) {
            var extent = layer.getSource().getExtent();
            dispatch(mapActions.fitExtentToView(extent));
        }
    });

module.exports = buildSelector;