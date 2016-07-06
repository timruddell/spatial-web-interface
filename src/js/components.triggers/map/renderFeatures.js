const { createSelector } = require("reselect");

// Parses serverside styles into OpenLayers styles (pure function).
const parseStyles = (styleObj, labelsVisible) => {

    // Provide a function that returns a style. Allows per-feature customization of styles
    // Especially useful for labels.
    return (mapFeature, resolution) => {

        if (!styleObj) {
            return null;
        }

        var fill, stroke, text;

        // Fill style.
        if (styleObj["fill"]) {
            fill = new ol.style.Fill(styleObj.fill);
        }

        if (styleObj["stroke"]) {
            stroke = new ol.style.Stroke(styleObj.stroke);
        }

        if (styleObj["text"] && labelsVisible) {
            var textStroke = {};
            if (styleObj.text["stroke"]) {
                textStroke = new ol.style.Stroke(styleObj.text.stroke);
            }

            var textFill = {};
            if (styleObj.text["fill"]) {
                textFill = new ol.style.Fill(styleObj.text.fill);
            }

            var textValue = "";
            var mapFeatureData = mapFeature.get("entity").data;
            if (mapFeatureData && styleObj.text.textDataField && mapFeatureData[styleObj.text.textDataField]) {
                // If we're rendering above the specified maxResolution, only show the text if we're below the threshold.
                if (!styleObj.text.maxResolution || resolution <= styleObj.text.maxResolution) {
                    textValue = mapFeatureData[styleObj.text.textDataField];
                }
            }

            text = new ol.style.Text(Object.assign({}, styleObj.text, { 
                stroke: textStroke, 
                fill: textFill ,
                text: textValue
            }));
        }

        return new ol.style.Style({ fill, stroke, text });
    }
}

// Renders the map features represented by the state FeatureSets.
const buildSelector = (map) => 
    createSelector([
        (state) => state.features.featureSets,
        (state) => state.features.items
    ],
    
    (featureSets, allFeatures) => {
        // Find the remote layer group.
        var remoteGroup = _.find(map.getLayers().getArray(), 
            (l) => l instanceof ol.layer.Group && l.get("source") === "remote");

        // Clear all vector layers from the remote group.
        var remoteLayers = remoteGroup.getLayers();
        remoteLayers.clear();

        // Load GeoJSON features in 3857 format.
        var geoJsonLoader = new ol.format.GeoJSON({ defaultDataProjection: "EPSG:3857" });

        _.each(_.sortBy(featureSets, "renderOrder"), (fs) => {
            var remoteVectorSource = new ol.source.Vector({});
            var vectorLayer = new ol.layer.Vector({ source: remoteVectorSource });

            // Attach the FeatureSet ID to the layer for later reference.
            vectorLayer.set("featureSetId", fs.id);

            // Parse serverside styles and set against layer.
            var style = parseStyles(fs.style, fs.labelsVisible);
            if (style) {
                vectorLayer.setStyle(style);
            }
            
            var setFeatures = _.filter(allFeatures, (f) => f.featureSetId === fs.id);

            remoteVectorSource.addFeatures(_.map(setFeatures, (f) => {
                var mapFeature = new ol.Feature({
                    geometry: geoJsonLoader.readGeometry(f.geometry)
                });

                // Provide the feature ID and data attributes to the map feature.
                mapFeature.setId(f.id);
                mapFeature.set("entity", f);

                return mapFeature;
            }));

            remoteLayers.push(vectorLayer);
        });
    });

module.exports = buildSelector;