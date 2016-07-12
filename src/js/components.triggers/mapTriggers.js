// Manually register all map trigger builders here.
// Triggers need to be ordered appropriately.
const triggerBuilders = [
    require("./map/changeBaseLayerSource"),
    require("./map/fitContent"),
    require("./map/renderFeatures"),
    require("./map/mapStateSelectHandler"),
    require("./map/mapFeatureModifyHandler"),
    require("./map/mapFeatureStyleHandler"),
    require("./map/mapFeatureDrawHandler")
];

// Collates and handles running all map related triggers.
class mapTriggers {

    constructor (openLayersMapInstance) {

        if (!openLayersMapInstance) {
            console.error("Can't subscribe to a NULL map instance.")
            return undefined;
        }

        this.map = openLayersMapInstance;
    }

    subscribeToStore (reduxStore) {
        // Build all triggers and pass the map context.
        this.triggers = _.map(triggerBuilders, (t) => t(this.map, reduxStore.dispatch));

        reduxStore.subscribe(() => {
            var state = reduxStore.getState();

            _.each(this.triggers, (t) => {
                t(state);
            });
        });
    }
}

module.exports = mapTriggers;