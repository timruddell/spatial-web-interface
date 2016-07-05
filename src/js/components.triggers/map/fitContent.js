const { createSelector } = require("reselect");

const contentTypes = {
    extent: "extent",
    featureSet: "featureSet",
    project: "project"
}

// Fits the state's fitted content to the map view.
// Currently support an ol.extent, or a FeatureSet ID as content.
const buildSelector = (map) => 
    createSelector([
        (state) => state.map.view.fittedContent,
        (state) => state.map.view.fittedContentType,

        (state) => state.projects.items,
        (state) => state.features.featureSets
    ], (
        // Named closure for recursive calling.
        function fitContent (content, contentType, projects, featureSets) {
            if (!content || !contentType) {
                return;
            }

            // Switch on content and detect type of argument.
            switch (contentType) {
                case contentTypes.extent:
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
                    return;

                case contentTypes.featureSet:
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
                        fitContent(extent, contentTypes.extent);
                    }

                    return;

                case contentTypes.project:
                    var project = _.find(projects, (p) => p.id === content);
                    var setIds = _.map(_.filter(featureSets, (fs) => fs.projectId === content), (fs) => fs.id);

                    // Find the remote layer group.
                    var remoteGroup = _.find(map.getLayers().getArray(), 
                        (l) => l instanceof ol.layer.Group && l.get("source") === "remote");

                    // Get the layer corresponding to the FeatureSet ID, and fit to its extent.
                    var layers = remoteGroup.getLayers().getArray();

                    var extent = _.reduce(setIds, (memo, id) => {
                        var layer = _.find(layers, (l) => l.get("featureSetId") === id);

                        return ol.extent.extend(memo, layer.getSource().getExtent());
                    }, ol.extent.createEmpty());

                    fitContent(extent, contentTypes.extent);

                default:
                    return;
            }
        }
    ));

module.exports = buildSelector;