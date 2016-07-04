const { createSelector } = require("reselect");

// Fits the state's fitted content to the map view.
// Currently support an ol.extent, or a FeatureSet ID as content.
const buildSelector = (map) => 
    createSelector([
        (state) => state.map.view.fittedContent
    ], (
        // Named closure for recursive calling.
        function fitContent (content) {
            if (!content) {
                return;
            }

            // Switch on content and detect type of argument.

            // If the content is an Array, assume it is an OpenLayers extent. 
            if (_.isArray(content)) {
                var view = map.getView();

                // Do nice animations to the selected extent.
                var pan = ol.animation.pan({
                    duration: 700,
                    source: view.getCenter()
                });

                var zoom = ol.animation.zoom({
                    duration: 700,
                    resolution: view.getResolution(),
                    source: view.getZoom()
                });

                map.beforeRender(pan, zoom);
                
                // TODO: calculate padding based on device metrics (i.e. percentage).
                view.fit(content, map.getSize(), { padding: [60, 60, 60, 60]});
            } 

            // If the content is a number, assume it is the ID of a FeatureSet.
            else if (_.isNumber(content)) {
                // Find the remote layer group.
                var remoteGroup = _.find(map.getLayers().getArray(), 
                    (l) => l instanceof ol.layer.Group && l.get("source") === "remote");

                // Get the layer corresponding to the FeatureSet ID, and fit to its extent.
                var layers = remoteGroup.getLayers().getArray();

                var layer = _.find(layers, (l) => {
                    return l.get("featureSetId") === content;
                });

                if (!!layer) {
                    var extent = layer.getSource().getExtent();
                    // Recurisvely call this function with the extent.
                    fitContent(extent);
                }
            }
        }
    ));

module.exports = buildSelector;