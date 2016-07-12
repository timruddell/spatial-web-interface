'use strict'

const { createSelector } = require("reselect");
const featureActions = require("../../components.state/actions/featureActions");

// Handles feature drawing interactions for new features.
const buildSelector = (map, dispatch) => {

    // Closure storage for currently active modify interaction.
    var mapDrawInteraction = null;

    //
    // Build and return selector.
    //
    return createSelector([
        (state) => state.features.isEditingFeature,
        (state) => state.features.items,
        (state) => state.features.featureSets
    ], 
    
    (isEditingFeature, features, featureSets) => {

        // Flush the interaction.
        if (mapDrawInteraction) {
            map.getInteractions().remove(mapDrawInteraction);
            mapDrawInteraction = null;
        }

        if (isEditingFeature) {
            var feature = _.first(_.filter(features, (f) => f.isSelected));
            
            // If the feature geometry is not null, then the feature should be modified, not drawn.
            if (!feature || feature.geometry !== null) {
                return;
            }

            var featureSet = _.find(featureSets, (fs) => fs.id === feature.featureSetId);
            var setLayer = map.getLayerByFeatureSetId(feature.featureSetId);

            const validDrawTypes = [ "Point", "LineString", "Polygon" ];
            if (validDrawTypes.indexOf(featureSet.geometryType) === -1) {
                console.error("Unsupported geometry drawing type " + featureSet.geometryType);
                return;
            }

            // Build a new interaction every time.
            var drawInteraction = new ol.interaction.Draw({
                type: featureSet.geometryType,
                features: setLayer.getSource().getFeatures()
            });

            // Only called after the very last point is drawn.
            drawInteraction.on("drawend", (event) => {
                var geoJsonLoader = new ol.format.GeoJSON({ defaultDataProjection: "EPSG:3857" });

                // Send the updated geometry to append to the state.
                var geometry = geoJsonLoader.writeGeometry(event.feature.getGeometry());
                dispatch(featureActions.updateFeatureState(feature.id, { geometry }));
            });

            mapDrawInteraction = drawInteraction;
            map.getInteractions().push(drawInteraction);
            
            return;
        }
    });
}

module.exports = buildSelector;
 