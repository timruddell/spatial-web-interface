const { createSelector } = require("reselect");

// Handles styling map features based on their application state.
const buildSelector = (map, dispatch) => {

    // TODO: move to separate file?
    const buildSelectStyle = (feature) => {
        var layer = map.getLayerByFeatureId(feature.getId());
        var layerStyle = layer.getStyleFunction()(feature, map.getSize());

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


    //
    // Create the selector trigger.
    //
    return createSelector([
        (state) => state.features.isEditingFeature,

        // Changes to both FeatureSets and Features cause map re-renders, therefore we need
        // to restyle features on changes to both.
        (state) => state.features.items,
        (state) => state.features.featureSets
    ],
    
    (isEditingFeature, features) => {

        // Get the selected feature from the state.
        var selectedFeature = _.find(features, (f) => f.isSelected);

        if (!selectedFeature) {
            return;
        }

        // Get the map feature corresponding to the selected entity.
        var mapFeature = map.getMapFeatureById(selectedFeature.id);

        mapFeature.setStyle(isEditingFeature 
            ? buildModifyStyle(mapFeature) 
            : buildSelectStyle(mapFeature));
    });
}

module.exports = buildSelector;