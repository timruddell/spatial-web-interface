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

    // TODO: move to separate file?
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

    // TODO: move to separate file?
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

        // Deactivate the selector while editing. The selected features will remain selected but
        // can't be changed.
        standardSelectInteraction.setActive(!isEditingFeature);

        if (selectOnEventKey) {
            standardSelectInteraction.unByKey(selectOnEventKey);
        }
        selectOnEventKey = standardSelectInteraction.on("select", (event) => {
            dispatch(featureActions.clearFeatureSelectedFlags());

            // Do deselections first - strange behaviour when an item is selected again, it is also deleselcted.
            // Set styles explicitly against features here. Using a style function conflicts with the modify 
            // interaction's styling.
            if (event.deselected.length > 0) {
                event.deselected.forEach((f) => {
                    f.setStyle(null);            
                });
            }

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
        var selectedFeatures = standardSelectInteraction.getFeatures();

        // If the feature is going to be edited - it needs to be re-selected in order to
        // receieve the modify styling.            
        if (selectedFeatures.getArray().length > 0 && isEditingFeature) {
            standardSelectInteraction.dispatchEvent({
                deselected: [],
                selected: selectedFeatures.getArray(),
                type: 'select'
            });
        }

        // If we're ending an edit, and need to go back to standard selection rules, simply
        // flush the selected list and re-select the feature from the state.
        if (!isEditingFeature) {
            selectedFeatures.clear();
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