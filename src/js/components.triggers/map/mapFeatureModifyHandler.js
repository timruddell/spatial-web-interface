'use strict'

const { createSelector } = require("reselect");
const featureActions = require("../../components.state/actions/featureActions");

// Handles feature modification interactions.
const buildSelector = (map, dispatch) => {

    // Closure storage for currently active modify interaction.
    var mapModifyInteraction = null;

    //
    // Build and return selector.
    //
    return createSelector([
        (state) => state.features.isEditingFeature,
        (state) => state.features.items
    ], 
    
    (isEditingFeature, features) => {

        // Flush the modification interaction.
        if (mapModifyInteraction) {
            map.getInteractions().remove(mapModifyInteraction);
            mapModifyInteraction = null;
        }

        if (isEditingFeature) {
            var feature = _.first(_.filter(features, (f) => f.isSelected));

            if (feature) {
                var mapFeature = map.getMapFeatureById(feature.id);

                 // Build a new interaction every time.
                var modifyInteraction = new ol.interaction.Modify({
                    features: new ol.Collection([mapFeature])
                });

                modifyInteraction.on("modifyend", (event) => {
                    var geoJsonLoader = new ol.format.GeoJSON({ defaultDataProjection: "EPSG:3857" });

                    _.each(event.features.getArray(), (f) => {
                        // Flag as modified if the feature was existing.
                        if (!!f.getId()) {
                            // Send the updated geometry to append to the state.
                            var geometry = geoJsonLoader.writeGeometry(f.getGeometry());
                            dispatch(featureActions.updateFeatureState(f.getId(), { geometry }));
                        }
                    });
                });

                mapModifyInteraction = modifyInteraction;
                map.getInteractions().push(modifyInteraction);
                
                return;
            }
        }
    });
}

module.exports = buildSelector;
 