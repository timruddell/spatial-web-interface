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
    var standardSelectInteraction = new ol.interaction.Select();

    const buildSelectStyle = (feature) => {
        var layer = standardSelectInteraction.getLayer(feature);
        var layerStyle = layer.getStyleFunction()(feature);

        var stroke = layerStyle.getStroke();
        if (stroke) {
            stroke.setWidth(stroke.getWidth() * 2);
            // For now, just invert the stroke color of the selected feature.
            var color = stroke.getColor();
            stroke.setColor([255 - color[0], 255 - color[1], 255 - color[2], color[3]]);
        }

        return layerStyle;
    }

    const buildModifyStyle = (feature) => {
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

    const defaultInteractions = ol.interaction.defaults().getArray();

    const applyStandardInteractions = () => {
        activeInteractions.clear();
        activeInteractions.extend(defaultInteractions)
            .extend([
                standardSelectInteraction
            ]);
    }

    var selectOnEventKey = null;

    // Create the selector trigger.
    return createSelector([
        (state) => state.features.isEditingFeature
    ],
    
    (isEditingFeature) => {

        if (selectOnEventKey) {
            standardSelectInteraction.unByKey(selectOnEventKey);
        }
        selectOnEventKey = standardSelectInteraction.on("select", (event) => {
            // Do deselections first - strange behaviour when an item is selected again, it is also deleselcted.
            // Set styles explicitly against features here. Using a style function conflicts with the modify 
            // interaction's styling.
            event.deselected.forEach((f) => {
                dispatch(featureActions.flagFeatureAsSelected(f.getId(), false));
                f.setStyle(null);            
            });

            event.selected.forEach((f) => {
                dispatch(featureActions.flagFeatureAsSelected(f.getId(), true));

                // Set the selection style.
                if (isEditingFeature) {
                    f.setStyle(buildModifyStyle(f));
                }
                else {
                    f.setStyle(buildSelectStyle(f));
                }
                
            });
        });
        // Re-fire the selection event.

        // Clear all interactions and flush the standard select with an event.
        activeInteractions.clear();
        var selectedFeatures = standardSelectInteraction.getFeatures().getArray();

        if (selectedFeatures.length > 0) {
            standardSelectInteraction.dispatchEvent({
                deselected: [],
                selected: selectedFeatures,
                type: 'select'
            });
        }

        // Differring interaction logic if we're needing feature modifications.
        if (isEditingFeature) {

            var modifyInteraction = new ol.interaction.Modify({
                // Pull the selected features from the standard selector.
                features: standardSelectInteraction.getFeatures()
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

            activeInteractions.extend(defaultInteractions).extend([standardSelectInteraction, modifyInteraction]);
        }
        // Default to standard interactions.    
        else {
            applyStandardInteractions();
        }
    });
}

module.exports = buildSelector;