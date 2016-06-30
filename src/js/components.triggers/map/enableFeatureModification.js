const { createSelector } = require("reselect");
const featureActions = require("../../components.state/actions/featureActions");

// Enables modification of Features belonging to the selected FeatureSet only.
const buildSelector = (map, dispatch) => {

        // Variables in closue for use by selector instance.
        var modifyLayerInteractionSet = [];

        return createSelector([
            (state) => state.features.selectedSet,
            (state) => state.features.selectedSetAction
        ],
        
        (selectedSet, selectedSetAction) => {
            // Remove our existing set modification interactions.
            var activeInteractions = map.getInteractions();
            _.each(modifyLayerInteractionSet, (i) => activeInteractions.remove(i));

            // This selector is only concerned with EDIT actions.
            if (!selectedSet || selectedSetAction !== 'EDIT') {
                return;
            }

            var selectInteraction = new ol.interaction.Select({
                // Determine whether the layer corresponds to our set. Only allow modification of our layer.
                layers (layer) {
                    return layer.get("featureSetId") === selectedSet.id
                }
            });

            var modifyInteraction = new ol.interaction.Modify({
                features: selectInteraction.getFeatures()
            });

            modifyInteraction.on("modifyend", (event) => {
                var geoJsonLoader = new ol.format.GeoJSON({ defaultDataProjection: "EPSG:3857" });

                _.each(event.features.getArray(), (f) => {
                    // Flag as modified if the feature was existing.
                    if (!!f.getId()) {
                        // Send the updated geometry to append to the state.
                        var geometry = geoJsonLoader.writeGeometry(f.getGeometry());

                        dispatch(featureActions.flagFeatureAsModified(f.getId(), geometry));
                    }
                });
            });

            modifyLayerInteractionSet = [selectInteraction, modifyInteraction];
            activeInteractions.extend(modifyLayerInteractionSet);
        });
}

module.exports = buildSelector;