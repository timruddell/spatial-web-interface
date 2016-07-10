const { createSelector } = require("reselect");

const mapActions = require("../../components.state/actions/mapActions");

// Pixel sizes of the vertical panes for calculating view offsets.
const paneSizes = {
    detail: {
        open: 230,
        closed: 0
    },
    navigation: {
        open: 230,
        closed: 50 
    }
}

const contentTypes = {
    extent: "extent",
    feature: "feature",
    featureSet: "featureSet",
    project: "project"
}

// Fits the state's fitted content to the map view.
// Currently support an ol.extent, or a FeatureSet ID as content.
const buildSelector = (map, dispatch) => {
    
    const fitExtent = (extent, detailPaneIsOpen) => {
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

        // Calcualte the view offset required based on open vertical panes. Translate the offset
        // by the calculated percentage.
        // These calculations do not currently support many device metrics.
        {
            var windowWidth = $(window).width();
            var detailPaneWidth = detailPaneIsOpen ? paneSizes.detail.open : paneSizes.detail.closed;
            var navPaneWidth = !$(".sidebar-collapse").length ? paneSizes.navigation.open : paneSizes.navigation.closed;

            // Get the proportional width taken up by panes.
            var proportion = (detailPaneWidth + navPaneWidth) / windowWidth;

            // Get the spatial width of the extent to fit.
            var spatialWidth = extent[2] - extent[0];
            // Translate the extent to the right, based on the proportion.
            extent[0] = extent[0] + spatialWidth * proportion;
            extent[2] = extent[2] + spatialWidth * proportion;
        }

        // Once the extent is fitted, clear the state so the same item can be fitted again.
        // Clear first in case the fitting fails and doesn't return.
        dispatch(mapActions.fitContentToView(null, null));

        // TODO: calculate padding based on device metrics (i.e. percentage).
        view.fit(extent, map.getSize(), { padding: [60, 60, 60, 60]});
    }

    return createSelector([
        (state) => state.map.view.fittedContent,
        (state) => state.map.view.fittedContentType,

        (state) => state.projects.items,
        (state) => state.features.items,
        (state) => state.features.featureSets,

        (state) => state.layout.detailPaneIsOpen
    ], 
    
    (content, contentType, projects, features, featureSets, detailPaneIsOpen) => {
        if (!content || !contentType) {
            return;
        }

        // Switch on content and detect type of argument.
        switch (contentType) {
            case contentTypes.extent:
                if (ol.extent.isEmpty(content)) {
                    return;
                }

                fitExtent(content, detailPaneIsOpen);

                return;

            case contentTypes.feature:
                var featureEntity = _.find(features, (f) => f.id === content);

                // Find the remote layer group.
                var remoteGroup = _.find(map.getLayers().getArray(), 
                    (l) => l instanceof ol.layer.Group && l.get("source") === "remote");

                // Get the layer corresponding to the FeatureSet ID, and fit to its extent.
                var layers = remoteGroup.getLayers().getArray();
                var layer = _.find(layers, (l) => l.get("featureSetId") === featureEntity.featureSetId );

                var feature = layer.getSource().getFeatureById(content);
                var extent = feature.getGeometry().getExtent();

                fitExtent(extent, detailPaneIsOpen);

                return;

            case contentTypes.featureSet:
                // Find the remote layer group.
                var remoteGroup = _.find(map.getLayers().getArray(), 
                    (l) => l instanceof ol.layer.Group && l.get("source") === "remote");

                // Get the layer corresponding to the FeatureSet ID, and fit to its extent.
                var layers = remoteGroup.getLayers().getArray();

                var layer = _.find(layers, (l) => l.get("featureSetId") === content );

                if (!!layer) {
                    var extent = layer.getSource().getExtent();
                    fitExtent(extent, detailPaneIsOpen);
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

                fitExtent(extent, detailPaneIsOpen);

                return;

            default:
                return;
        }
    });
}

module.exports = buildSelector;