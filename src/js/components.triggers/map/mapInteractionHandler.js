const { createSelector } = require("reselect");
const featureActions = require("../../components.state/actions/featureActions");

// Handles setting and reseting map interactions based on the current map/feature action states.  
// Enables modification of Features belonging to the selected FeatureSet only.
const buildSelector = (map, dispatch) => {

    // Switch to 'Pointer' cursor when mouse goes over a feature.
    // Not really an interaction.
    map.on("pointermove", function (event) {
        var hit = map.hasFeatureAtPixel(event.pixel);
        map.getTargetElement().style.cursor = (hit ? 'pointer' : '');
    });

    var activeInteractions = map.getInteractions();

    // Standard selection interaction. Overidden by special selectors.
    var standardSelectInteraction = new ol.interaction.Select({
        // This function determines how to style the selected features.
        // Returning a non-null ol.style.Style overrides the default rendering style.
        style: (feature, resolution) => {
            // Feature styles come from layers.
            var featureSetId = feature.get("entity").featureSetId;

            var layers = _.find(map.getLayers().getArray(), 
                (l) => l instanceof ol.layer.Group && l.get("source") === "remote")
                .getLayers().getArray();

            var layer = _.find(layers, (l) => l.get("featureSetId") === featureSetId);
            var layerStyle = layer.getStyleFunction()(feature, resolution);

            var stroke = layerStyle.getStroke();
            if (stroke) {
                stroke.setWidth(stroke.getWidth() * 2);
                // For now, just invert the stroke color of the selected feature.
                var color = stroke.getColor();
                stroke.setColor([255 - color[0], 255 - color[1], 255 - color[2], color[3]]);
            }

            return layerStyle;
        }
    });

    standardSelectInteraction.on("select", (event) => {
        // TODO: dispatch selection/deselection action here.
        if (event.selected.length > 0) {
            event.selected.forEach((f) => {
                f.set("isSelected", true);
            });
        }

        event.deselected.forEach((f) => {
            f.set("isSelected", false);
        })
    });

    const defaultInteractions = ol.interaction.defaults().getArray();

    const applyStandardInteractions = () => {
        activeInteractions.clear();
        activeInteractions.extend(defaultInteractions)
            .extend([
                standardSelectInteraction
            ]);
    }

    return createSelector([
        (state) => _.find(state.features.featureSets, (fs) => fs.id === state.features.selectedFeatureSetId),
        (state) => state.features.selectedFeatureSetAction
    ],
    
    (selectedSet, selectedFeatureSetAction) => {

        activeInteractions.clear();
        standardSelectInteraction.getFeatures().clear();

        // Currently the only cause for non-standard interactions is when the selectedFeatureSetAction is non-null.
        switch (selectedFeatureSetAction) {
            case "EDIT":
                if (!selectedSet) {
                    applyStandardInteractions()
                    break;
                }

                var modifySelectInteraction = new ol.interaction.Select({
                    // Determine whether the layer corresponds to our set. Only allow modification of our layer.
                    layers (layer) {
                        return layer.get("featureSetId") === selectedSet.id
                    },

                    // Create a global style for feature editing.
                    style: (feature, resolution) => {
                        const gold = [255, 215, 0, 0.65];
                        const goldFill = [255, 215, 0, 0.15];

                        // Vertice style when editing.
                        var verticeHandle = new ol.style.Circle({
                            radius: 5,
                            fill: null,
                            stroke: new ol.style.Stroke({color: 'white', width: 2})
                        });

                        var styles = [
                            // Show the locations of the vertices for easier editing.
                            new ol.style.Style({
                                image: verticeHandle,
                                geometry: function(feature) {
                                    var coordinates = feature.getGeometry().getCoordinates()[0];
                                    return new ol.geom.MultiPoint(coordinates);
                                }
                            }),
                            // Default global edit style.
                            new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: goldFill
                                }),
                                stroke: new ol.style.Stroke({
                                    color: gold,
                                    width: 4
                                })
                            })
                        ];

                        return styles;
                    }
                });

                // Flag features as selected/deselected by dispatching actions.
                modifySelectInteraction.on("select", (event) => {
                    // TODO: dispatch
                });

                var modifyInteraction = new ol.interaction.Modify({
                    features: modifySelectInteraction.getFeatures()
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

                activeInteractions.extend(defaultInteractions).extend(
                    [modifySelectInteraction, modifyInteraction]);

                break;

            // Default to standard interactions.
            default:
                applyStandardInteractions();
                break;
        }
    });
}

module.exports = buildSelector;