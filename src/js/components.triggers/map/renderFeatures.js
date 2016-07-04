const { createSelector } = require("reselect");

// Parses serverside styles into OpenLayers styles (pure function).
const parseStyles = (styleString) => {
    if (!styleString) {
        return null;
    }

    // TODO: unsafe.
    var styleObj = JSON.parse(styleString);
    if (!styleObj) {
        return null;
    }

    var fill, stroke;

    // Fill style.
    if (styleObj["fill"]) {
        fill = new ol.style.Fill(styleObj.fill);
    }

    if (styleObj["stroke"]) {
        stroke = new ol.style.Stroke(styleObj.stroke);
    }

    return new ol.style.Style({ fill, stroke });
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

        _.each(featureSets, (fs) => {
            var remoteVectorSource = new ol.source.Vector({});
            var vectorLayer = new ol.layer.Vector({ source: remoteVectorSource });

            // Attach the FeatureSet ID to the layer for later reference.
            vectorLayer.set("featureSetId", fs.id);

            // Parse serverside styles and set against layer.
            var style = parseStyles(fs.style);
            if (style) {
                vectorLayer.setStyle(style);
            }
            
            var setFeatures = _.filter(allFeatures, (f) => f.featureSetId === fs.id);

            remoteVectorSource.addFeatures(_.map(setFeatures, (f) => {
                var mapFeature = new ol.Feature({
                    geometry: geoJsonLoader.readGeometry(f.geometry)
                });

                mapFeature.setId(f.id);

                return mapFeature;
            }));

            remoteLayers.push(vectorLayer);
        });
    });

module.exports = buildSelector;